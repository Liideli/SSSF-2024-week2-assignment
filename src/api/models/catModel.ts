// TODO: mongoose schema for cat

import mongoose from 'mongoose';
import {Cat} from '../../types/DBTypes';

const catSchema = new mongoose.Schema<Cat>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  cat_name: {
    type: String,
    minlength: [3, 'Cat name is required.'],
    unique: true,
  },
  weight: {
    type: Number,
    min: [0, 'Weight must be a positive number.'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Birthdate is required.'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: [true, 'Location is required.'],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.'],
  },
});

catSchema.index({location: '2dsphere'});

export default mongoose.model<Cat>('Cat', catSchema);
