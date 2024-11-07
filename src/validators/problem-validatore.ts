import { checkSchema } from 'express-validator';
export const problemRequestValidator = checkSchema({
  // Validate and sanitize email
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'title must be a string',
    },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'title must be between 3 and 50 characters long',
    },
    trim: true,
  },

  // Validate and sanitize name
  description: {
    in: ['body'],
    isString: {
      errorMessage: 'description must be a string',
    },
    isLength: {
      options: { min: 10, max: 255 },
      errorMessage: 'description must be between 3 and 50 characters long',
    },
    trim: true,
  },

  tag: {
    in: ['body'],
    isString: {
      errorMessage: 'tag must be a string',
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'tag must be between 3 and 20 characters long',
    },
    trim: true,
  },
});

export const getProblemRequestValidator = checkSchema({
  // Validate and sanitize id
  id: {
    in: ['params'],
    isString: {
      errorMessage: 'id must be a string',
    },
    isLength: {
      options: { min: 1, max: 50 }, // Adjust max length as needed
      errorMessage: 'id must be between 1 and 50 characters long',
    },
    trim: true,
  },
});

export const updateProblemRequestValidator = checkSchema({
  // Validate and sanitize email
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'title must be a string',
    },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'title must be between 3 and 50 characters long',
    },
    trim: true,
  },

  // Validate and sanitize name
  description: {
    in: ['body'],
    isString: {
      errorMessage: 'description must be a string',
    },
    isLength: {
      options: { min: 10, max: 255 },
      errorMessage: 'description must be between 3 and 50 characters long',
    },
    trim: true,
  },

  tag: {
    in: ['body'],
    isString: {
      errorMessage: 'tag must be a string',
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'tag must be between 3 and 20 characters long',
    },
    trim: true,
  },

  id: {
    in: ['params'],
    isString: {
      errorMessage: 'id must be a string',
    },
    isLength: {
      options: { min: 1, max: 50 }, // Adjust max length as needed
      errorMessage: 'id must be between 1 and 50 characters long',
    },
    trim: true,
  },
});

export const updateStatusWorkerRequestVaidator = checkSchema({
  // Validate and sanitize email
  status: {
    in: ['query'],
    isString: {
      errorMessage: 'status must be a string',
    },
    isIn: {
      options: [['unassigned', 'pending', 'completed', 'closed']],
      errorMessage:
        'status must be one of the following: unassigned, pending, completed, closed',
    },
    trim: true,
  },

  // Validate and sanitize name
  workerId: {
    in: ['query'],
    isString: {
      errorMessage: 'workerId must be a string',
    },
    trim: true,
  },
});

export const deleteProblemRequestValidator = checkSchema({
  id: {
    in: ['params'],
    isString: {
      errorMessage: 'id must be a string',
    },
    isLength: {
      options: { min: 1, max: 50 }, // Adjust max length as needed
      errorMessage: 'id must be between 1 and 50 characters long',
    },
    trim: true,
  },
});

export const becomeWorkerValidator = checkSchema({
  initialPrice: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'initialPrice must be a number',
    },
    trim: true,
  },
});
