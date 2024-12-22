import { Injectable } from '@nestjs/common';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

@Injectable()
export class ClusterService {
  static buildClusters(callback: () => void): void {
    if (cluster.isPrimary) {
      console.log(
        `MASTER SERVER (${process.pid}) IS RUNNING for ${numCPUs} cpus`,
      );

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}
