import { model, Schema } from 'mongoose';
import { Problem } from '../types';

const problemShema = new Schema<Problem>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bidId: {
      type: Schema.Types.ObjectId,
      ref: 'Bid',
    },
    status: {
      type: String,
      enum: ['unassigned', 'pending', 'completed'],
      default: 'unassigned',
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    tag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Problem = model('Problems', problemShema);
export default Problem;
