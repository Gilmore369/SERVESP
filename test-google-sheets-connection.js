/**
 * Test Google Sheets Connection
 * Script para probar la conectividad con Google Sheets
 */

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec';
const API_TOKEN = 'demo-token-2024';

async function testConnection() {
  console.log('🔍 Testing Google Sheets Connection...');
  console.log('📍 API URL:', API_BASE_URL);
  console.log('🔑 API Token:', API_TOKEN);
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Check...');
    const healthUrl = `${API_BASE_URL}?action=health&token=${API_TOKEN}`;
    console.log('🌐 Health URL:', healthUrl);
    
    const healthResponse = await fetch(healthUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('📊 Health Response Status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('✅ Health Data:', JSON.stringify(healthData, null, 2));
    
    // Test 2: Dashboard Stats
    console.log('\n2️⃣ Testing Dashboard Stats...');
    const statsUrl = `${API_BASE_URL}?action=getDashboardStats&token=${API_TOKEN}`;
    console.log('🌐 Stats URL:', statsUrl);
    
    const statsResponse = await fetch(statsUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('📊 Stats Response Status:', statsResponse.status);
    const statsData = await statsResponse.json();
    console.log('✅ Stats Data:', JSON.stringify(statsData, null, 2));
    
    // Test 3: List Projects
    console.log('\n3️⃣ Testing List Projects...');
    const projectsUrl = `${API_BASE_URL}?action=crud&table=Proyectos&operation=list&token=${API_TOKEN}`;
    console.log('🌐 Projects URL:', projectsUrl);
    
    const projectsResponse = await fetch(projectsUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('📊 Projects Response Status:', projectsResponse.status);
    const projectsData = await projectsResponse.json();
    console.log('✅ Projects Data:', JSON.stringify(projectsData, null, 2));
    
    // Test 4: List Personnel
    console.log('\n4️⃣ Testing List Personnel...');
    const personnelUrl = `${API_BASE_URL}?action=crud&table=Colaboradores&operation=list&token=${API_TOKEN}`;
    console.log('🌐 Personnel URL:', personnelUrl);
    
    const personnelResponse = await fetch(personnelUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('📊 Personnel Response Status:', personnelResponse.status);
    const personnelData = await personnelResponse.json();
    console.log('✅ Personnel Data:', JSON.stringify(personnelData, null, 2));
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

// Run the test
testConnection();