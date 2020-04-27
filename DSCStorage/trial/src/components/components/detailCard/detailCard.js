import React from 'react';
import DetailCardItem from './detailCardItems/detailCardItems';
import Navigation from '../navigation/navigation';
import Footer from '../footer/footer';

const detailCards=(props)=>{
   const  renter='The renter is the person who will rent his hard disk.To rent his hard disk he has to select the contract and click on become the renter if the contract declares the renter winner he will able to rent the hard disk and the contract calculates the price also for the particular renter.The renter will be given rent if the contract found the renter has files uploaded by the tenant and after every 24 hrs the renter is able to withdraw.If in case the files are not found no further fund will release' ;
   const tenant='The tenant is the person who will buy the hard disk.To buy hard disk he has to create the contract and provide the necessary details after appropriate getting renters, click on getWinner ,the contract declares the renter winner and then tenant will able to buy the hard disk.Once the tenant clicks on findThewinner the contract calculates the optimal money and give teanant the price to pay it.After the teanant pays the price the files are uploaded to renter';
    return (
        <div>
           <Navigation account={props.account}/>
           <div className="container">
              <div className="row">
                  <DetailCardItem topic="Renter"  detail={renter}/>
                  <DetailCardItem topic="Tenant" detail={tenant}/> 
              </div>
   
           </div>
           <Footer/>
        </div>
    )
}

export default detailCards;