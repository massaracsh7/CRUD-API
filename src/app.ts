import cluster, { Worker } from 'cluster';
import http from 'http';
import os from 'os';
import { router } from './router';
import { shouldUseCluster } from './utils/isCluster';

export const app = () => {
  const PORT = parseInt(process.env.PORT || '4000', 10) + (cluster.worker?.id || 0);
  let server: http.Server;

  if (shouldUseCluster() && cluster !== undefined) {
    if (cluster.isPrimary) {
      const numWork = os.availableParallelism() - 1;

      console.log(`Primary process ${process.pid} is running, creating workers...`);

      for (let i = 0; i < numWork; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });

      server = http.createServer(router);
      server.listen(PORT, () => {
        console.log(`Load balancer running at http://localhost:${PORT}/`);
      });
    } else {
      server = http.createServer(router);
      server.listen(PORT, () => {
        console.log(`Worker ${process.pid} server running at http://localhost:${PORT}/`);
      });
    }
  } else {
    server = http.createServer(router);
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
    });
  }

  return server;
}
