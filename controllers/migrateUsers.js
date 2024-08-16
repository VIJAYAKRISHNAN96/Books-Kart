// const mongoose = require('mongoose');
// const User = require('./models/userModel'); // Adjust this path to where your User model is located



// const MONGODB_URI = 'mongodb://127.0.0.1:27017/Bookskart';
// // const MONGODB_URI = 'mongodb://localhost:27017/your_database_name';

// async function migrateUsers() {
//   try {
//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB');

//     const result = await User.updateMany(
//       { wallet: { $exists: false } },
//       { $set: { wallet: { balance: 0, transactions: [] } } }
//     );

//     console.log(`Migration completed. ${result.modifiedCount} users updated.`);
//   } catch (error) {
//     console.error('Error migrating users:', error);
//   } finally {
//     await mongoose.connection.close();
//     console.log('MongoDB connection closed');
//   }
// }

// migrateUsers();