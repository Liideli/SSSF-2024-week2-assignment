// TODO: mongoose schema for user

import mongoose from 'mongoose';
import {User} from '../../types/DBTypes';

const userSchema = new mongoose.Schema<User>({
  user_name: {
    type: String,
    minlength: [3, 'Username is required.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
  },
  password: {
    type: String,
    minlength: [4, 'Password is required.'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
  },
});

export default mongoose.model<User>('User', userSchema);
