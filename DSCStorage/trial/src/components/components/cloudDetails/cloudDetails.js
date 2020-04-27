import React,{Component} from 'react';
import {withRouter} from 'react-router'; 
import Cloud from '../../cloud';
import Navigation from '../navigation/navigation';
import Spinner from '../spinner/spinner';
import RenterDetail from './rentersDetail/renterDetail';
import './cloudDetail.css'
import web3 from '../../web';
class CloudDetail extends Component {
    state={
        tenant:{
            addr:'',
            size:'',
            price:'',
            days:'',
            replication:''
        },
        renters:[],
        rentersDetails:[],
        winners:[],
        winnerDetails:[],
        gotWinners:true,
        gotRent:true,
        loading:true,
        cost:1
    }

     findWinners=async()=>{
        const cloudAddress=this.props.match.params.address;
        const cloud=Cloud(cloudAddress);
        await this.setState({loading:true});
        const accounts=await web3.eth.getAccounts();
        const event=await cloud.methods.findTheWinner().send({
            from:accounts[0]
        });
        await console.log(event.events.winner_event.returnValues.got);
        this.setState({loading:false});

    }

    payRent=async()=>{
        const cloudAddress=this.props.match.params.address;
        const cloud=Cloud(cloudAddress);
        await this.setState({loading:true});
        const accounts=await web3.eth.getAccounts();
        const price=(parseInt(this.state.cost)).toString();
        await cloud.methods.giveRent().send({
            from:accounts[0],
            value:web3.utils.toWei(price,'ether')
        })

        //this has to be removed 
        // await cloud.methods.giveRent().send({
        //     from:accounts[0],
        //     value:price
        // })
        this.setState({loading:false});
    }

    becomeRenter=()=>{
        const cloudAddress=this.props.match.params.address;
        window.location='http://localhost:3000/renter/'+cloudAddress;
      }
      getRent=()=>{
        const cloudAddress=this.props.match.params.address;
        window.location='http://localhost:3000/getRent/'+cloudAddress;
      }
    async componentDidUpdate()
    {
        const cloudAddress=this.props.match.params.address;
        const cloud=Cloud(cloudAddress);
        const tenant=await cloud.methods.tenant().call();
        const renters=await cloud.methods.getRenters().call();
        const winners=await cloud.methods.getWinners().call();
        const gotWinners=await cloud.methods.gotWinners().call();
        const gotRent=await cloud.methods.gotRent().call();
        const balance=await cloud.methods.balance().call();
        const totalCost= await cloud.methods.totalCost().call();
        const rentersDetails=[];
        const winnerDetails=[];
        for(let curr of renters){
            
            const cost=await cloud.methods.renterPrice(curr).call();
            const size=await cloud.methods.renterSize(curr).call();
            const renter={addr:curr,price:cost,size:size};
            rentersDetails.push(renter);

        };
        if(winners.length>0)
        {
            for(let curr of winners){
                const index=renters.findIndex(cur=>cur===curr);
                const winner={addr:curr,price:rentersDetails[index].price,cost:rentersDetails[index]};
                winnerDetails.push(winner);
            }
        }
        const newTenant={...this.state.tenant};
        newTenant.days=tenant[4];
        newTenant.price=tenant[1];
        newTenant.addr=tenant[0];
        newTenant.replication=tenant[2];
        newTenant.size=tenant[3];
        this.setState({tenant:newTenant,renters:renters,rentersDetails,gotWinners,gotRent, balance,winners,winnerDetails,cost:totalCost,loading:false});
    }
    async componentDidMount()
    {
        const cloudAddress=this.props.match.params.address;
        const cloud=Cloud(cloudAddress);
        const tenant=await cloud.methods.tenant().call();
        const renters=await cloud.methods.getRenters().call();
        const winners=await cloud.methods.getWinners().call();
        const gotWinners=await cloud.methods.gotWinners().call();
        const gotRent=await cloud.methods.gotRent().call();
        const balance=await cloud.methods.balance().call();
        const totalCost= await cloud.methods.totalCost().call();
        console.log(winners);
        const rentersDetails=[];
        const winnerDetails=[];
        for(let curr of renters){
            
            const cost=await cloud.methods.renterPrice(curr).call();
            const size=await cloud.methods.renterSize(curr).call();
            const renter={addr:curr,price:cost,size:size};
            rentersDetails.push(renter);

        };
        if(winners.length>0)
        {

            for(let curr of winners){
                const index=renters.findIndex(cur=>cur===curr);
                const winner={addr:curr,price:rentersDetails[index].price,cost:rentersDetails[index]};
                winnerDetails.push(winner);
            }
        }
        console.log(winnerDetails);
        const newTenant={...this.state.tenant};
        newTenant.days=tenant[4];
        newTenant.price=tenant[1];
        newTenant.addr=tenant[0];
        newTenant.replication=tenant[2];
        newTenant.size=tenant[3];
        this.setState({tenant:newTenant,renters:renters,rentersDetails,gotWinners,gotRent, balance,winners,winnerDetails,cost:totalCost,loading:false});
    }
    render(){
        let renters=<h1>No Renters Yet</h1>
        if(this.state.rentersDetails.length>0)
         {
             renters=this.state.rentersDetails.map(curr=>{
                 return <RenterDetail address={curr.addr} price={curr.price} size={curr.size}/>
             })
         }
         let winners=<h1>No Winners Yet</h1>
         if(this.state.winnerDetails.length>0)
          {
              winners=this.state.winnerDetails.map(curr=>{
                  return <RenterDetail address={curr.addr} price={curr.price} size={curr.size}/>
              })
          }
         let controls=<button type="button" className=" btn btn-warning btn-lg tenantBtn mx-2" onClick={this.findWinners}>Get Winners</button>;
         if(this.state.gotWinners) {
             controls=(
             <form class="form-inline mt-5">
                            <div class="form-group mb-2">
                              <label className="sr-only">COST</label>
                              <input type="text"  readonly className="form-control" value={'Rs.'+this.state.cost}/>
                            </div>
                            <button type="submit" class="btn btn-danger mb-2" onClick={this.payRent}>Pay Price</button>

                         </form>)
             if(this.state.gotRent){
                controls=(
                    <form class="form-inline mt-5">
                                   <div class="form-group mb-2">
                                     <label className="sr-only">COST</label>
                                     <input type="text"  readonly className="form-control " value={this.state.cost}/>
                                   </div>
                                   <button type="submit" class="btn btn-success mb-2">Price Paid</button>
       
                                </form>)
             }
         }
        return(
            <div>
                <Navigation/>
                { this.state.loading ?<Spinner/>:
                <div className="container">
                    <div className="row">
                       <div className="col-6">
                           <div className="card tenant" >
                              < div class="card-body">
                                  <h5 className="alert alert-warning">Tenant</h5>
                                  <h6 class="card-title">{this.state.tenant.addr}</h6>
                                  <h6 class="card-subtitle ">Size:{this.state.tenant.size}</h6>
                                  <p class="card-text"><span className="blockquote"> Price:</span>{this.state.tenant.price}</p>
                                  <p class="card-text"><span className="blockquote"> Replications:</span>{this.state.tenant.replication}</p>
                                  <p class="card-text"><span className="blockquote"> Days:</span>{this.state.tenant.days}</p>
                                 </div>
                            </div>
                           
                        </div>
                        <div className="col-2 mt-5">
                         <h6>Balance : {this.state.balance/1000000000000000000}</h6>
                         {this.state.gotRent ?<button type="button" className=" btn btn-warning btn-lg tenantBtns " disabled={this.state.balance==='0'} onClick={this.getRent}>Get Rent</button> : null}
                        </div>
                        <div className="col-4">
                          {controls}
                          <button type="button" className=" btn btn-warning btn-lg tenantBtn" disabled={this.state.gotRent} onClick={this.becomeRenter}>Become Renter</button>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-6 renterContainer" style={{marginLeft:"1rem"}}>
                            <h5 className="alert alert-danger">Renters</h5>
                            {renters}
                        </div>
                    
                        <div className="col-5 renterContainer" style={{marginLeft:"2rem"}}>
                            <h5 className="alert alert-success">Winners</h5>
                            {winners}
                        </div>
                    </div>
                
                </div> } 

            </div>
        )
    }
}

export default withRouter(CloudDetail);