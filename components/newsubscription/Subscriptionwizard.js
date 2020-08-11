import React,{useCallback, useState} from 'react';
import {  useStep } from 'react-hooks-helper';
import useForm from '../../common/useForm';
import SubscriptionName from './SubscriptionName';
import SubscriptionType from './SubscriptionType';
import SubscriptionPricing from './SubscriptionPricing';
import SubscriptionImage from './SubscriptionImage';
import SubscriptionConfig from './SubscriptionConfig';
import ConfirmationForm from './ConfirmationForm';
import PublishForm from './PublishForm';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import {
  Button,
  FormLayout,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle,
  DatePicker,
  Popover,
  ActionList,
  Select,
  ContextualSaveBar,
  Frame,
  AppProvider,
  Banner, Caption, DropZone, List, Thumbnail,Spinner
} from '@shopify/polaris';
import moment from 'moment';

const steps = [
  { id: 'subscriptionName', Component: SubscriptionName },
  { id: 'subscriptionType', Component: SubscriptionType },
  { id: 'subscriptionPricing', Component: SubscriptionPricing },
  { id: 'subscriptionConfig', Component: SubscriptionConfig },
  { id: 'confirmation', Component: ConfirmationForm },
  { id: 'publish',Component: PublishForm},
];



const Subscriptionwizard = ({data,programId}) => {
  console.log(programId);
  const [formData, setForm] = useForm(data);
  const [files, setFiles] = useState();
  const { step, navigation } = useStep({ initialStep: 0, steps });
  const { Component } = step;
  const props = {  formData, setForm,navigation,files, setFiles};
  const [message, setMessage] = useState(data.STATUS == 'DRAFT' ? ['Unsaved Subscription'] : []);
  const [loading, setLoading] = useState();
  const [pgmstate,setPgmstate] = useState(programId ? 'UPD' : 'NEW')
  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles(acceptedFiles);
      setImageupload(false);    
      },
        [],
      );
  const [revision, setRevision] = useState(data.REVISION_NUMBER);
  const [revise,setRevise] = useState(data.STATUS == 'DRAFT'? false : true);
  const [imageupload,setImageupload] = useState(false);
 
                
          
  return (
    <AppProvider
              theme={{
                logo: {
                  width: 124,
                  contextualSaveBarSource:
                    '',
                },
              }}
              i18n={{
                Polaris: {
                  Frame: {
                    skipToContent: 'Skip to content',
                  },
                  ContextualSaveBar: {
                    save: 'Save',
                    discard: 'Discard',
                  },
                  DropZone: {
                      actionTitle: 'Add file',
                      actionHint: 'or drop files to upload',
                  },
                },
              }}
            >
    <Frame>
      {revise ? '' :
    <ContextualSaveBar
                  message={message}
                  saveAction={{
                    onAction: async () => {
                            const request = formData;
                            setLoading(true);
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
                    if(Subid.subscription_items )
                    {
                      setForm(Subid.subscription_items,'PROGRAM_ID');
                      setMessage("Draft Subscription Saved!");
                      setLoading(false);
                      if(files && files[0])
                      {
                        
                        const toBase64 = file => new Promise((resolve, reject) => {
                                           const reader = new FileReader();
                                           reader.readAsDataURL(file);
                                           reader.onload = () => resolve(reader.result);
                                           reader.onerror = error => reject(error);
                                           });
                        const data = new FormData();
                        data.append('image', files[0]);
                        
                        const uploadfile = await fetch(
                                    			'https://subscribenow.app:8443/t/subscriptionsapp/imguploadsubscription',
                                            {
                                              method: 'PUT',
                                              body : await toBase64(files[0]),
                                    	  headers: {
                                                
                                                'pgm_id'  : Subid.subscription_items
                                              },
                                            },
                                    
                                          );
                      }
                        
                        
                        }
                    else
                      setMessage("Error");
                            setLoading(false);
                            
                      },
                    loading: false,
                    disabled: false,
                  }}
                  discardAction={{
                    onAction: () => console.log('add clear form logic'),
                  }}
                />
                }
                <br/>
                <br/>
      <Page breadcrumbs={[{content: 'Manage Subscriptions', url: '/manage_subscriptions'}]}
       title={formData.PROGRAM_NAME}
       thumbnail={ imageupload ? 
        <div style={{width: 50, height: 50}}> <DropZone onDrop={handleDrop} accept="image/*" type="image">
        <DropZone.FileUpload />
      </DropZone></div> :
        <Thumbnail
          source={files && files[0]  ?  window.URL.createObjectURL(files[0]) : "https://objectstorage.us-phoenix-1.oraclecloud.com/n/axzxx9cwmhzp/b/subscribenow/o/"+programId }
          alt=""        />
        
       }
       primaryAction={revise ?  <Button onClick={() => {
    
        setForm(parseInt(revision) + 1, 'REVISION_NUMBER');
        setForm('DRAFT', 'STATUS');
        setRevise(false);
        }}>Create Revision</Button> : ''}
       secondaryActions={[
          {
            content: 'Copy',
            accessibilityLabel: 'Secondary action label',
            onAction: async () => {
              const request = formData;
              request.PROGRAM_ID = -1;
              request.PROGRAM_NAME = 'COPY OF ' +request.PROGRAM_NAME;
              setLoading(true);
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
                      if(Subid.subscription_items )
                      {
                        setForm(Subid.subscription_items,'PROGRAM_ID');
                        setMessage(formData.PROGRAM_NAME+"Created");
                              setLoading(false);
                          
                          
                          }
                      else
                        setMessage("Error");
                              setLoading(false);
                              
                        },
          },
          {
            content: 'Change Image',
            onAction: () => setImageupload(true),
            
          },
          {
            content: 'Delete',
            onAction: async () => {
              const request = formData;
              setLoading(true);
                const result = await fetch(
                'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/manage/subscription/'+ formData.PROGRAM_ID+'/'+formData.REVISION_NUMBER,
                {
                  method: 'DELETE',
                  body : JSON.stringify(request),
                headers: {
                    'Content-Type' : 'application/json'
                  },
                },
        
                );
                let subresp = await result.json();
                if(subresp.Status == "Success")
                {
                  setMessage(formData.PROGRAM_NAME +" Revision " + formData.REVISION_NUMBER+" Deleted");
                  setLoading(false);
                }else{
                  setMessage("Error");
                  setLoading(false);
                }

           
          },
          }

        ]}
	     separator
	    >
         <FormLayout>
         {loading?<Spinner accessibilityLabel="Spinner example" size="large" color="teal" />:''}
           <Component {...props} />
           </FormLayout>
        
      </Page>
      </Frame>
        </AppProvider>);
};

export default Subscriptionwizard;
