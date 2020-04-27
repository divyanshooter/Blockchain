import React,{Component} from 'react';
import {withRouter} from 'react-router';
import Spinner from '../spinner/spinner';
import ContractListItem from './contractListItem/contractListItem';
import Navigation from '../navigation/navigation';
import factory from '../../factory';

class ContractList extends Component{
    state={
        loading:true,
        contracts:[]
    }
    clickHandler=(page)=>{
        this.props.history.push(page);
   }

    async componentDidMount(){
        const contracts=await factory.methods.getContracts().call();
        this.setState({contracts:contracts,loading:false});
    }
    render(){
        let element=<h1>No Contract Yet</h1>
        if(this.state.contracts.length>0)
        {
             element=this.state.contracts.map(curr=>{
                 return <ContractListItem address={curr} key={curr} clickHandler={this.clickHandler}/>
             })
        }
        return (
             <div style={{ height:"100vh",overflowY:"scroll"}}>
                 <Navigation/>
                 {this.state.loading ?<Spinner/>: element}
             </div>
        )
    }
  
}

export default withRouter(ContractList);