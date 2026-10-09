import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 4000);
createApp().listen(port, () => {
  console.log(`agent-test listening on http://localhost:${port}`);
});
