import React, { useContext } from 'react';
import {
    Button,
    Card,
    TextField
  } from '@shopify/polaris';

const BundleName = ({ formData, setForm,navigation ,setMessage}) => {

 const { next, go } = navigation;
 
 const {   PROGRAM_NAME,PROGRAM_DESCRIPTION     }= formData;
 return (
     <div>
         <Card title="Program Details" sectioned>
               <TextField  value={PROGRAM_NAME} id="PROGRAM_NAME" onChange={setForm} helpText="Enter a unique Name for the Bundle." required/>
              
              <TextField  value={PROGRAM_DESCRIPTION} id="PROGRAM_DESCRIPTION" onChange={setForm} helpText="Enter a detailed description for the Bundle." />
              
            </Card>
            <br/>
            <div style={{float:"right"}}>
              <Button primary size="large" onClick={() => PROGRAM_NAME && PROGRAM_DESCRIPTION? next() : setMessage("Name  and Description Required")} >Next</Button>
            </div>
            
     </div>
    
    );
};

export default BundleName;