import cluster, { Worker } from 'cluster';
import http from 'http';
import os from 'os';
import { router } from './router';

const PORT = parseInt(process.env.PORT || '4000', 10) + (cluster.worker?.id || 0);

if (shouldUseCluster() && cluster !== undefined) {
  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;

    console.log(`Primary process ${process.pid} is running, creating ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      console.log(`Forking new worker...`);
      cluster.fork();
    });

    const server = http.createServer(router);
    server.listen(PORT, () => {
      console.log(`Load balancer running at http://localhost:${PORT}/`);
    });
  } else {
    const server = http.createServer(router);
    server.listen(PORT, () => {
      console.log(`Worker ${process.pid} server running at http://localhost:${PORT}/`);
    });
  }
} else {
  const server = http.createServer(router);
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
  });
}

function shouldUseCluster() {
  const clusterEnabled = process.env.npm_lifecycle_script?.includes('cluster=enable');
  return clusterEnabled;
}
