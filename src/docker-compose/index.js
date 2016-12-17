// @flow

import { spawn, exec } from 'child_process';
import path from 'path';
import { writeFileSync } from 'fs';

const okcPath = path.resolve(__dirname, '..', '..', '..');
const testLogs = [];
const coreServices = ['postgres', 'redis', 'rabbitmq', 'nginx'];

const serviceWaitTimes = {
  postgres: 1000,
  redis: 5000,
  rabbitmq: 10000,
  nginx: 1000,
  "ml-predictor": 20000
};

const serviceProcesses = {};

let logging = false;

export async function cleanSystem() : Promise<*> {
  // For now we only clean once
  console.log('Shutting down containers...');
  await stopServices();
  await new Promise((resolve) => {
    exec('docker-compose down', {
      cwd: okcPath,
    }, (err, stdout, stderr) => {
      console.log(stdout.toString(), stderr.toString());
      console.log('Containers shut down.');
      resolve();
    });
  });
}

export async function startCoreServices() {
  try {
    await cleanSystem();
  } catch (err) {
    console.log('Error while cleaning system');
    throw err;
  }
  try {
    await startServices(coreServices);
  } catch (err) {
    console.log('Error while starting core services');
    throw err;
  }
}

function dataLogger(context: string) {
  return (data: Buffer) => {
    if (logging){
      console.log(data.toString());
    }
    testLogs.push(`${context}:${data.toString()}`);
  };
}

export async function startService(serviceName: string) {
  return await startServices([serviceName]);
}

export async function startServices(services: Array<string>) {
  console.log("Starting services", services);
  // Start Service Process
  const proc = spawn('docker-compose', ['up'].concat(services), {
    cwd: okcPath
  });

  // Listen for incoming data
  proc.stdout.on('data', dataLogger('stdout'));
  proc.stderr.on('data', dataLogger('stderr'));

  // Watch for close
  let procClosed = false;
  proc.on('close', () => {
    procClosed = true;
    console.log(services, 'closed');
    testLogs.push(`${services} closed`);
  });

  // Set service in process registy
  services.forEach((serviceName) => {
    serviceProcesses[serviceName] = proc;
  });

  // Wait until service startes
  // TODO add new methods (e.g. watching stdout) to wait for services to start
  const waitTime = Math.max(...services.map((n) => serviceWaitTimes[n] || 10000));
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

export function startLogging() {
  logging = true;
}

export async function stopServices() {
  await Promise.all(Object.keys(serviceProcesses).map((serviceName) => stopService(serviceName)));
}

export function writeLogs(logPath: string = '/tmp/okcservices.log') {
  console.log('Writing test log to', logPath);
  writeFileSync(logPath, testLogs.join('\n'));
}

export function printLogs() {
  console.log(testLogs.join('\n'));
}
