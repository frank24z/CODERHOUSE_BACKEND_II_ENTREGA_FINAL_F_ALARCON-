import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin1', 'admin2'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
