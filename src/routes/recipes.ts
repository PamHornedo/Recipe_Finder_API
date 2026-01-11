import { Router } from 'express';
import {
  searchRecipes,
  getRecipeById,
  getRandomRecipe,
  searchIngredients,
} from '../controllers/recipeController';

const router = Router();

/**
 * Recipe routes
 * All routes are under /recipes prefix in main app
 */

// GET /recipes/search?query=chicken&number=10
router.get('/search', searchRecipes);

// GET /recipes/random?tags=vegetarian
router.get('/random', getRandomRecipe);

// GET /recipes/ingredients?query=apple
router.get('/ingredients', searchIngredients);

// GET /recipes/:id
// This route must be last to avoid conflicts with /search and /random
router.get('/:id', getRecipeById);

export default router;
