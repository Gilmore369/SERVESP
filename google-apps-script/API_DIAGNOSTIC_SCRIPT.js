/**
 * ServesPlatform API Diagnostic Script
 * 
 * This script can be run in the browser console to test all API endpoints
 * and diagnose connection issues with the Google Apps Script backend.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Run: await runFullDiagnostic()
 */

// Configuration - Update these values if needed
const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec',
  API_TOKEN: 'serves-platform-2024-api-key',
  TIMEOUT: 10000 // 10 seconds
};

// Test credentials
const TEST_CREDENTIALS = {
  email: 'admin@servesplatform.com',
  password: 'admin123'
};

/**
 * Utility function to make API requests with timeout
 */
async function makeAPIRequest(params, description) {
  console.log(`🔍 Testing: ${description}`);
  
  const url = new URL(API_CONFIG.BASE_URL);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const startTime = performance.now();
    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    clearTimeout(timeoutId);

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const textData = await response.text();
      console.warn(`⚠️  Non-JSON response received:`, textData.substring(0, 200));
      responseData = { error: 'Non-JSON response', data: textData };
    }

    const result = {
      success: response.ok,
      status: response.status,
      responseTime: responseTime,
      data: responseData,
      url: url.toString()
    };

    if (response.ok) {
      console.log(`✅ ${description} - ${responseTime}ms`);
    } else {
      console.error(`❌ ${description} - Status: ${response.status}`);
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`❌ ${description} - Error:`, error.message);
    return {
      success: false,
      error: error.message,
      url: url.toString()
    };
  }
}

/**
 * Test basic connectivity to the API
 */
async function testConnectivity() {
  console.log('\n🌐 Testing Basic Connectivity...');
  
  const result = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'whoami'
  }, 'Basic connectivity test');

  return result;
}

/**
 * Test authentication endpoint
 */
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  const result = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'auth',
    email: TEST_CREDENTIALS.email,
    password: TEST_CREDENTIALS.password
  }, 'Authentication with test credentials');

  return result;
}

/**
 * Test CRUD operations for materials
 */
async function testMaterialsCRUD() {
  console.log('\n📦 Testing Materials CRUD Operations...');
  
  const results = {};

  // Test list materials
  results.list = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud',
    operation: 'list',
    table: 'materials'
  }, 'List materials');

  // Test get specific material
  results.get = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud',
    operation: 'get',
    table: 'materials',
    id: 'MAT001'
  }, 'Get specific material');

  // Test create material
  results.create = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud',
    operation: 'create',
    table: 'materials',
    descripcion: 'Test Material',
    categoria: 'Test Category',
    unidad: 'kg',
    costo_ref: '100'
  }, 'Create new material');

  // Test update material
  results.update = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud',
    operation: 'update',
    table: 'materials',
    id: 'MAT001',
    descripcion: 'Updated Test Material'
  }, 'Update material');

  // Test delete material
  results.delete = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud',
    operation: 'delete',
    table: 'materials',
    id: 'MAT001'
  }, 'Delete material');

  return results;
}

/**
 * Test error handling scenarios
 */
async function testErrorHandling() {
  console.log('\n⚠️  Testing Error Handling...');
  
  const results = {};

  // Test invalid token
  results.invalidToken = await makeAPIRequest({
    token: 'invalid-token',
    action: 'whoami'
  }, 'Invalid API token');

  // Test missing parameters
  results.missingParams = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud'
    // Missing operation and table
  }, 'Missing required parameters');

  // Test invalid operation
  results.invalidOperation = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'crud',
    operation: 'invalid',
    table: 'materials'
  }, 'Invalid CRUD operation');

  // Test invalid action
  results.invalidAction = await makeAPIRequest({
    token: API_CONFIG.API_TOKEN,
    action: 'invalid-action'
  }, 'Invalid action');

  return results;
}

/**
 * Verify environment variables and configuration
 */
function verifyEnvironmentConfig() {
  console.log('\n🔧 Verifying Environment Configuration...');
  
  const checks = {
    apiUrl: {
      value: API_CONFIG.BASE_URL,
      valid: API_CONFIG.BASE_URL && API_CONFIG.BASE_URL.includes('script.google.com'),
      description: 'Google Apps Script URL'
    },
    apiToken: {
      value: API_CONFIG.API_TOKEN ? '***' + API_CONFIG.API_TOKEN.slice(-4) : 'NOT SET',
      valid: API_CONFIG.API_TOKEN && API_CONFIG.API_TOKEN.length > 10,
      description: 'API Token'
    },
    timeout: {
      value: API_CONFIG.TIMEOUT + 'ms',
      valid: API_CONFIG.TIMEOUT > 0,
      description: 'Request Timeout'
    }
  };

  Object.entries(checks).forEach(([key, check]) => {
    const status = check.valid ? '✅' : '❌';
    console.log(`${status} ${check.description}: ${check.value}`);
  });

  return checks;
}

/**
 * Generate troubleshooting report
 */
function generateTroubleshootingSteps(results) {
  console.log('\n🔧 Troubleshooting Steps:');
  
  const issues = [];
  
  if (!results.connectivity?.success) {
    issues.push({
      issue: 'Cannot connect to API',
      steps: [
        '1. Verify the Google Apps Script URL is correct',
        '2. Check if the script is deployed as a web app',
        '3. Ensure the script has proper permissions',
        '4. Check network connectivity and firewall settings'
      ]
    });
  }
  
  if (!results.auth?.success) {
    issues.push({
      issue: 'Authentication failing',
      steps: [
        '1. Verify test credentials are correct',
        '2. Check if auth function is implemented in the script',
        '3. Ensure API token is valid',
        '4. Check for CORS issues'
      ]
    });
  }
  
  if (!results.materials?.list?.success) {
    issues.push({
      issue: 'Materials CRUD operations failing',
      steps: [
        '1. Verify CRUD functions are implemented in the script',
        '2. Check if mock data is properly configured',
        '3. Ensure proper error handling is in place',
        '4. Verify table parameter is being processed correctly'
      ]
    });
  }

  if (issues.length === 0) {
    console.log('✅ No major issues detected! API appears to be working correctly.');
  } else {
    issues.forEach((issue, index) => {
      console.log(`\n❌ Issue ${index + 1}: ${issue.issue}`);
      issue.steps.forEach(step => console.log(`   ${step}`));
    });
  }
  
  console.log('\n📋 General Troubleshooting Tips:');
  console.log('   • Check browser console for detailed error messages');
  console.log('   • Verify Google Apps Script logs for server-side errors');
  console.log('   • Test API endpoints individually to isolate issues');
  console.log('   • Ensure all required parameters are being sent');
  console.log('   • Check for CORS issues if requests are failing');
}

/**
 * Run complete diagnostic suite
 */
async function runFullDiagnostic() {
  console.log('🚀 Starting ServesPlatform API Diagnostic...\n');
  
  const startTime = performance.now();
  
  // Verify configuration
  const config = verifyEnvironmentConfig();
  
  // Run all tests
  const results = {
    config: config,
    connectivity: await testConnectivity(),
    auth: await testAuthentication(),
    materials: await testMaterialsCRUD(),
    errorHandling: await testErrorHandling()
  };
  
  const endTime = performance.now();
  const totalTime = Math.round(endTime - startTime);
  
  // Generate summary
  console.log('\n📊 Diagnostic Summary:');
  console.log(`⏱️  Total time: ${totalTime}ms`);
  
  const successCount = Object.values(results).filter(result => 
    result && (result.success || (typeof result === 'object' && Object.values(result).some(r => r?.success)))
  ).length;
  
  console.log(`✅ Successful tests: ${successCount}`);
  console.log(`❌ Failed tests: ${Object.keys(results).length - successCount}`);
  
  // Generate troubleshooting steps
  generateTroubleshootingSteps(results);
  
  // Store results globally for inspection
  window.diagnosticResults = results;
  console.log('\n💾 Results stored in window.diagnosticResults for detailed inspection');
  
  return results;
}

/**
 * Quick connectivity test
 */
async function quickTest() {
  console.log('⚡ Running quick connectivity test...');
  const result = await testConnectivity();
  return result;
}

/**
 * Test specific endpoint
 */
async function testEndpoint(action, params = {}) {
  const allParams = {
    token: API_CONFIG.API_TOKEN,
    action: action,
    ...params
  };
  
  return await makeAPIRequest(allParams, `Custom test: ${action}`);
}

// Export functions for console use
window.apiDiagnostic = {
  runFullDiagnostic,
  quickTest,
  testEndpoint,
  testConnectivity,
  testAuthentication,
  testMaterialsCRUD,
  testErrorHandling,
  verifyEnvironmentConfig,
  config: API_CONFIG
};

console.log('🔧 API Diagnostic Script loaded!');
console.log('📋 Available commands:');
console.log('   • await runFullDiagnostic() - Run complete diagnostic suite');
console.log('   • await quickTest() - Quick connectivity test');
console.log('   • await testEndpoint("action", {params}) - Test specific endpoint');
console.log('   • apiDiagnostic.config - View/modify configuration');