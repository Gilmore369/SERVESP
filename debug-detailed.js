// Detailed debug script to understand the token issue
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec';
const API_TOKEN = 'demo-token-2024';

async function debugTokenIssue() {
  console.log('=== Debugging Token Issue ===');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('API_TOKEN:', API_TOKEN);
  
  // Test 1: Direct GET request with token in query string
  console.log('\n--- Test 1: GET with query parameters ---');
  const params1 = new URLSearchParams();
  params1.append('token', API_TOKEN);
  params1.append('action', 'health');
  
  const url1 = `${API_BASE_URL}?${params1.toString()}`;
  console.log('URL:', url1);
  
  try {
    const response1 = await fetch(url1, {
      method: 'GET',
      mode: 'cors',
    });
    
    console.log('Status:', response1.status);
    const text1 = await response1.text();
    console.log('Response length:', text1.length);
    console.log('First 200 chars:', text1.substring(0, 200));
    
    if (text1.startsWith('{')) {
      try {
        const data = JSON.parse(text1);
        console.log('Parsed JSON:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('JSON parse error:', e.message);
      }
    }
  } catch (error) {
    console.error('Request 1 failed:', error.message);
  }
  
  // Test 2: POST request with form data
  console.log('\n--- Test 2: POST with form data ---');
  const formData = new FormData();
  formData.append('token', API_TOKEN);
  formData.append('action', 'health');
  
  try {
    const response2 = await fetch(API_BASE_URL, {
      method: 'POST',
      mode: 'cors',
      body: formData
    });
    
    console.log('Status:', response2.status);
    const text2 = await response2.text();
    console.log('Response length:', text2.length);
    console.log('First 200 chars:', text2.substring(0, 200));
    
    if (text2.startsWith('{')) {
      try {
        const data = JSON.parse(text2);
        console.log('Parsed JSON:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('JSON parse error:', e.message);
      }
    }
  } catch (error) {
    console.error('Request 2 failed:', error.message);
  }
  
  // Test 3: POST request with JSON body
  console.log('\n--- Test 3: POST with JSON body ---');
  try {
    const response3 = await fetch(API_BASE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: API_TOKEN,
        action: 'health'
      })
    });
    
    console.log('Status:', response3.status);
    const text3 = await response3.text();
    console.log('Response length:', text3.length);
    console.log('First 200 chars:', text3.substring(0, 200));
    
    if (text3.startsWith('{')) {
      try {
        const data = JSON.parse(text3);
        console.log('Parsed JSON:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('JSON parse error:', e.message);
      }
    }
  } catch (error) {
    console.error('Request 3 failed:', error.message);
  }
}

debugTokenIssue();