// @flow

import { spawn } from 'child_process';
import path from 'path';
import { writeSync } from 'fs';

const dockerComposePath = path.resolve(__dirname, '..', '..', 'docker-compose.yml');
let testLogs = [];
let coreServices = ['postgres', 'redis', 'rabbitmq', 'nginx'];

const serviceWaitTimes = {

};

let serviceProcesses = {};

export async function startCoreServices(){
  await Promise.all(coreServices.map(service => startService(service)));
}

function dataLogger(context:String){
  return (data:Buffer)=>{
    testLogs.push(context + ":" + data.toString());
  };
}

export async function startService(serviceName:String){

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
  await new Promise(resolve => {
    setTimeout(() => resolve(), waitTime);
  });

  // If the process closed, it didn't successfully start
  if (procClosed){
    console.log(serviceName, 'failed to start');
    writeSync("./dc.log", testLogs.join("\n"));
    throw new Error(serviceName + ' did not start');
  }

}

export async function stopService(serviceName: String){
  if (serviceProcesses[serviceName]){
    serviceProcesses[serviceName].kill();
    serviceProcesses[serviceName] = undefined;
  }
}

export async function stopServices(){
  await Promise.all(serviceProcesses.keys().map(serviceName => stopService(serviceName)));
}

process.on('exit', () =>{
  stopServices();
});
