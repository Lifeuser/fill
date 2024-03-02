import { createServer } from './app.js';

const app = createServer();

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});
