// Debug script to test token issue
// Replace this with your new deployment URL
const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID_HERE/exec';
const API_TOKEN = 'demo-token-2024';

async function testTokenIssue() {
  console.log('Testing token issue...');
  
  // Test 1: Simple health check with token as query parameter
  const params = new URLSearchParams();
  params.append('token', API_TOKEN);
  params.append('action', 'health');
  
  const url = `${API_BASE_URL}?${params.toString()}`;
  console.log('Request URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text (first 500 chars):', text.substring(0, 500));
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Not valid JSON, showing raw response');
    }
    
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testTokenIssue();