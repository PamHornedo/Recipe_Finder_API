// imports Express's Router class
// Routers: define URLs and HTTP methods
import { Router } from 'express';
// imports controller functions
// Controllers: handles logic and responses
import {
  searchRecipes,
  getRecipeById,
  getRandomRecipe,
  searchIngredients,
} from '../controllers/recipeController';

// creates new router instance
// attach routes to this router instead of the app
const router = Router();

/**
 * Recipe routes
 * All routes are under /recipes prefix in main app
 */

// GET /recipes/search?query=chicken&number=10
// handles GET requests to /recipes/search
// calls searchRecipes controller
router.get('/search', searchRecipes);

// GET /recipes/random?tags=vegetarian
router.get('/random', getRandomRecipe);

// GET /recipes/ingredients?query=apple
router.get('/ingredients', searchIngredients);

// GET /recipes/:id
// This route must be last to avoid conflicts with /search and /random
router.get('/:id', getRecipeById);

export default router;
