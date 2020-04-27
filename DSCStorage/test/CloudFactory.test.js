const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compiledFactory=require('../etherum/build/CloudFactory.json');
const compiledCloud=require('../etherum/build/Cloud.json');

let accounts;
let factory;
let cloudAddr;
let cloud;
beforeEach(async ()=>{
      accounts=await web3.eth.getAccounts();
      factory=await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data:compiledFactory.bytecode})
        .send({from:accounts[0],gas:'1000000'});
   
     await factory.methods.createContract(10,10,10,10)
      .send({from:accounts[0],gas:'1000000'
    });

    [cloudAddr]=await factory.methods.getContracts().call();
    
    cloud=await new web3.eth.Contract(JSON.parse(compiledCloud.interface),cloudAddr)

});

describe('Clouds',()=>{
    it('Deploys Factory and cloud',()=>{
        assert.ok(factory.options.address);
        assert.ok(cloud.options.address);

    });
})