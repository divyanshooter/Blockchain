import React from 'react';
import './renterDetail.css';
const renterDetail=(props)=>{
    return (
        <div className="renterDetail">
           <p className="badge badge-success font-weight-bold">{props.address}</p>
           <p className="badge badge-success font-weight-bold">{props.size}</p>
           <p className="badge badge-success font-weight-bold">{props.price}</p>

        </div>
    )
}

export default renterDetail;