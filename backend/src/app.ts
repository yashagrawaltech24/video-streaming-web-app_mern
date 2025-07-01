import express from 'express';
import routes from './routes';
import { errorHandler, notFoundHandler, registerGlobalMiddleware } from './middlewares';

const app = express();

// Global middleware
registerGlobalMiddleware(app);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Health OK' });
});

// Routes
app.use('/api', routes);

// Not-Found middleware
app.use(notFoundHandler);

// Error middleware
app.use(errorHandler);

export default app;
