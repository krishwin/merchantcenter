import React, {useCallback, useState,useEffect } from 'react';
import {Bundlewizard} from  '../components/bundle';
import { useRouter } from 'next/router';
import {Spinner} from '@shopify/polaris';
import  {  cloneDeepLimited } from '../common/utils';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID,API_HOST} from '../common/constants';
const defaultData = {
  PROGRAM_ID:'-1',
  PROGRAM_NAME:'',
  PROGRAM_DESCRIPTION:'',
  BOM_ITEM_NO:'1',
  NO_OF_CANCEL_RET:'',
  ALLOW_RET_LABEL:'',
  PROGRAM_START_DATE:new Date(),  
  PROGRAM_END_DATE:new Date(),
  NO_OF_RETRY:'',
  RETRY_PERIOD:'DAILY',
  REPEAT_OPTION:'Monthly',
  CUST_ACCOUNT_ID:'',
  BOM_ITEM_DESC:'',
  BOM_TYPE:'pack',
  PROGRAM_TYPE:'Shippable',
  PROGRAM_PRICING_TYPE:'NO',
  PROGRAM_PRICING_RATE:'0',
  PRODUCTS:[{
      PRODUCT_ID:'',
      PRODUCT_DESC:'',
      TYPE:'Collection',
      PROGRAM_LEVEL:'',
      PROGRAM_LINE_ID:-1

  }],
  IMAGES:[],
  STATUS:'DRAFT',
  CUST_ACCOUNT_ID: SHOPID,
  REVISION_NUMBER:'0',
  PRICE_RULE_ID:'',
  DISCOUNT_ID:'',
  DISCOUNT_CODE:'',
  
};
const new_bundle = () =>
{
  const router = useRouter();
  const { id,rev } = router.query;
  const [data,setData] = useState(defaultData);
  const changeData = useCallback(
    (value) => setData(value),
    [],
  );
  const [loading, setLoading] = useState(id ? true:false);
          useEffect(() => {
            const fetchData = async () => {
        const result = await fetch(
          API_HOST+'/'+ id+'/'+rev,
        {
          method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'token'     : AUTHTOKEN
          },
        },

        );
        let subresp = await result.json();
        let resp = subresp.bundles[0];
        const respdata =cloneDeepLimited(defaultData);
        respdata.PROGRAM_ID = resp.PROGRAM_ID;
        respdata.PROGRAM_NAME = resp.PROGRAM_NAME;
        respdata.PROGRAM_DESCRIPTION 	=	resp.PROGRAM_DESCRIPTION ;
        respdata.BOM_ITEM_NO	=	  resp.BOM_ITEM_NO ? resp.BOM_ITEM_NO : "1";
        respdata.NO_OF_CANCEL_RET	=	  resp.NO_OF_CANCEL_RET +'';
        respdata.ALLOW_RET_LABEL 	=	  resp.ALLOW_RET_LABEL +'';
        respdata.PROGRAM_START_DATE   	=	  resp.PROGRAM_START_DATE ;
        respdata.PROGRAM_END_DATE 	=	  resp.PROGRAM_END_DATE;
        respdata.NO_OF_RETRY 	=	  resp.NO_OF_RETRY ? resp.NO_OF_RETRY+'' : ''; 
        respdata.RETRY_PERIOD 	=	  resp.RETRY_PERIOD ?resp.RETRY_PERIOD : 'RETRY_PERIOD' ;
        respdata.REPEAT_OPTION 	=	  resp.REPEAT_OPTION ? resp.REPEAT_OPTION : 'REPEAT_OPTION';
        respdata.CUST_ACCOUNT_ID 	=	  resp.ORG_ID ;
        respdata.BOM_ITEM_DESC 	=	  resp.BOM_ITEM_DESC ;
        respdata.BOM_TYPE 	=	  resp.BOM_TYPE ? resp.BOM_TYPE :''  ;
        respdata.PROGRAM_TYPE 	=	  resp.PROGRAM_TYPE ? resp.PROGRAM_TYPE :'Shippable' ;
        respdata.PROGRAM_PRICING_TYPE 	=	  resp.PROGRAM_PRICING_TYPE ? resp.PROGRAM_PRICING_TYPE :'NO' ; 
        respdata.PROGRAM_PRICING_RATE 	=	  resp.PROGRAM_PRICING_RATE? resp.PROGRAM_PRICING_RATE +'' : '1' ;
        respdata.STATUS	=	  resp.STATUS;
        respdata.PRODUCTS =subresp.products ?subresp.products :  [{
          PRODUCT_ID:'',
          PRODUCT_DESC:'',
          TYPE:'Collection',
          PROGRAM_LEVEL:'',
          PROGRAM_LINE_ID:-1
    
      }];
        respdata.REVISION_NUMBER = resp.REVISION_NUMBER;
        
        
        console.log(respdata);

       setData(respdata);
       setLoading(false);
        }
        
      
        if(id){
        fetchData();
        
        }else{
          setData(defaultData);
        }
        
        },[]);

  return (
    <div>
    {loading ? <Spinner accessibilityLabel="Spinner example" size="large" color="teal" /> : 
  <Bundlewizard data={data} programId={id}/>}
  </div>
  );
}

export default new_bundle;
