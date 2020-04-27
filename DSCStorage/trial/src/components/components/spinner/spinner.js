import React from "react";
import './spinner.css';

const spinner=()=>{
    return (
           <div className="spinner">
               <div class="lds-circle"><div></div></div>
           </div>
    )
}

export default spinner;