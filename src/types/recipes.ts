// TypeScript interfaces for recipe data structures
// These interfaces match the Spoonacular API response format

export interface RecipeSearchResult {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export interface RecipeSearchResponse {
  results: RecipeSearchResult[];
  number: number;
  offset: number;
  totalResults: number;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
  originalName: string;
}

export interface RecipeStep {
  number: number;
  step: string;
}

export interface RecipeInstructions {
  name: string;
  steps: RecipeStep[];
}

export interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl: string;
  summary: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: RecipeInstructions[];
  cuisines?: string[];
  diets?: string[];
}

export interface RandomRecipeResponse {
  recipes: RecipeDetails[];
}

export interface IngredientSearchResult {
  id: number;
  name: string;
  image: string;
}

export interface IngredientSearchResponse {
  results: IngredientSearchResult[];
  number: number;
  offset: number;
}

// Error response interface
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
