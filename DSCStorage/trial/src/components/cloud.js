import web3 from './web';
import Cloud from '../abis/Cloud.json';

export default (address)=>{
    return new web3.eth.Contract(JSON.parse(Cloud.interface),address);
};