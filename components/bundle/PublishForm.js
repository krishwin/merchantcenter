import React, {useCallback, useState,useEffect} from 'react';
import {ProgressBar,Toast,Banner} from '@shopify/polaris';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID,API_HOST} from '../../common/constants';
const PublishForm = ({ formData, setForm,navigation }) =>  {
    const [loading, setLoading] = useState( true);
    const [active, setActive] = useState(false);
    const [message,setMessage] = useState('Subscription Published');
    const [status,setStatus] = useState('Subscription Published');
    const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Banner title="Bundle Status" onDismiss={() => {}} status={status}>
        <p>{message}</p>
        </Banner>
  ) : null;
    useEffect(() => {
        setForm('PUBLISHED','STATUS');
        const request = formData;
        
        const publish = async () => {
            request.STATUS = 'PUBLISHED';
            
            const discresp =  await fetch(
              API_HOST+'/discount',
            {
              method: 'POST',
              body : JSON.stringify(request),
          headers: {
                'Content-Type' : 'application/json',
                'token'     : AUTHTOKEN,
                'store'     : SHOPORIGIN,
              },
            },
    
          );
          const discount = await discresp.json();

          if(discount.discount_code && discount.discount_code.id)
          {
              request.PRICE_RULE_ID = discount.discount_code.price_rule_id;
              request.DISCOUNT_ID = discount.discount_code.id;
              request.DISCOUNT_CODE =discount.discount_code.code;
              setForm(discount.discount_code.price_rule_id,'PRICE_RULE_ID');
              setForm(discount.discount_code.id,'DISCOUNT_ID');
              setForm(discount.discount_code.code,'DISCOUNT_CODE');
              const resp =  await fetch(
                API_HOST+'/save',
            {
              method: 'POST',
              body : JSON.stringify(request),
          headers: {
                'Content-Type' : 'application/json',
                'token'     : AUTHTOKEN,
              },
            },
    
          );
            const Subid = await resp.json();
            setLoading(false);
            toggleActive();
            if(Subid.bundles )
                        {
                            setMessage('Bundle Published.');
                            setStatus("success");
                        }
            else
            {
                setMessage('Publish failed. Please try again later.');
                setStatus("critical");
            }
          }
          else
          {
            setLoading(false);
            toggleActive();
            setMessage('Publish failed. Please try again later.');
            setStatus("critical");
          }
        
        }
    publish();
    },[]);

    return (
        <div>
            <ProgressBar progress={loading ? 10:100} />
            <br/>
         {toastMarkup}
        </div>
        
    );
}


export default PublishForm;