import app from './src/app';

const PORT = process.env.PORT || 3000;
process.env.NODE_ENV === 'development' &&
  app.listen(PORT, () => {
    console.log(`⚡ Local server running at http://localhost:${PORT}`);
  });
