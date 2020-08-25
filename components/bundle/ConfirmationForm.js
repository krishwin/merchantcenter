import React,{useCallback, useState} from 'react';
import {
    Card,   
    TextField,
    Button,
    List
  } from '@shopify/polaris';
  import moment from 'moment';
const ConfirmationForm = ({ formData,setForm,navigation }) => {
const {PROGRAM_ID,PROGRAM_NAME,
                PROGRAM_DESCRIPTION,
                BOM_ITEM_NO,
                NO_OF_CANCEL_RET,
                PROGRAM_START_DATE,  
                PROGRAM_END_DATE,
                NO_OF_RETRY,
                RETRY_PERIOD,
                REPEAT_OPTION,
                CUST_ACCOUNT_ID,
                BOM_ITEM_DESC,
                BOM_TYPE,
                PROGRAM_TYPE,
                PROGRAM_PRICING_TYPE,
                PROGRAM_PRICING_RATE,
              PRODUCTS,
              STATUS} = formData;
 const { previous,next, go } = navigation;
 return(
    <div>
         <Card title="Review and Submit" sectioned>
        
         <TextField  label="Name" value={PROGRAM_NAME}   disabled />
         <TextField   label="Description" value={PROGRAM_DESCRIPTION}   disabled />
         <TextField   label="Program Configuration" value={BOM_TYPE}   disabled />
         <TextField   label="Pricing"  value={PROGRAM_PRICING_TYPE}    disabled />
         <TextField   label="Discounted Rate"  value={PROGRAM_PRICING_RATE}    disabled />         
         <TextField   label="Start Date"  value={moment(PROGRAM_START_DATE).format('MM/DD/YYYY')}    disabled />
         <TextField   label="End Date" value={moment(PROGRAM_END_DATE).format('MM/DD/YYYY')}    disabled />
         <Card.Section title="Products">
         <List type="number">

           {
             PRODUCTS.map( (product)=> (
              <List.Item>  {product.PRODUCT_DESC}  </List.Item>
             )
             )}
          </List>
         </Card.Section>

         </Card>
         <br/>
         <div style={{float:"left"}}>
          <Button primary size="large" onClick={previous} >Back</Button>
        </div>
        {PROGRAM_ID > -1 && STATUS == 'DRAFT'?
        <div style={{float:"right"}}>
          <Button primary size="large" onClick={next} >Submit</Button>
        </div>
        : ''}
   </div>
 );
};

export default ConfirmationForm;