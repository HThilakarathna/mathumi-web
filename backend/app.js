// Mathumi Backend — Fully Functional Express Server with JSON Persistence
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Admin credentials and secret configuration
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MOCK_TOKEN = 'mathumi-admin-secret-session-token';

// Simple Auth Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== MOCK_TOKEN) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  next();
}

// File Database Helper Functions
function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readData(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    const seed = getSeedData(collection);
    writeData(collection, seed);
    return seed;
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading database file for ${collection}:`, err);
    return [];
  }
}

function writeData(collection, data) {
  try {
    const filePath = getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing database file for ${collection}:`, err);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Initial Seed Data
function getSeedData(collection) {
  if (collection === 'salon-categories') {
    return [
      { _id: 'c1', name: 'Hair Styling', description: 'Transform your look with our professional hair styling, organic conditioning, and treatments.', image: '/imges/sa10.webp', images: ['/imges/sa10.webp', '/lookbook/sa2.webp', '/lookbook/sa16.webp'] },
      { _id: 'c2', name: 'Skin Care', description: 'Rejuvenate your skin with our customized treatments and advanced clinical facials.', image: '/salon_facial.png', images: ['/salon_facial.png', '/lookbook/sa4.webp', '/lookbook/sa11.webp'] },
      { _id: 'c3', name: 'Makeup Artistry', description: 'Professional bridal, party, and photoshoot makeup services by certified artists.', image: '/imges/s18.webp', images: ['/imges/s18.webp', '/lookbook/sa22.webp', '/lookbook/sa15.webp'] }
    ];
  }
  if (collection === 'salon-services') {
    return [
      { _id: 's1', title: 'Botanical Hair Styling', category: 'Hair Styling', description: 'Professional blow-dry styling, thermal straightening, and updos tailored for any formal occasion.', image: '/lookbook/sa2.webp', images: ['/lookbook/sa2.webp'] },
      { _id: 's2', title: 'Balayage & Coloring', category: 'Hair Styling', description: 'Custom highlights and hand-painted balayage treatments using international organic products.', image: '/lookbook/sa16.webp', images: ['/lookbook/sa16.webp'] },
      { _id: 's3', title: 'Keratin Deep Treatment', category: 'Hair Styling', description: 'Restructuring protein therapies and intense hydration hair spas for absolute shine.', image: '/lookbook/sa9.webp', images: ['/lookbook/sa9.webp'] },
      { _id: 's4', title: 'Bespoke Bridal Hair Design', category: 'Hair Styling', description: 'Traditional South Indian long braids and jasmine garland draping for your wedding.', image: '/lookbook/sa15.webp', images: ['/lookbook/sa15.webp'] },
      { _id: 's5', title: 'Luxury Herbal Facial', category: 'Skin Care', description: 'Sandalwood and turmeric deep cleansing, exfoliation, and clarifying herbal face packs.', image: '/lookbook/sa4.webp', images: ['/lookbook/sa4.webp'] },
      { _id: 's6', title: 'Advanced Skin Brightening', category: 'Skin Care', description: 'Gentle exfoliation and specialized serum infusions to restore skin clarity and natural glow.', image: '/lookbook/sa11.webp', images: ['/lookbook/sa11.webp'] }
    ];
  }
  if (collection === 'academy-courses') {
    return [
      { _id: 'ac1', title: 'Professional Bridal Makeup Course', duration: '3 Months', price: 'Rs. 45,000', image: '/hero-saree.png', syllabus: 'Day & Night Makeup\nBridal Draping\nHairstyling Basics\nProduct Knowledge' },
      { _id: 'ac2', title: 'Self Grooming Mastery', duration: '1 Month', price: 'Rs. 15,000', image: '/hero-saree.png', syllabus: 'Daily Skincare Routine\nNatural Makeup Look\nBasic Blowdry\nWardrobe Styling' }
    ];
  }
  if (collection === 'sarees') {
    return [
      { 
        _id: 'saree1', 
        name: 'Royal Madder Maroon Kanchipuram', 
        category: 'Pure Kanchipuram Silk Sarees', 
        type: 'SAREE', 
        price: 'LKR 85,000',
        description: 'Woven with authentic gold zari thread, featuring intricate heritage borders and traditional peacock motifs.', 
        image: '/lookbook/sa5.webp', 
        images: ['/lookbook/sa5.webp', '/lookbook/sa12.webp', '/lookbook/sa8.webp'],
        fabric: 'Pure Mulberry Silk', 
        zari: 'Chased Gold Zari' 
      },
      { 
        _id: 'saree2', 
        name: 'Emerald Temple Green Silk Saree', 
        category: 'Pure Kanchipuram Silk Sarees', 
        type: 'SAREE', 
        price: 'LKR 92,000',
        description: 'Draped in royal green silk featuring elegant broad temple borders and traditional floral buttis.', 
        image: '/lookbook/sa12.webp', 
        images: ['/lookbook/sa12.webp', '/lookbook/sa8.webp', '/lookbook/sa5.webp'],
        fabric: 'Pure Silk', 
        zari: 'Antique Gold Zari' 
      }
    ];
  }
  if (collection === 'rental-categories') {
    return [
      { _id: 'rc1', name: 'Necklaces', image: '/hero-saree.png', hidden: false },
      { _id: 'rc2', name: 'Earrings', image: '/hero-saree.png', hidden: false },
      { _id: 'rc3', name: 'Bangles', image: '/hero-saree.png', hidden: false },
      { _id: 'rc4', name: 'Bridal Sets', image: '/hero-saree.png', hidden: false },
      { _id: 'rc5', name: 'Hair Accessories', image: '/hero-saree.png', hidden: false },
      { _id: 'rc6', name: 'Waist Belts', image: '/hero-saree.png', hidden: false },
      { _id: 'rc7', name: 'Other Jewellery Categories', image: '/hero-saree.png', hidden: false }
    ];
  }
  return [];
}

// ======================== API ROUTES ========================

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Mathumi Backend API is running' });
});

// Admin Auth Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ token: MOCK_TOKEN });
  } else {
    res.status(400).json({ message: 'Invalid username or password' });
  }
});

// Image Upload Endpoint (Admin Only)
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Generic CRUD endpoints helper generator
function generateCRUDRoutes(collectionName) {
  // GET all (Public)
  app.get(`/api/${collectionName}`, (req, res) => {
    const list = readData(collectionName);
    res.json(list);
  });

  // POST create (Admin only)
  app.post(`/api/${collectionName}`, verifyToken, (req, res) => {
    const list = readData(collectionName);
    const newItem = { ...req.body, _id: generateId() };
    list.push(newItem);
    writeData(collectionName, list);
    res.status(201).json(newItem);
  });

  // PUT update (Admin only)
  app.put(`/api/${collectionName}/:id`, verifyToken, (req, res) => {
    const list = readData(collectionName);
    const index = list.findIndex(item => item._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: `${collectionName} item not found` });
    }
    const updatedItem = { ...list[index], ...req.body, _id: req.params.id, updatedAt: new Date().toISOString() };
    list[index] = updatedItem;
    writeData(collectionName, list);
    res.json(updatedItem);
  });

  // DELETE remove (Admin only)
  app.delete(`/api/${collectionName}/:id`, verifyToken, (req, res) => {
    const list = readData(collectionName);
    const filtered = list.filter(item => item._id !== req.params.id);
    if (list.length === filtered.length) {
      return res.status(404).json({ message: `${collectionName} item not found` });
    }
    writeData(collectionName, filtered);
    res.json({ message: `${collectionName} item deleted successfully` });
  });
}

// Register CRUD routes for static-catalog categories
generateCRUDRoutes('sarees');
generateCRUDRoutes('academy-courses');
generateCRUDRoutes('salon-services');
generateCRUDRoutes('salon-categories');
generateCRUDRoutes('gallery');
generateCRUDRoutes('staff');
generateCRUDRoutes('billing-categories');
generateCRUDRoutes('billing-services');
generateCRUDRoutes('customers');
generateCRUDRoutes('rental-jewellery');
generateCRUDRoutes('rental-categories');

// ======================== BOOKINGS & INQUIRIES ========================

// GET Bookings (Admin Only)
app.get('/api/bookings', verifyToken, (req, res) => {
  const list = readData('bookings');
  res.json(list);
});

// POST Create Booking (Public)
app.post('/api/bookings', (req, res) => {
  const list = readData('bookings');
  const newBooking = { 
    ...req.body, 
    _id: generateId(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  list.push(newBooking);
  writeData('bookings', list);
  res.status(201).json(newBooking);
});

// PUT Update Booking Status (Admin Only)
app.put('/api/bookings/:id/status', verifyToken, (req, res) => {
  const list = readData('bookings');
  const index = list.findIndex(item => item._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  list[index].status = req.body.status || list[index].status;
  list[index].updatedAt = new Date().toISOString();
  writeData('bookings', list);
  res.json(list[index]);
});

// GET Inquiries (Admin Only)
app.get('/api/inquiries', verifyToken, (req, res) => {
  const list = readData('inquiries');
  res.json(list);
});

// POST Create Inquiry (Public)
app.post('/api/inquiries', (req, res) => {
  const list = readData('inquiries');
  const newInquiry = { 
    ...req.body, 
    _id: generateId(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  list.push(newInquiry);
  writeData('inquiries', list);
  res.status(201).json(newInquiry);
});

// PUT Update Inquiry Status (Admin Only)
app.put('/api/inquiries/:id/status', verifyToken, (req, res) => {
  const list = readData('inquiries');
  const index = list.findIndex(item => item._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Inquiry not found' });
  }
  list[index].status = req.body.status || list[index].status;
  list[index].updatedAt = new Date().toISOString();
  writeData('inquiries', list);
  res.json(list[index]);
});

// ======================== RENTAL JEWELLERY BOOKINGS ========================

// GET Rental Bookings (Admin Only)
app.get('/api/rental-bookings', verifyToken, (req, res) => {
  const list = readData('rental-bookings');
  res.json(list);
});

// POST Create Rental Booking (Public)
app.post('/api/rental-bookings', (req, res) => {
  const list = readData('rental-bookings');
  const newBooking = { 
    ...req.body, 
    _id: generateId(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  list.push(newBooking);
  writeData('rental-bookings', list);
  res.status(201).json(newBooking);
});

// PUT Update Rental Booking Status (Admin Only)
app.put('/api/rental-bookings/:id/status', verifyToken, (req, res) => {
  const list = readData('rental-bookings');
  const index = list.findIndex(item => item._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Rental booking not found' });
  }
  list[index].status = req.body.status || list[index].status;
  list[index].updatedAt = new Date().toISOString();
  writeData('rental-bookings', list);
  res.json(list[index]);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
