const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/Person');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
    seedDatabase();
  })
  .catch(err => console.log('Database connection error:', err));

// --- API Routes ---

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// People routes
app.use('/api/people', require('./routes/people'));

// This function will add initial data if the database is empty.
async function seedDatabase() {
  try {
    // Seed admin user
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found, seeding admin user...');
      const adminUser = new User({
        username: 'admin',
        password: 'password123' 
      });
      await adminUser.save();
      console.log('Admin user created with username "admin" and password "password123"');
    } else {
      console.log('Admin user already exists, skipping seeding.');
    }

    // Seed people data
    const personCount = await Person.countDocuments();
    if (personCount > 0) {
      console.log('Database already contains people data. Seeding not required.');
      return;
    }

    console.log('Database is empty. Seeding with initial 10 pages...');
    const placeholderPeople = Array.from({ length: 10 }, (_, i) => ({
      name: `Notable Person ${i + 1}`,
      biography: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Sorbi et manus.\n\nNam sed tellus id magna elementum tincidunt. Morbi a metus. Pede nisl, aenean sit amet, justo. In hac habitasse platea dictumst. Nulla facilisi. Vivamus et ante. Mauris eget quam. Sed magna. Aliquam erat volutpat. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc semper, magna a pulvinar maximus, eros urna congue quam, vitae vultrices quam.',
    }));

    await Person.insertMany(placeholderPeople);
    console.log('Database seeded with people successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Please close the other application or choose a different port.`);
  } else {
    console.error('An error occurred while starting the server:', err);
  }
});
