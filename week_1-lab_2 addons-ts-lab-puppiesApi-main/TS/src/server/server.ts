import app from './app';
const port = process.argv[2] || 3000;

app.listen(port, (): void => {
  console.log(`Server listening on http://localhost:${port}`);
});
