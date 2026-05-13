import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/service-connect', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('SUCCESS: Connected to MongoDB successfully!');
    process.exit(0);
  } catch (error) {
    console.error('ERROR: Failed to connect to MongoDB.');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
