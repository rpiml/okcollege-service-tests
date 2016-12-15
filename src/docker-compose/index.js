// @flow

import { spawn } from 'child_process';
import path from 'path';
import { writeFileSync } from 'fs';
import Docker from 'dockerode';


const dockerComposePath = path.resolve(__dirname, '..', '..', '..', 'docker-compose.yml');
const testLogs = [];
const coreServices = ['postgres', 'redis', 'rabbitmq', 'nginx'];

const serviceWaitTimes = {

};

const serviceProcesses = {};

let dockerDaemon;
let systemCleaned = false;
export async function cleanSystem() : Promise<*> {
  // For now we only clean once
  if (!systemCleaned) {
    console.log('Shutting down containers...');
    dockerDaemon = new Docker();
    await (new Promise((resolve) => {
      // Shut down all currently running containers
      dockerDaemon.listContainers((err, containers) => {
        Promise.all([containers.map((containerInfo) => new Promise((onStop) => {
          dockerDaemon.getContainer(containerInfo.Id).stop(() => onStop());
        }))]).then(resolve);
      });
    }));
    console.log('Containers shut down.');
    systemCleaned = true;
  }
}

export async function startCoreServices() {
  await cleanSystem();
  await Promise.all(coreServices.map((service) => startService(service)));
}

function dataLogger(context: string) {
  return (data: Buffer) => {
    testLogs.push(`${context}:${data.toString()}`);
  };
}

export async function startService(serviceName: string) {
  // Start Service Process
  const proc = spawn('docker-compose', ['-f', dockerComposePath, 'up', serviceName]);

  // Listen for incoming data
  proc.stdout.on('data', dataLogger('stdout'));
  proc.stderr.on('data', dataLogger('stderr'));

  // Watch for close
  let procClosed = false;
  proc.on('close', () => {
    procClosed = true;
    console.log(serviceName, 'closed');
    testLogs.push(`${serviceName} closed`);
  });

  // Set service in process registy
  serviceProcesses[serviceName] = proc;

  // Wait until service startes
  // TODO add new methods (e.g. watching stdout) to wait for services to start
  const waitTime = serviceWaitTimes[serviceName] || 1000;
  await new Promise((resolve) => {
    setTimeout(() => resolve(), waitTime);
  });

  // If the process closed, it didn't successfully start
  if (procClosed) {
    console.log(serviceName, 'failed to start');
    writeLogs();
    throw new Error(`${serviceName} did not start`);
  }
}

export async function stopService(serviceName: string): Promise<*> {
  if (serviceProcesses[serviceName]) {
    serviceProcesses[serviceName].kill();
    serviceProcesses[serviceName] = undefined;
  }
}

export async function stopServices() {
  await Promise.all(serviceProcesses.keys().map((serviceName) => stopService(serviceName)));
}

export function writeLogs(logPath: string = '/tmp/okcservices.log') {
  console.log('Writing test log to', logPath);
  writeFileSync(logPath, testLogs.join('\n'));
}

export function printLogs() {
  console.log(testLogs.join('\n'));
}

process.on('exit', () => {
  stopServices();
});
