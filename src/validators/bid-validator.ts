import { checkSchema } from 'express-validator';

const placeBidRequestValidator = checkSchema({
  amount: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Amount must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Amount is required',
    },
    custom: {
      options: (value) => {
        if (value <= 0) {
          throw new Error('Amount must be greater than zero');
        }
        return true;
      },
    },
  },
  problemId: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Problem ID must be a valid MongoDB ObjectId',
    },
    notEmpty: {
      errorMessage: 'Problem ID is required',
    },
  },
});

export const updateBidRequestValidator = checkSchema({
  amount: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Amount must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Amount is required',
    },
    custom: {
      options: (value) => {
        if (value <= 0) {
          throw new Error('Amount must be greater than zero');
        }
        return true;
      },
    },
  },
  problemId: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Problem ID must be a valid MongoDB ObjectId',
    },
    notEmpty: {
      errorMessage: 'Problem ID is required',
    },
  },

  bidId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'bid ID must be a valid MongoDB ObjectId',
    },

    notEmpty: {
      errorMessage: 'bid ID is required',
    },
  },
});

export const deleteBidRequestValidator = checkSchema({
  bidId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'bid ID must be a valid MongoDB ObjectId',
    },

    notEmpty: {
      errorMessage: 'bid ID is required',
    },
  },
});

export const fetchBidsValidator = checkSchema({
  bidId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'bid ID must be a valid MongoDB ObjectId',
    },
    notEmpty: {
      errorMessage: 'bid ID is required',
    },
  },
  page: {
    in: ['query'],
    optional: true,
    isInt: {
      errorMessage: 'Page must be an integer',
    },
    toInt: true, // Convert string to integer
  },
  limit: {
    in: ['query'],
    optional: true,
    isInt: {
      errorMessage: 'Limit must be an integer',
    },
    toInt: true, // Convert string to integer
  },
  sort: {
    in: ['query'],
    optional: true,
    isIn: {
      options: [['asc', 'desc']],
      errorMessage: 'Sort must be either "asc" or "desc"',
    },
  },
  sortBy: {
    in: ['query'],
    optional: true,
    isIn: {
      options: [['problemid']],
      errorMessage: 'Sort by must be "problemid"',
    },
  },
  problemId: {
    in: ['query'],
    optional: {
      options: { nullable: true }, // Make it optional but allow null
    },
    isMongoId: {
      errorMessage: 'Problem ID must be a valid MongoDB ObjectId if provided',
    },
  },
});

export const fetchManyProblemValidator = checkSchema({
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

export const acceptBidValidator = checkSchema({
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'bid ID must be a valid MongoDB ObjectId',
    },
    notEmpty: {
      errorMessage: 'bid ID is required',
    },
  },
  // problemId: {
  //   in: ['body'],
  //   isMongoId: {
  //     errorMessage: 'problemId must be a valid MongoDB ObjectId',
  //   },
  //   notEmpty: {
  //     errorMessage: 'problemId is required',
  //   },
  // },
});
export default placeBidRequestValidator;
