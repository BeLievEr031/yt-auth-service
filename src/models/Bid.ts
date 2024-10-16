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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  { timestamps: true },
);

const Bid = model('Bids', bidSchema);
