const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  description:  { type: String },
  price:        { type: Number, required: true },
  available:    { type: Boolean, default: true },
  capacity:     { type: Number, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
