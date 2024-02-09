require('dotenv').config();
import http from 'http';
import { router } from './router';

const server = http.createServer(router);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
