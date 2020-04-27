import React,{Component} from 'react';
import {withRouter} from 'react-router';
import Navigation from '../../components/navigation/navigation';
import Spinner from '../../components/spinner/spinner';
import factory from '../../factory';
import web3 from '../../web';
import './tenant.css';
class Tenant extends Component {
    state={
        size:'',
        price:'',
        redundancy:'',
        days:'',
        file:'',
        loading:false
        
        
    }
    onChangeHandler=(event)=>{

         this.setState({[event.target.name]:event.target.value});
    }
    onSubmitHandler=async (event)=>{
        event.preventDefault();
        await this.setState({loading:true});
        console.log(this.state.size);
        const account=await web3.eth.getAccounts();
        const result=await factory.methods.createContract(this.state.price,this.state.redundancy,this.state.size,this.state.days).send({
             from:account[0]
         });
         const address=result.events.contractAddr.returnValues.addr;
         this.props.history.push('/cloudDetail/'+address);
         
    }
    render(){
        return (
            <div> 
                <Navigation account={this.props.account}/>
                {this.state.loading ?<Spinner/> :
                <div className="tenantFormContainer">
                  <form onSubmit={this.onSubmitHandler}>
                    <div className="form-group">
                        <label htmlFor="size ">Data Size(in Bytes)</label>
                        <input type="number" className="form-control" name="size" onChange={this.onChangeHandler} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Expected Price(in Rs)</label>
                        <input type="number" className="form-control" name="price" onChange={this.onChangeHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="redundancy">Redundancy</label>
                        <input type="number" className="form-control"  name="redundancy" onChange={this.onChangeHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Days">Days</label>
                        <input type="number" className="form-control" name="days" onChange={this.onChangeHandler}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Contract</button>
                 </form>
             </div>}
            </div>
        )
    }
}

export default withRouter(Tenant);