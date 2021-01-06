import React,{useCallback, useState} from 'react';
import {  useStep } from 'react-hooks-helper';
import useForm from '../../common/useForm';
import BundleName from './BundleName';
import BundleType from './BundleType';
import BundlePricing from './BundlePricing';
import BundleConfig from './BundleConfig';
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
import {AUTHTOKEN,SHOPORIGIN ,SHOPID,API_HOST,ASSETS_HOST} from '../../common/constants';
import translations from '@shopify/polaris/locales/en.json';

const steps = [
  { id: 'BundleName', Component: BundleName },
  { id: 'BundleType', Component: BundleType },
  { id: 'BundlePricing', Component: BundlePricing },
  { id: 'BundleConfig', Component: BundleConfig },
  { id: 'confirmation', Component: ConfirmationForm },
  { id: 'publish',Component: PublishForm},
];



const Bundlewizard = ({data,programId}) => {
  console.log(programId);
  const [formData, setForm] = useForm(data);
  const [files, setFiles] = useState();
  const { step, navigation } = useStep({ initialStep: data.STATUS == 'DRAFT' ? 0 : 4, steps });
  const { Component } = step;

  const [message, setMessage] = useState(data.STATUS == 'DRAFT' ? ['Unsaved Bundle'] : []);
  const props = {  formData, setForm,navigation,files, setFiles,setMessage};
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
              i18n={translations}
            >
    <Frame>
      {revise ? '' :
    <ContextualSaveBar
                  message={message}
                  saveAction={{
                    onAction: async () => {
                            const request = formData;
                            setLoading(true);
                            if(request.PROGRAM_NAME)
                            {
                                    const resp =  await fetch(
                                      API_HOST+'/save',
                                        {
                                          method: 'POST',
                                          body : JSON.stringify(request),
                                    headers: {
                                            'Content-Type' : 'application/json',
                                            'token'     : AUTHTOKEN
                                          },
                                        },
                                
                                      );
                          const Subid = await resp.json();
                          if(Subid.bundles )
                          {
                            setForm(Subid.bundles,'PROGRAM_ID');
                            setMessage("Draft Bundle Saved!");
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
                                API_HOST+'/uploadimage',
                                                  {
                                                    method: 'PUT',
                                                    body : await toBase64(files[0]),
                                              headers: {
                                                      
                                                      'pgm_id'  : "b"+Subid.bundles,
                                                      'token'     : AUTHTOKEN
                                                    },
                                                  },
                                          
                                                );
                            }
                              
                            
                            }
                        else
                          setMessage("Error");

                            }
                            else
                            {
                              setMessage("Please enter a program name");
                            }
                    
                            setLoading(false);
                            
                      },
                    loading: false,
                    disabled: false,
                  }}
                  
                />
                }
                <br/>
                <br/>
      <Page breadcrumbs={[{content: 'Manage Bundles', url: '/manage_bundles'}]}
       title={formData.PROGRAM_NAME}
       thumbnail={ imageupload ? 
        <div style={{width: 50, height: 50}}> <DropZone onDrop={handleDrop} accept="image/*" type="image">
        <DropZone.FileUpload />
      </DropZone></div> :
        <Thumbnail
          source={files && files[0]  ?  window.URL.createObjectURL(files[0]) : ASSETS_HOST+"/b"+programId }
          alt=""        />
        
       }
       primaryAction={revise ?  <Button onClick={() => {
    
        setForm(parseInt(revision) + 1, 'REVISION_NUMBER');
        setForm('DRAFT', 'STATUS');
        setRevise(false);
        navigation.go(0);
        }}>Create Revision</Button> : ''}
       secondaryActions={[
          {
            content: 'Copy',
            accessibilityLabel: 'Secondary action label',
            onAction: async () => {
              const request = formData;
              request.PROGRAM_ID = -1;
              request.PROGRAM_NAME = 'COPY OF ' +request.PROGRAM_NAME;
              request.STATUS = 'DRAFT';
              setLoading(true);
      const resp =  await fetch(
        API_HOST+'bundles_dev/save',
                              {
                                method: 'POST',
                                body : JSON.stringify(request),
                          headers: {
                                  'Content-Type' : 'application/json',
                                  'token'     : AUTHTOKEN
                                },
                              },
                      
                            );
                      const Subid = await resp.json();
                      if(Subid.subscription_items )
                      {
                        setForm(Subid.subscription_items,'PROGRAM_ID');
                        setMessage(formData.PROGRAM_NAME+"Created");
                              setLoading(false);
                              setRevise(false);
                          
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
                  API_HOST+'/'+ formData.PROGRAM_ID+'/'+formData.REVISION_NUMBER,
                {
                  method: 'DELETE',
                  body : JSON.stringify(request),
                headers: {
                    'Content-Type' : 'application/json',
                    'token'     : AUTHTOKEN
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

export default Bundlewizard;
