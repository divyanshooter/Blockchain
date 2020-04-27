import React from 'react';
import './contractListItem.css';
const contarctListItem=(props)=>{
    return (
        <div className="card contractListItem">
         <div class="card-body">
           <h5 class="card-title">{props.address}</h5>
           <button class="btn btn-primary" onClick={()=>props.clickHandler('/cloudDetail/'+props.address)}>Click To View Contract</button>
         </div>
      </div>
    );
}

export default contarctListItem;