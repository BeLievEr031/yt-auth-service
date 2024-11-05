import { checkSchema } from 'express-validator';

export const fetchWorkerValidator = checkSchema({
  page: {
    in: ['query'],
    isInt: {
      errorMessage: 'Page must be an integer',
    },
    toInt: true, // Convert string to integer
  },
  limit: {
    in: ['query'],
    isInt: {
      errorMessage: 'Limit must be an integer',
    },
    toInt: true, // Convert string to integer
  },
  sort: {
    in: ['query'],
    isIn: {
      options: [['asc', 'desc']],
      errorMessage: 'Sort must be either "asc" or "desc"',
    },
  },
});

export const CheckForBidPlacedOrNotValidator = checkSchema({
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Problem ID must be a valid MongoDB ObjectId',
    },
  },
});
