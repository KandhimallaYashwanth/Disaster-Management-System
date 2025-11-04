const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Check required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is not set in .env file');
  console.error('Please create a .env file with: MONGO_URI=your_connection_string');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set in .env file');
  console.error('Please add JWT_SECRET=your_secret_key to your .env file');
  process.exit(1);
}

const app = express();

// Middleware - Enhanced CORS configuration (allows all origins for development)
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB Atlas
console.log('🔌 Attempting to connect to MongoDB Atlas...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully');
  console.log('📊 Database ready for user authentication');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('⚠️  Make sure MONGO_URI is set correctly in your .env file');
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
