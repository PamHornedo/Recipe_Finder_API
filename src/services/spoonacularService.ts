// axios: HTTP client used to make requests to external APIs
import axios from 'axios';

// imports TypeScript interfaces/types
import {
  RecipeSearchResponse,
  RecipeDetails,
  RandomRecipeResponse,
  IngredientSearchResponse,
} from '../types/recipes';

// grouping related API logic together
class SpoonacularService {
  private apiKey: string;
  private baseUrl: string = 'https://api.spoonacular.com';

  // requires an API key when creating service
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Spoonacular API key is required. Set SPOONACULAR_API_KEY in .env file');
    }
    this.apiKey = apiKey;
  }

  /**
   * Search for recipes by keyword
   * @param query - Search term (e.g., "chicken", "pasta")
   * @param number - Number of results to return (default: 10)
   * @returns Promise with recipe search results
   */
  async searchRecipes(query: string, number: number = 10): Promise<RecipeSearchResponse> {
    try {
      const response = await axios.get<RecipeSearchResponse>(`${this.baseUrl}/recipes/complexSearch`, {
        params: {
          query,
          number,
          apiKey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to search recipes');
    }
  }

  /**
   * Get detailed information about a specific recipe
   * @param id - Recipe ID
   * @returns Promise with recipe details
   */
  async getRecipeById(id: number): Promise<RecipeDetails> {
    try {
      const response = await axios.get<RecipeDetails>(
        `${this.baseUrl}/recipes/${id}/information`,
        {
          params: {
            apiKey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch recipe with ID ${id}`);
    }
  }

  /**
   * Get a random recipe with optional tags filter
   * @param tags - Comma-separated tags to filter by (e.g., "vegetarian,dessert")
   * @param number - Number of random recipes to return (default: 1)
   * @returns Promise with random recipe(s)
   */
  async getRandomRecipe(tags?: string, number: number = 1): Promise<RandomRecipeResponse> {
    try {
      const params: Record<string, any> = {
        number,
        apiKey: this.apiKey,
      };

      if (tags) {
        params.tags = tags;
      }

      const response = await axios.get<RandomRecipeResponse>(
        `${this.baseUrl}/recipes/random`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch random recipe');
    }
  }

  /**
   * Search for ingredients by keyword
   * @param query - Ingredient search term (e.g., "apple", "tomato")
   * @param number - Number of results to return (default: 10)
   * @returns Promise with ingredient search results
   */
  async searchIngredients(query: string, number: number = 10): Promise<IngredientSearchResponse> {
    try {
      const response = await axios.get<IngredientSearchResponse>(
        `${this.baseUrl}/food/ingredients/search`,
        {
          params: {
            query,
            number,
            apiKey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to search ingredients');
    }
  }

  /**
   * Handle errors from API calls
   * @param error - The error object
   * @param message - Custom error message
   * @throws Error with formatted message
   */
  private handleError(error: any, message: string): void {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Invalid Spoonacular API key');
      }
      if (error.response?.status === 402) {
        throw new Error('Payment Required: Spoonacular API quota exceeded');
      }
      if (error.response?.status === 404) {
        throw new Error('Not Found: Recipe or ingredient not found');
      }
      throw new Error(`${message}: ${error.message}`);
    }
    throw error;
  }
}

export default SpoonacularService;
