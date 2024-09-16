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
    // User's unique YouTube-like channel name
    channelName: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    // The date and time of the user's last login
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // URL of the cover image (e.g., channel banner)
    coverImgUrl: {
      type: String,
      default: 'default_cover_img_url',
    },
    // List of social media URLs connected to the user's profile
    socialProfileUrl: [
      {
        type: String,
      },
    ],
    // Role of the user (e.g., 'user', 'admin', etc.)
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'MANAGER'],
      default: 'USER',
    },
    // Status of the user's account (e.g., 'active', 'inactive', 'banned')
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'BANNED'],
      default: 'ACTIVE',
    },
    // User's profile picture URL
    profilePicture: {
      type: String,
      default: 'default_profile_pic_url',
    },
    // Subscribers count
    subscribers: {
      type: Number,
      default: 0,
    },
    // Channels this user is subscribed to
    subscribedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Liked videos
    likedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    // Disliked videos
    dislikedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    // Watch history
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    // Playlists created by the user
    playlists: [
      {
        name: { type: String, required: true },
        videos: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Video',
          },
        ],
      },
    ],
    // Notifications
    notifications: [
      {
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: true,
  },
);

const User = model<User>('User', userSchema);

export default userSchema;
