import React,{useCallback, useState} from 'react';
import {
    Card,   
    DisplayText,
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
         <Card.Section title="Name and Description">

         <List>
         <List.Item>  {PROGRAM_NAME}  </List.Item>
         <List.Item>{PROGRAM_DESCRIPTION} </List.Item>
         </List>
         </Card.Section>
         <Card.Section title="Program Configuration">

         <List>
         <List.Item> {PROGRAM_PRICING_TYPE}  -  {PROGRAM_PRICING_RATE}   </List.Item> 
         </List>
         </Card.Section>
         <Card.Section title="Dates">
          <List>
          {moment(PROGRAM_START_DATE).format('MM/DD/YYYY') } -
          {moment(PROGRAM_END_DATE).format('MM/DD/YYYY')}   
          </List>
          </Card.Section>

         
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
         {STATUS == 'DRAFT' ?
         <div>
         <div style={{float:"left"}}>
          <Button primary size="large" onClick={previous} >Back</Button>
        </div>
        <div style={{float:"right"}}>
          <Button primary size="large" onClick={next} >Submit</Button>
        </div>
        </div>
        : ''}
   </div>
 );
};

export default ConfirmationForm;