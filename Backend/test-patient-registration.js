// Test script for patient registration and login API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testPatientRegistration() {
  try {
    console.log('🧪 Testing Patient Registration API...\n');

    // Test data (matching frontend format)
    const testPatient = {
      name: 'John Doe',
      age: '30', // String as sent from frontend form
      gender: 'Male',
      email: 'john.doe@example.com',
      phone: '+1234567890'
    };

    console.log('📝 Test Data:', testPatient);
    console.log('\n🚀 Sending registration request...');

    // Make the API call
    const response = await axios.post(`${API_BASE_URL}/patients/public/register`, testPatient, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    console.log('🔑 JWT Token received:', response.data.token ? 'Yes' : 'No');
    console.log('👤 Patient data:', response.data.patient);

  } catch (error) {
    console.error('❌ Registration failed!');
    
    if (error.response) {
      console.error('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
      console.error('🔢 Status Code:', error.response.status);
    } else if (error.request) {
      console.error('🌐 Network Error:', error.message);
      console.error('💡 Make sure the backend server is running on http://localhost:8000');
    } else {
      console.error('⚠️ Error:', error.message);
    }
  }
}

// Test duplicate email
async function testDuplicateEmail() {
  try {
    console.log('\n🧪 Testing Duplicate Email Validation...\n');

    const testPatient = {
      name: 'Jane Doe',
      age: '25', // String as sent from frontend form
      gender: 'Female',
      email: 'john.doe@example.com', // Same email as previous test
      phone: '+1234567891'
    };

    console.log('📝 Test Data:', testPatient);
    console.log('\n🚀 Sending registration request with duplicate email...');

    const response = await axios.post(`${API_BASE_URL}/patients/public/register`, testPatient, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ This should have failed!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Duplicate email validation working correctly!');
      console.log('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
  }
}

// Test validation errors
async function testValidationErrors() {
  try {
    console.log('\n🧪 Testing Validation Errors...\n');

    const invalidPatient = {
      name: '', // Empty name
      age: 'invalid', // Invalid age
      gender: 'Invalid', // Invalid gender
      email: 'invalid-email', // Invalid email
      phone: '123' // Invalid phone
    };

    console.log('📝 Invalid Test Data:', invalidPatient);
    console.log('\n🚀 Sending registration request with invalid data...');

    const response = await axios.post(`${API_BASE_URL}/patients/public/register`, invalidPatient, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ This should have failed!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Validation working correctly!');
      console.log('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
  }
}

// Test patient login
async function testPatientLogin() {
  try {
    console.log('\n🧪 Testing Patient Login API...\n');

    const loginData = {
      email: 'john.doe@example.com', // Use the email from registration test
      password: 'password123',
      role: 'Patient'
    };

    console.log('📝 Login Data:', loginData);
    console.log('\n🚀 Sending login request...');

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    console.log('🔑 JWT Token received:', response.data.data.token ? 'Yes' : 'No');
    console.log('👤 Patient data:', response.data.data.patient);

  } catch (error) {
    console.error('❌ Login failed!');
    
    if (error.response) {
      console.error('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
      console.error('🔢 Status Code:', error.response.status);
    } else if (error.request) {
      console.error('🌐 Network Error:', error.message);
      console.error('💡 Make sure the backend server is running on http://localhost:8000');
    } else {
      console.error('⚠️ Error:', error.message);
    }
  }
}

// Test doctor login
async function testDoctorLogin() {
  try {
    console.log('\n🧪 Testing Doctor Login API...\n');

    const loginData = {
      email: 'doctor@example.com',
      password: 'password123',
      role: 'Doctor'
    };

    console.log('📝 Login Data:', loginData);
    console.log('\n🚀 Sending login request...');

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    console.log('🔑 JWT Token received:', response.data.data.token ? 'Yes' : 'No');
    console.log('👨‍⚕️ Doctor data:', response.data.data.user);

  } catch (error) {
    console.error('❌ Login failed!');
    
    if (error.response) {
      console.error('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
      console.error('🔢 Status Code:', error.response.status);
    } else if (error.request) {
      console.error('🌐 Network Error:', error.message);
      console.error('💡 Make sure the backend server is running on http://localhost:8000');
    } else {
      console.error('⚠️ Error:', error.message);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('🏥 HPMS Authentication API Tests\n');
  console.log('=' .repeat(50));
  
  await testPatientRegistration();
  await testPatientLogin();
  await testDoctorLogin();
  await testDuplicateEmail();
  await testValidationErrors();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 All tests completed!');
}

// Check if axios is available
try {
  require.resolve('axios');
  runAllTests();
} catch (error) {
  console.log('📦 Installing axios for testing...');
  console.log('Run: npm install axios');
  console.log('Then run: node test-patient-registration.js');
}
