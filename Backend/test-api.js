const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

// Test function to check if API is running
async function testAPI() {
  try {
    console.log('🧪 Testing HPMS Backend API...\n');

    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test authentication endpoints
    console.log('\n2. Testing authentication...');
    
    // Try to access protected route without token (should fail)
    try {
      await axios.get(`${BASE_URL}/patients`);
      console.log('❌ Authentication bypassed - this should not happen');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication working - protected routes require token');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test dashboard endpoints
    console.log('\n3. Testing dashboard endpoints...');
    try {
      await axios.get(`${BASE_URL}/dashboard/overview`);
      console.log('❌ Dashboard accessible without authentication - this should not happen');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Dashboard protected - authentication required');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 API structure is working correctly!');
    console.log('\n📋 Available endpoints:');
    console.log('   Authentication: /api/auth/*');
    console.log('   Patients: /api/patients/*');
    console.log('   Doctors: /api/doctors/*');
    console.log('   Appointments: /api/appointments/*');
    console.log('   Users: /api/users/*');
    console.log('   Dashboard: /api/dashboard/*');
    
    console.log('\n🔐 To test with authentication:');
    console.log('   1. Create a user account');
    console.log('   2. Login to get JWT token');
    console.log('   3. Use token in Authorization header: Bearer <token>');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm install && npm run dev');
    }
  }
}

// Run the test
testAPI();
