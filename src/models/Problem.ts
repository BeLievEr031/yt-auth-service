import { model, Schema } from 'mongoose';
import { Problem } from '../types';

const problemShema = new Schema<Problem>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    bidId: {
      type: Schema.Types.ObjectId,
      ref: 'Bids',
    },
    status: {
      type: String,
      enum: ['unassigned', 'pending', 'completed', 'closed'],
      default: 'unassigned',
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    imageSrc: {
      type: String,
      required: true,
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
