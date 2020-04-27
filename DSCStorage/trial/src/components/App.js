import React,{Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import ContractList from './components/contractsList/contractList';
import CloudDetails from './components/cloudDetails/cloudDetails';
import DetailCard from './components/detailCard/detailCard';
import Tenant from './container/tenant/tenant';
import Renter from './container/renter/renter';
import GetRent from './components/getRent/getRent';
import Spinner from './components/spinner/spinner';
import './App.css';


class App extends Component {
  state={
    loading:false,
  }
 
  render(){
       return (
         <div className="App">
           {console.log(this.state)}
          { !this.state.loading?<BrowserRouter>
             <Route path='/' exact render={()=><DetailCard account={this.state.account}/>} />
             <Route path='/tenant' render={()=><Tenant account={this.state.account}/> }/>
             <Route path='/renter/:address' render={()=><Renter account={this.state.account}/>}/>
             <Route path='/cloudDetail/:address' component={CloudDetails}/>
             <Route path='/getRent/:address' component={GetRent}/>
             <Route path='/contractList' component={ContractList}/>
           </BrowserRouter>: <Spinner/>}
         </div>
     
       );
    }
}

export default App;
