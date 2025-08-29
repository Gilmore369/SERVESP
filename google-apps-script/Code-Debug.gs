/**
 * Debug version of Google Apps Script to understand parameter parsing
 */

const CONFIG = {
  get API_TOKEN() {
    return (
      PropertiesService.getScriptProperties().getProperty("API_TOKEN") ||
      "demo-token-2024"
    );
  }
};

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  try {
    console.log("=== DEBUG REQUEST START ===");
    console.log("Method: " + method);
    console.log("Event object exists: " + (!!e));
    
    if (e) {
      console.log("e.parameter exists: " + (!!e.parameter));
      console.log("e.postData exists: " + (!!e.postData));
      
      if (e.parameter) {
        console.log("e.parameter keys: " + Object.keys(e.parameter).join(", "));
        console.log("e.parameter content: " + JSON.stringify(e.parameter));
      }
      
      if (e.postData) {
        console.log("e.postData.type: " + e.postData.type);
        console.log("e.postData.length: " + e.postData.length);
        console.log("e.postData.contents: " + e.postData.contents);
      }
    }
    
    // Initialize parameters
    if (!e) e = { parameter: {}, postData: null };
    if (!e.parameter) e.parameter = {};

    let params = e.parameter;

    // Handle POST data
    if (e.postData && e.postData.contents) {
      try {
        const postData = JSON.parse(e.postData.contents);
        console.log("Parsed POST data: " + JSON.stringify(postData));
        params = { ...params, ...postData };
      } catch (error) {
        console.log("Failed to parse POST data: " + error.message);
      }
    }

    console.log("Final params: " + JSON.stringify(params));
    console.log("Token from params: '" + params.token + "'");
    console.log("Expected token: '" + CONFIG.API_TOKEN + "'");
    console.log("=== DEBUG REQUEST END ===");

    // Simple response
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        debug: {
          method: method,
          hasEvent: !!e,
          hasParameter: !!(e && e.parameter),
          hasPostData: !!(e && e.postData),
          parameterKeys: e && e.parameter ? Object.keys(e.parameter) : [],
          params: params,
          tokenReceived: params.token,
          tokenExpected: CONFIG.API_TOKEN,
          tokenMatch: params.token === CONFIG.API_TOKEN
        }
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Debug handler error: " + error.message);
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: false,
        error: error.message,
        stack: error.stack
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}