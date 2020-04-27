const path=require('path');
const fs=require('fs-extra');
const solc=require('solc');


const buildPath=path.resolve(__dirname,'..','trial','src','abis');

fs.removeSync(buildPath);

const cloudPath=path.resolve(__dirname,'contract','Storage.sol');
const source=fs.readFileSync(cloudPath,'utf8');
const output=solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);
for(let contract in output){
    fs.outputJsonSync(
    path.resolve(buildPath,contract.replace(':','')+'.json'),
    output[contract]
    );
}