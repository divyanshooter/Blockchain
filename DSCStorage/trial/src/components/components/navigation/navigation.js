import React,{Component} from 'react';
import {withRouter} from 'react-router';
import './navigation.css';
import web3 from '../../web';

class navigation extends Component{
  state={
    account:'',
  }

  async componentDidMount()
  {
    const address=await web3.eth.getAccounts();
    const addrr=address[0].substr(0,6)+'....'+address[0].substr(address[0].length-4,4);
    this.setState({account:addrr});
  }
  clickHandler=(page)=>{
         this.props.history.replace(page);
    }
    absolutePath=(page)=>{
      window.location=page;
    }
    render(){
     return (
         <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
           <a class="navbar-brand" href="#">DSC Storage</a>
           <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
             <span class="navbar-toggler-icon"></span>
           </button>
       
         <div class="collapse navbar-collapse dropBoxMargin" id="navbarSupportedContent">
             <ul class="navbar-nav ml-auto">
               <li class="nav-item active">
               <button type="button" className="btn btn-dark navigationBtn" onClick={()=>this.clickHandler('/') }>Home</button>
               </li>
               <li class="nav-item">
               <button type="button" className="btn btn-dark navigationBtn" onClick={()=>this.clickHandler('/tenant')}>Tenant</button>
              </li>
              <li class="nav-item">
              <button type="button" className="btn btn-dark navigationBtn"onClick={()=>this.clickHandler('/renter/0')}>Renter</button>
              </li>
                  <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  More
                </a>
                <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                  <a class="dropdown-item">{this.state.account}</a>
                  <div class="dropdown-divider"></div>
                  <button className="btn dropdown-item" onClick={()=>this.absolutePath('http://localhost:3000/contractList')}>Contract List</button>
              </div>
         </li>
       </ul>
        </div>
     </nav>
 
     );
   }
} 

export default withRouter(navigation);