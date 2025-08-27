/**
 * ServesPlatform Google Apps Script Backend
 * BACKUP OF ORIGINAL CODE - Created before implementing fixes
 * Date: 2025-01-27
 */

/**
 * ServesPlatform Google Apps Script Backend
 * Main entry point for the API
 */

// Configuration - Set these in Script Properties
const CONFIG = {
  SHEET_ID: PropertiesService.getScriptProperties().getProperty("SHEET_ID"),
  API_TOKEN: PropertiesService.getScriptProperties().getProperty("API_TOKEN"),
  JWT_SECRET: PropertiesService.getScriptProperties().getProperty("JWT_SECRET"),
  ENVIRONMENT:
    PropertiesService.getScriptProperties().getProperty("ENVIRONMENT") ||
    "production",
};

/**
 * Main GET handler
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Main POST handler
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Main request handler with CORS support
 */
function handleRequest(e) {
  try {
    // Ensure e exists and has proper structure
    if (!e) {
      e = { parameter: {}, postData: null };
    }
    if (!e.parameter) {
      e.parameter = {};
    }

    // Get data from parameters (GET request)
    let requestData = e.parameter || {};

    // Parse any JSON strings in parameters
    Object.keys(requestData).forEach((key) => {
      if (
        typeof requestData[key] === "string" &&
        (requestData[key].startsWith("{") || requestData[key].startsWith("["))
      ) {
        try {
          requestData[key] = JSON.parse(requestData[key]);
        } catch (parseError) {
          // Keep as string if not valid JSON
        }
      }
    });

    // Validate API token
    const apiToken = requestData.token || e.parameter.token;
    if (!apiToken || apiToken !== CONFIG.API_TOKEN) {
      return createErrorResponse("Invalid API token", 401);
    }

    // Route to appropriate handler
    const action = requestData.action || e.parameter.action;

    // Create a new event object with the merged data
    const enhancedEvent = {
      ...e,
      parameter: requestData,
      postData: {
        contents: JSON.stringify(requestData),
      },
    };

    switch (action) {
      case "auth":
        return handleAuthWithAudit(enhancedEvent);
      case "whoami":
        return handleWhoAmI(enhancedEvent);
      case "crud":
        return handleCRUDWithAudit(enhancedEvent);
      case "createUser":
        return handleCreateUserWithAudit(enhancedEvent);
      case "updateUser":
        return handleUpdateUserWithAudit(enhancedEvent);
      case "deactivateUser":
        return handleDeactivateUser(enhancedEvent);
      default:
        return createErrorResponse("Invalid action", 400);
    }
  } catch (error) {
    console.error("Request handling error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

/**
 * Create CORS response for preflight requests
 */
function createCORSResponse() {
  return ContentService.createTextOutput("").setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Create error response with CORS headers
 */
function createErrorResponse(message, status = 400) {
  const response = {
    ok: false,
    message: message,
    timestamp: new Date().toISOString(),
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Create success response with CORS headers
 */
function createSuccessResponse(data) {
  const response = {
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Initialize script properties (run once during setup)
 */
function initializeProperties() {
  const properties = PropertiesService.getScriptProperties();

  // Set default properties with the correct values
  properties.setProperties({
    SHEET_ID: "1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U",
    API_TOKEN: "demo-token-2024",
    JWT_SECRET: "mi-secreto-jwt-super-seguro-2024",
    ENVIRONMENT: "development",
  });

  console.log("Script properties initialized with correct values.");
}