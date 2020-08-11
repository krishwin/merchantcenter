import React, {useCallback, useState,useEffect} from 'react';
import {ProgressBar,Toast,Banner} from '@shopify/polaris';
const PublishForm = ({ formData, setForm,navigation }) =>  {
    const [loading, setLoading] = useState( true);
    const [active, setActive] = useState(false);
    const [message,setMessage] = useState('Subscription Published');
    const [status,setStatus] = useState('Subscription Published');
    const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Banner title="Subscription Status" onDismiss={() => {}} status={status}>
        <p>{message}</p>
        </Banner>
  ) : null;
    useEffect(() => {
        setForm('PUBLISHED','STATUS');
        const request = formData;
        const publish = async () => {
            request.STATUS = 'PUBLISHED';
        const resp =  await fetch(
            'https://subscribenow.app:8443/t/subscriptionsapp/addsubscriptions',
        {
          method: 'POST',
          body : JSON.stringify(request),
      headers: {
            'Content-Type' : 'application/json'
          },
        },

      );
        const Subid = await resp.json();
        setLoading(false);
        toggleActive();
        if(Subid.subscription_items )
                    {
                        setMessage('Subscription Published.');
                        setStatus("success");
                    }
        else
        {
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