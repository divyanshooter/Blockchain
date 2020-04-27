import React,{Component} from 'react';
import {withRouter} from 'react-router';
import Navigation from '../../components/navigation/navigation';
import Spinner from '../../components/spinner/spinner';
import Cloud from '../../cloud';
import web3 from '../../web';

class getRent extends Component {
    state={
        address:'',
        price:'',
        loading:false
        
        
    }
    onChangeHandler=(event)=>{

        this.setState({[event.target.name]:event.target.value});
   }
    
    onSubmitHandler=async (event)=>{
        event.preventDefault();
        if(!this.state.address){
            return;
        }
        await this.setState({loading:true});
        const account=await web3.eth.getAccounts();
        const cloud=Cloud(this.state.address);
        await cloud.methods.checking().send({
            from:account[0]
        })
         window.location='http://localhost:3000/cloudDetail/'+this.state.address;

    }
    
    async componentDidMount(){
        const cloudAddress=this.props.match.params.address;
        const account=await web3.eth.getAccounts();
        const cloud=Cloud(cloudAddress);
        const result=await cloud.methods.storelords(account[0]).call();
        this.setState({address:cloudAddress,price:result[0],loading:false});
    }
    render(){
        return (
            <div>
                <Navigation/>
                {this.state.loading ? <Spinner/>:
                <form class="form-inline mx-5 mt-5" onSubmit={this.onSubmitHandler}>
                   <div class="form-group mb-2">
                     <label className="sr-only">Price</label>
                     <input type="text"  readonly className="form-control " value={this.state.price}/>
                   </div>
                   <button type="submit" class="btn btn-success mb-2">Get Rent</button>
               </form>}
            </div>
        )
    }
}

export default withRouter(getRent);