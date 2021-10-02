import { Schema as _Schema, models, model } from 'mongoose';

// create mongoose schema object
const Schema = new _Schema({
  image: {
    type: String,
    required: [true, 'Please add a base64 String'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// The collection name for this DB is defined in the export
export default models.Image || model('Image', Schema);