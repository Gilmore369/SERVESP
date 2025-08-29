/**
 * ServesPlatform Google Apps Script Backend - SIMPLE VERSION
 * Versión simplificada para debugging
 */

const CONFIG = {
  get API_TOKEN() {
    return (
      PropertiesService.getScriptProperties().getProperty("API_TOKEN") ||
      "demo-token-2024"
    );
  },

  get SHEET_ID() {
    return (
      PropertiesService.getScriptProperties().getProperty("SHEET_ID") ||
      "1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U"
    );
  },
};

/**
 * Handle GET requests
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Main request handler
 */
function handleRequest(e) {
  try {
    // Initialize parameters
    if (!e) e = { parameter: {} };
    if (!e.parameter) e.parameter = {};

    const params = e.parameter;

    // Validate API token
    const token = params.token;
    if (!token || token !== CONFIG.API_TOKEN) {
      return createErrorResponse("Invalid API token", 401);
    }

    const action = params.action;

    // Handle different actions
    switch (action) {
      case "whoami":
        return handleWhoAmI();
      case "health":
        return handleHealthCheck();
      default:
        return createErrorResponse("Invalid action: " + action, 400);
    }
  } catch (error) {
    return createErrorResponse("Internal server error: " + error.message, 500);
  }
}

/**
 * Handle whoami request
 */
function handleWhoAmI() {
  const user = {
    id: "user_admin_001",
    email: "admin@servesplatform.com",
    name: "Administrador",
    role: "admin",
    status: "active",
  };

  return createSuccessResponse(user);
}

/**
 * Handle health check
 */
function handleHealthCheck() {
  try {
    const sheetId = CONFIG.SHEET_ID;
    let sheetsInfo = [];

    if (sheetId) {
      try {
        const spreadsheet = SpreadsheetApp.openById(sheetId);
        const sheets = spreadsheet.getSheets();

        sheetsInfo = sheets.map((sheet) => ({
          name: sheet.getName(),
          rows: sheet.getLastRow(),
          columns: sheet.getLastColumn(),
        }));
      } catch (sheetError) {
        return createSuccessResponse({
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "2.1.0",
          sheet_error: sheetError.message,
          sheet_id: sheetId,
          sheets: [],
        });
      }
    }

    return createSuccessResponse({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "2.1.0",
      sheet_id: sheetId,
      sheets: sheetsInfo,
    });
  } catch (error) {
    return createErrorResponse("Health check failed: " + error.message, 500);
  }
}

/**
 * Create success response
 */
function createSuccessResponse(data) {
  const response = {
    ok: true,
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
  };

  const output = ContentService.createTextOutput(
    JSON.stringify(response)
  ).setMimeType(ContentService.MimeType.JSON);

  // Add CORS headers
  output.getHeaders()["Access-Control-Allow-Origin"] = "*";
  output.getHeaders()["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  output.getHeaders()["Access-Control-Allow-Headers"] = "Content-Type";

  return output;
}

/**
 * Create error response
 */
function createErrorResponse(message, status) {
  const response = {
    ok: false,
    success: false,
    error: true,
    message: message,
    status: status,
    timestamp: new Date().toISOString(),
  };

  const output = ContentService.createTextOutput(
    JSON.stringify(response)
  ).setMimeType(ContentService.MimeType.JSON);

  // Add CORS headers
  output.getHeaders()["Access-Control-Allow-Origin"] = "*";
  output.getHeaders()["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  output.getHeaders()["Access-Control-Allow-Headers"] = "Content-Type";

  return output;
}
