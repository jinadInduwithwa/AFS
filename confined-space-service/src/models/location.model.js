// confined-space-service/src/models/location.model.js
import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  buildingId: { type: String, required: true },
  pin: { type: String, required: true },
  name: { type: String, trim: true },
  streetAddress: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

LocationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Location = mongoose.model('Location', LocationSchema);