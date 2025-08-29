// Test script to verify configuration
console.log('🔍 Testing configuration...');

// Test environment variables
console.log('Environment variables:');
console.log('  NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('  NEXT_PUBLIC_API_TOKEN:', process.env.NEXT_PUBLIC_API_TOKEN);

// Test API connectivity
const testUrl = 'https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec?token=demo-token-2024&action=health';

console.log('\n🌐 Testing API connectivity...');
console.log('Test URL:', testUrl);

fetch(testUrl)
  .then(response => {
    console.log('✅ Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Response data:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });