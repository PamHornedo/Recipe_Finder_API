// imports the query function from express-validator
import { query } from 'express-validator';

// creates and exports an array of middleware
// validators will be run in order
export const searchRecipesValidator = [
  query('query') // targets query parameter named query
    .exists() // checks if query exists
    .withMessage('query parameter is required') 
    .isString() // makes sure value is a string
    .withMessage('query must be a string')
    .notEmpty() // prevents empty strings
    .withMessage('query cannot be empty'),

  query('number')
    .optional() // number is optional
    .isInt({ min: 1, max: 50 }) // requires number input to be an integer between 1 and 50
    .withMessage('number must be an integer between 1 and 50'),
];