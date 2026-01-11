import { Request, Response } from 'express';
import SpoonacularService from '../services/spoonacularService';
import { ErrorResponse } from '../types/recipes';
import dotenv from 'dotenv';

dotenv.config();

const service = new SpoonacularService(process.env.SPOONACULAR_API_KEY || '');

/**
 * Search for recipes by keyword
 * GET /recipes/search?query=chicken&number=10
 */
export const searchRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, number } = req.query;

    // Validate required parameters
    if (!query || typeof query !== 'string') {
      const error: ErrorResponse = {
        error: 'Bad Request',
        message: 'Query parameter is required and must be a string',
        statusCode: 400,
      };
      res.status(400).json(error);
      return;
    }

    // Parse number parameter
    const resultLimit = number ? Math.min(Math.max(parseInt(number as string, 10), 1), 100) : 10;

    const results = await service.searchRecipes(query, resultLimit);
    res.json(results);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get detailed information about a specific recipe
 * GET /recipes/:id
 */
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate recipe ID
    const recipeId = parseInt(id, 10);
    if (isNaN(recipeId)) {
      const error: ErrorResponse = {
        error: 'Bad Request',
        message: 'Recipe ID must be a valid number',
        statusCode: 400,
      };
      res.status(400).json(error);
      return;
    }

    const recipe = await service.getRecipeById(recipeId);
    res.json(recipe);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get a random recipe with optional tag filtering
 * GET /recipes/random?tags=vegetarian&number=1
 */
export const getRandomRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tags, number } = req.query;

    // Parse number parameter
    const resultLimit = number ? Math.min(Math.max(parseInt(number as string, 10), 1), 10) : 1;

    const tags_str = tags ? (tags as string) : undefined;
    const result = await service.getRandomRecipe(tags_str, resultLimit);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Search for ingredients by keyword
 * GET /recipes/ingredients?query=apple&number=10
 */
export const searchIngredients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, number } = req.query;

    // Validate required parameters
    if (!query || typeof query !== 'string') {
      const error: ErrorResponse = {
        error: 'Bad Request',
        message: 'Query parameter is required and must be a string',
        statusCode: 400,
      };
      res.status(400).json(error);
      return;
    }

    // Parse number parameter
    const resultLimit = number ? Math.min(Math.max(parseInt(number as string, 10), 1), 100) : 10;

    const results = await service.searchIngredients(query, resultLimit);
    res.json(results);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Helper function to handle errors consistently
 */
const handleError = (res: Response, error: any): void => {
  console.error('Error:', error);

  if (error instanceof Error) {
    const statusCode = error.message.includes('Unauthorized') ? 401 : 500;
    const response: ErrorResponse = {
      error: 'Internal Server Error',
      message: error.message,
      statusCode,
    };
    res.status(statusCode).json(response);
  } else {
    const response: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      statusCode: 500,
    };
    res.status(500).json(response);
  }
};
