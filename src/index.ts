// THIS IS THE MAIN EXPRESS APP ENTRY

// imports TypeScript types for express (web framework)
import express, { Request, Response, NextFunction } from 'express'; 

// loads the environment variables from .env
import dotenv from 'dotenv'; 

// loads the recipeRoutes router that handles all /recipes endpoints
import recipeRoutes from './routes/recipes';

// loads environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

// Core Middleware
// parses incoming JSON request bodies
app.use(express.json());
//parses form data
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
// logs timestamp, HTTP method (GET/POST,etc.), and request path on every request
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
// next() is important to let Express know to go to the next middleware/route

// Health check endpoint: this checks if the server is running
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Recipe Finder API is running',
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
  });
});

// API routes
// puts recipeRoutes router under /recipes
app.use('/recipes', recipeRoutes);

// Root endpoint 
// helps show what the API is, available endpoints, and how to use them
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Recipe Finder API',
    version: '1.0.0',
    description: 'A RESTful API for searching recipes using Spoonacular',
    endpoints: {
      health: 'GET /health',
      searchRecipes: 'GET /recipes/search?query=chicken&number=10',
      getRecipeDetails: 'GET /recipes/:id',
      getRandomRecipe: 'GET /recipes/random?tags=vegetarian',
      searchIngredients: 'GET /recipes/ingredients?query=apple&number=10',
    },
    documentation: 'See README.md for detailed documentation',
  });
});

// 404 Not Found handler
// runs only if there is a request that does not match a route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.path} does not exist`,
    statusCode: 404,
  });
});

// Error handling middleware
// catches errors thrown anywhere in app and prevents server from crashing
// hides error details in production, shows details in development
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: nodeEnv === 'development' ? err.message : 'An unexpected error occurred',
    statusCode: 500,
  });
});

// Starts server and listens for HTTP requests on specified port
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Recipe Finder API is running!                    ║
║   Environment: ${nodeEnv.padEnd(27)}               ║
║   Port: ${String(port).padEnd(31)}                 ║
║   URL: http://localhost:${String(port).padEnd(20)} ║
╚════════════════════════════════════════════════════╝
  `);
  console.log('Endpoints available:');
  console.log(`  - GET http://localhost:${port}/`);
  console.log(`  - GET http://localhost:${port}/health`);
  console.log(`  - GET http://localhost:${port}/recipes/search?query=chicken`);
  console.log(`  - GET http://localhost:${port}/recipes/random`);
  console.log(`  - GET http://localhost:${port}/recipes/715538`);
  console.log(`  - GET http://localhost:${port}/recipes/ingredients?query=apple`);
});

export default app;
