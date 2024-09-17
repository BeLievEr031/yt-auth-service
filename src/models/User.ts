import { model, Schema } from 'mongoose';
import { User } from '../types';

const userSchema = new Schema<User>(
  {
    // User's login email
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    // Full name of the user
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    // Hashed password for security
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // The number of devices the user is logged into
    devices: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<User>('User', userSchema);

export default User;
