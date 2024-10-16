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
