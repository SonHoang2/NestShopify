import { Injectable } from '@nestjs/common';

import cluster from 'cluster';
import * as os from 'os';
import * as process from 'node:process';

const numCPUs = os.cpus().length;


@Injectable()
export class ClusterService {
    static clusterize(callback: Function): void {
        console.log(`Number of CPUs: ${numCPUs}`);
        
        if (cluster.isPrimary) {
            console.log(`MASTER SERVER (${process.pid}) IS RUNNING `);

            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });
        } else {
            callback();
        }
    }
}