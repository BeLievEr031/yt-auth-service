import { model, Schema } from 'mongoose';
import { User } from '../types';

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },

    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    expertiseIN: {
      type: [String],
    },

    initialPrice: {
      type: Number,
      default: 0,
    },

    phone: {
      type: String,
      required: true,
      match: [/\d{10}/, 'Please enter a valid 10 digit phone number'],
    },

    pincode: {
      type: String,
      required: true,
      match: [/\d{6}/, 'Please enter a valid 6 digit pincode'],
    },

    role: {
      type: String,
      enum: ['admin', 'worker', 'user'],
      default: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<User>('Users', userSchema);

export default User;
