import React,{Component} from 'react';
import {withRouter} from 'react-router';
import Navigation from '../../components/navigation/navigation';
import Spinner from '../../components/spinner/spinner';
import Cloud from '../../cloud';
import web3 from '../../web';
import './renter.css';
class Renter extends Component {
    state={
        address:'',
        size:'',
        price:'',
        loading:false
        
        
    }
    
    onChangeHandler=(event)=>{

         this.setState({[event.target.name]:event.target.value});
    }
    onSubmitHandler=async (event)=>{
        event.preventDefault();
        if(this.state.address==='0'){
            return;
        }
        await this.setState({loading:true});
        const account=await web3.eth.getAccounts();
        const cloud=Cloud(this.state.address);
        await cloud.methods.addRenter(this.state.size,this.state.price)
        .send({
             from:account[0]
         });
         window.location='http://localhost:3000/cloudDetail/'+this.state.address;

    }
    
    componentDidMount(){
        const cloudAddress=this.props.match.params.address;
        this.setState({address:cloudAddress});
    }
    render(){
        return (
            <div>
                <Navigation/>
                {this.state.loading ? <Spinner/>:
                <div className="renterFormContainer">
                   <form onSubmit={this.onSubmitHandler}>
                   <div className="form-group">
                           <label htmlFor="size ">Contract Address</label>
                           <input type="text" className="form-control" required name="address" onChange={this.onChangeHandler} value={this.state.address}/>
                       </div>
                       <div className="form-group">
                           <label htmlFor="size ">Data Size(in Bytes)</label>
                           <input type="number" className="form-control" required  name="size" onChange={this.onChangeHandler} value={this.state.size}/>
                       </div>
                       <div className="form-group">
                           <label htmlFor="price">Price(in Rs)</label>
                           <input type="number" className="form-control" required  name="price" onChange={this.onChangeHandler} value={this.state.price}/>
                       </div>
                       <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
               </div>}
            </div>
        )
    }
}

export default withRouter(Renter);