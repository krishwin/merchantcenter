import React, { useContext } from 'react';
import {
    Button,
    Card,
    TextField
  } from '@shopify/polaris';

const SubscriptionName = ({ formData, setForm,navigation }) => {

 const { next, go } = navigation;
 
 const {   PROGRAM_NAME,PROGRAM_DESCRIPTION     }= formData;
 return (
     <div>
         <Card title="Program Details" sectioned>
               <TextField  value={PROGRAM_NAME} id="PROGRAM_NAME" onChange={setForm} helpText="Enter a unique Name for the Subscription program." />
              
              <TextField  value={PROGRAM_DESCRIPTION} id="PROGRAM_DESCRIPTION" onChange={setForm} helpText="Enter a detailed description for the Subscription program." />
              
            </Card>
            <br/>
            <div style={{float:"right"}}>
              <Button primary size="large" onClick={next} >Next</Button>
            </div>
            
     </div>
    
    );
};

export default SubscriptionName;