import 'dotenv/config';
import cluster from 'cluster';
import http from 'http';
import os from 'os';
import { router } from './router';

// Parse command-line arguments
const args = parseArgs(process.argv.slice(2));
const PORT = process.env.PORT; // Set default port if PORT environment variable is not provided
const server = http.createServer(router);

if (args['cluster'] && cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

  const loadBalancer = http.createServer((req, res) => {
    if (req.url && req.url.startsWith('/api/')) {
      const workers = cluster.workers;
      if (workers) {
        const workerIds = Object.keys(workers);
        const selectedWorkerId = workerIds[Math.floor(Math.random() * workerIds.length)]; // Random selection
        const selectedWorker = workers[selectedWorkerId];
        if (selectedWorker) {
          selectedWorker.send({ type: 'request', req, res });
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
  server.listen(PORT, () => {
    console.log(`Server ${process.pid} is running on http://localhost:${PORT}`);
  });
}

// Function to parse command-line arguments
function parseArgs(args) {
  const parsedArgs = {};
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    parsedArgs[key.replace(/^--?/, '')] = value || true; // Set value to true if no value provided
  });
  return parsedArgs;
}
