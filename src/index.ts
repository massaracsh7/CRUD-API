import cluster from 'cluster';
import http from 'http';
import os from 'os';
import { router } from './router';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  const PORT = process.env.PORT || '4000';

  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker?.process.pid} died`);
    cluster.fork();
  });

  const loadBalancer = http.createServer((req, res) => {
    if (req.url && req.url.startsWith('/api/')) {
      const workers = cluster.workers;
      if (workers) {
        const worker = Object.values(workers)[0]; // Round-robin routing
        if (worker) {
          worker.send({ type: 'request', req, res });
          return;
        }
      }
    }
    res.writeHead(404);
    res.end('Not found');
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer is running on http://localhost:${PORT}`);
  });
} else {
  const PORT = process.env.PORT || '4000';
  http.createServer(router).listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on http://localhost:${PORT}`);
  });
}
