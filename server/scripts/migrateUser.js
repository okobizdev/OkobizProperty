// migrate-add-isStaff.js

const mongoose = require('mongoose');
const {User}=require('../src/modules/user/user.model.js')

// Connect to MongoDB
mongoose.connect('mongodb+srv://abdullahokobiz:FIgRzKu10VdSn0rm@stayverz-clone.ji2q7ul.mongodb.net/stayverzclone?retryWrites=true&w=majority&appName=stayverz-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Migration function
async function addIsStaffToUsers() {
  try {
    const result = await User.updateMany(
      { isStaff: { $exists: false } }, // Only update documents missing this field
      { $set: { isStaff: false } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with isStaff: false`);
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

addIsStaffToUsers();
