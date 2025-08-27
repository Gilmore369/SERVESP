/**
 * Environment Variables Verification Script
 * 
 * This script verifies that all environment variables and configuration
 * are properly set for the ServesPlatform application.
 * 
 * Usage:
 * 1. Open browser console (F12) on your ServesPlatform application
 * 2. Copy and paste this script
 * 3. Run: verifyEnvironment()
 */

/**
 * Expected environment variables for ServesPlatform
 */
const EXPECTED_ENV_VARS = {
  // API Configuration
  NEXT_PUBLIC_API_URL: {
    description: 'Google Apps Script API URL',
    required: true,
    expectedPattern: /script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/,
    example: 'https://script.google.com/macros/s/AKfycbw.../exec'
  },
  NEXT_PUBLIC_API_TOKEN: {
    description: 'API authentication token',
    required: true,
    minLength: 10,
    example: 'serves-platform-2024-api-key'
  },
  
  // Application Configuration
  NEXT_PUBLIC_APP_NAME: {
    description: 'Application name',
    required: false,
    example: 'ServesPlatform'
  },
  NEXT_PUBLIC_APP_VERSION: {
    description: 'Application version',
    required: false,
    example: '1.0.0'
  },
  
  // Environment Settings
  NODE_ENV: {
    description: 'Node environment',
    required: true,
    allowedValues: ['development', 'production', 'test'],
    example: 'development'
  }
};

/**
 * Check if we're in a Next.js environment
 */
function detectEnvironment() {
  const env = {
    isNextJS: typeof window !== 'undefined' && window.__NEXT_DATA__,
    isBrowser: typeof window !== 'undefined',
    isNode: typeof process !== 'undefined',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
  };
  
  console.log('🌍 Environment Detection:');
  console.log(`   Browser: ${env.isBrowser ? '✅' : '❌'}`);
  console.log(`   Next.js: ${env.isNextJS ? '✅' : '❌'}`);
  console.log(`   Node.js: ${env.isNode ? '✅' : '❌'}`);
  console.log(`   User Agent: ${env.userAgent}`);
  
  return env;
}

/**
 * Get environment variables from various sources
 */
function getEnvironmentVariables() {
  const envVars = {};
  
  // Try to get from process.env (Node.js/Next.js)
  if (typeof process !== 'undefined' && process.env) {
    Object.assign(envVars, process.env);
  }
  
  // Try to get from window (browser with Next.js)
  if (typeof window !== 'undefined') {
    // Next.js exposes public env vars on window
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId) {
      // Try to access Next.js runtime config
      try {
        const config = window.__NEXT_DATA__.runtimeConfig || {};
        Object.assign(envVars, config);
      } catch (e) {
        console.warn('Could not access Next.js runtime config');
      }
    }
    
    // Check for manually exposed env vars
    if (window.ENV) {
      Object.assign(envVars, window.ENV);
    }
  }
  
  return envVars;
}

/**
 * Verify a single environment variable
 */
function verifyEnvVar(name, value, config) {
  const result = {
    name,
    value: value || 'NOT SET',
    status: 'unknown',
    issues: []
  };
  
  // Check if required
  if (config.required && !value) {
    result.status = 'error';
    result.issues.push('Required variable is not set');
    return result;
  }
  
  if (!value) {
    result.status = 'warning';
    result.issues.push('Optional variable is not set');
    return result;
  }
  
  // Check pattern
  if (config.expectedPattern && !config.expectedPattern.test(value)) {
    result.status = 'error';
    result.issues.push(`Value doesn't match expected pattern`);
  }
  
  // Check allowed values
  if (config.allowedValues && !config.allowedValues.includes(value)) {
    result.status = 'error';
    result.issues.push(`Value must be one of: ${config.allowedValues.join(', ')}`);
  }
  
  // Check minimum length
  if (config.minLength && value.length < config.minLength) {
    result.status = 'error';
    result.issues.push(`Value must be at least ${config.minLength} characters long`);
  }
  
  // If no issues found, mark as success
  if (result.issues.length === 0) {
    result.status = 'success';
  }
  
  return result;
}

/**
 * Test API connectivity with current environment
 */
async function testAPIConnectivity(apiUrl, apiToken) {
  if (!apiUrl || !apiToken) {
    return {
      success: false,
      error: 'Missing API URL or token'
    };
  }
  
  try {
    const url = new URL(apiUrl);
    url.searchParams.append('token', apiToken);
    url.searchParams.append('action', 'whoami');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
      responseTime: 'N/A'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate configuration recommendations
 */
function generateRecommendations(results) {
  const recommendations = [];
  
  results.forEach(result => {
    if (result.status === 'error') {
      const config = EXPECTED_ENV_VARS[result.name];
      recommendations.push({
        variable: result.name,
        issue: result.issues.join(', '),
        solution: `Set ${result.name}=${config.example}`,
        description: config.description
      });
    }
  });
  
  return recommendations;
}

/**
 * Main verification function
 */
async function verifyEnvironment() {
  console.log('🔍 Starting Environment Verification...\n');
  
  // Detect environment
  const env = detectEnvironment();
  
  // Get environment variables
  console.log('\n📋 Checking Environment Variables...');
  const envVars = getEnvironmentVariables();
  
  // Verify each expected variable
  const results = [];
  Object.entries(EXPECTED_ENV_VARS).forEach(([name, config]) => {
    const value = envVars[name];
    const result = verifyEnvVar(name, value, config);
    results.push(result);
    
    const statusIcon = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      unknown: '❓'
    }[result.status];
    
    console.log(`${statusIcon} ${name}: ${result.value === 'NOT SET' ? result.value : '***'}${result.issues.length > 0 ? ' (' + result.issues.join(', ') + ')' : ''}`);
  });
  
  // Test API connectivity if we have the required vars
  console.log('\n🌐 Testing API Connectivity...');
  const apiUrl = envVars.NEXT_PUBLIC_API_URL;
  const apiToken = envVars.NEXT_PUBLIC_API_TOKEN;
  
  const connectivityResult = await testAPIConnectivity(apiUrl, apiToken);
  
  if (connectivityResult.success) {
    console.log('✅ API connectivity test passed');
  } else {
    console.log(`❌ API connectivity test failed: ${connectivityResult.error}`);
  }
  
  // Generate summary
  console.log('\n📊 Summary:');
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`✅ Success: ${successCount}`);
  console.log(`⚠️  Warnings: ${warningCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`🌐 API Connectivity: ${connectivityResult.success ? 'Working' : 'Failed'}`);
  
  // Generate recommendations
  const recommendations = generateRecommendations(results);
  
  if (recommendations.length > 0) {
    console.log('\n🔧 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.variable} - ${rec.description}`);
      console.log(`   Issue: ${rec.issue}`);
      console.log(`   Solution: ${rec.solution}`);
    });
  }
  
  // Environment-specific instructions
  console.log('\n📝 Environment Setup Instructions:');
  
  if (env.isNextJS) {
    console.log('   Next.js detected - Environment variables should be in:');
    console.log('   • .env.local (for local development)');
    console.log('   • .env.production (for production)');
    console.log('   • Vercel dashboard (if deployed on Vercel)');
  } else {
    console.log('   • Create .env file in project root');
    console.log('   • Add environment variables to your deployment platform');
  }
  
  console.log('\n   Required format for .env file:');
  Object.entries(EXPECTED_ENV_VARS).forEach(([name, config]) => {
    if (config.required) {
      console.log(`   ${name}=${config.example}`);
    }
  });
  
  // Store results for inspection
  const fullResults = {
    environment: env,
    variables: results,
    connectivity: connectivityResult,
    recommendations: recommendations
  };
  
  window.envVerificationResults = fullResults;
  console.log('\n💾 Results stored in window.envVerificationResults');
  
  return fullResults;
}

/**
 * Quick check for critical variables
 */
function quickEnvCheck() {
  console.log('⚡ Quick Environment Check...');
  
  const envVars = getEnvironmentVariables();
  const critical = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_API_TOKEN'];
  
  critical.forEach(name => {
    const value = envVars[name];
    const status = value ? '✅' : '❌';
    console.log(`${status} ${name}: ${value ? 'SET' : 'NOT SET'}`);
  });
}

// Export functions for console use
window.envVerification = {
  verifyEnvironment,
  quickEnvCheck,
  detectEnvironment,
  getEnvironmentVariables,
  testAPIConnectivity
};

console.log('🔧 Environment Verification Script loaded!');
console.log('📋 Available commands:');
console.log('   • await verifyEnvironment() - Run complete environment verification');
console.log('   • quickEnvCheck() - Quick check of critical variables');
console.log('   • detectEnvironment() - Detect current environment');
console.log('   • getEnvironmentVariables() - List all environment variables');