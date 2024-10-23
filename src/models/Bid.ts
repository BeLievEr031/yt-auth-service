import { Schema, model } from 'mongoose';
import { Bid } from '../types';

const bidSchema = new Schema<Bid>(
  {
    amount: {
      type: Number,
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problems',
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Bid = model('Bids', bidSchema);
export default Bid;
