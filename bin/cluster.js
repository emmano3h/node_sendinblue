// cluster.js
const cluster = require('cluster');
const os = require('os');

//console.log('cluster',cluster);
//console.log('os',os);

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i<cpus; i++) {
    cluster.fork();
  }
} else {
  require('./www');
}

cluster.on('exit', (worker, code, signal) => {
  if (code !== 0 && !worker.exitedAfterDisconnect) {
    console.log(`Worker ${worker.id} crashed. ` +
        'Starting a new worker...');
    cluster.fork();
  }
});