import web3 from './web';
import CloudFactory from '../abis/CloudFactory.json';


const factory=new web3.eth.Contract(
    JSON.parse(CloudFactory.interface),
    'Deployed Contract Address'
 );


export default factory;