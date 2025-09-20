const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = "mongodb+srv://sunandvemavarapu_db_user:wG2gnW5sjhD4OsNm@6hrs.lfpjg7a.mongodb.net/";
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
