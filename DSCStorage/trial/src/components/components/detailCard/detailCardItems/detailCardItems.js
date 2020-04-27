import React from 'react';
import './detailCardItems.css';
const detailCardItem=(props)=>{
    return (
        <div className="detailCardItem">
            <h1>{props.topic}</h1>
            <p>{props.detail}</p>
        </div>

    )
}

export default detailCardItem;