import React, {useCallback, useState,useEffect} from 'react';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import {
  Button,
  Card,
  Form,
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
import { useRouter } from 'next/router';

 const subscription = () =>  {
  const router = useRouter();
  const { id } = router.query;
  const [loading,setLoading]= useState(true);
  const {subscription,setSubscription} = useState({'a':'b'});
  
   useEffect(() => {
    	const fetchData = async () => {
      const result = await fetch(
			'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/manage/subscription/'+ id,
        {
          method: 'GET',
	  headers: {
            'Content-Type' : 'application/json'
          },
        },

      );
		let resp = await result.json();
		console.log(resp);
	setProgramname(resp.program_name);
   setProgramdesc(resp.program_description);
    setNumretries(resp.no_of_retry+'');
    setRetryperiods(resp.retry_period);
    setCycle(resp.repeat_option);
    setProduct(resp.bom_item_no);
    setNumcancels(resp.no_of_cancel_ret +'');
    setSelectedDates(new Date(resp.program_start_date.split("T")[0]));
    setSelectedendDates(new Date(resp.program_end_date.split("T")[0]));
    setProducttitle(resp.bom_item_desc);
    setLoading(false);
    setRevision(resp.revision_number);
    }
	    fetchData();
	  },[]);

  
  
 const [{month, year}, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState(new Date());
  const [selectedendDates, setSelectedendDates] = useState(new Date());
  const [revision, setRevision] = useState(0);
  const revisionChange = useCallback((newValue) => setRevision(newValue), []);
  const [revise,setRevise] = useState(true);
  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );
  
  const createRevision = useCallback(
    () => {
    let rev =revision;
    setRevision(rev + 1 );
    setRevise(false);
    },
    [],
  );
 
  const handleDateChange = useCallback(
    (newValue) => {
    setSelectedDates(newValue.start);
    setSelectedendDates(newValue.end);
    },
    [],
  );
 
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const activator = (
  <Card title="Active dates" sectioned>
    <p>Start Date - End Date</p>
    <Button onClick={togglePopoverActive} disabled={revise}>{moment(selectedDates).format('MM/DD/YYYY') } - {moment(selectedendDates).format('MM/DD/YYYY') }</Button>
      </Card>
   
  );
    const [programname, setProgramname] = useState('');
    const programnameChange = useCallback((newValue) => setProgramname(newValue), []);
    const [programdesc, setProgramdesc] = useState('');
    const programdescChange = useCallback((newValue) => setProgramdesc(newValue), []);
     const [numretries, setNumretries] = useState('');
    const numretriesChange = useCallback((newValue) => setNumretries(newValue), []);
     const [retryperiods, setRetryperiods] = useState('Daily');
    const retryperiodsChange = useCallback((newValue) => setRetryperiods(newValue), []);
    const [cycle, setCycle] = useState('Monthly');
    const cycleChange = useCallback((newValue) => setcycle(newValue), []);
    const [product, setProduct] = useState('');
    const [producttitle, setProducttitle] = useState('');
    const options = [
    {label: 'Daily', value: 'Daily'},
    {label: 'Every 15 Days', value: '15'},
    {label: 'Every Week', value: 'Weekly'},
    {label: 'Monthly', value: 'Monthly'},
  ];
  const [active, setActive] = useState(false);

  const handleResourcePickerClose = useCallback(() => setActive(false), []);

  const handleSelection = useCallback(
    ({selection}) => {
      
      const idsFromResources = selection.map((product) => product.id);
      const titleFromResources = selection.map((product) => product.title);
      console.log('Selected products: ', idsFromResources);
      setProduct(idsFromResources[0]);
      setProducttitle(titleFromResources[0]);
      handleResourcePickerClose();
    },
    [handleResourcePickerClose],
  );
  
  const [numcancels, setNumcancels] = useState('');
    const numcancelsChange = useCallback((newValue) => setNumcancels(newValue), []);
    const [message, setMessage] = useState(['']);
     const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    [],
  );

          const fileUpload = !files.length && <DropZone.FileUpload />;
          const uploadedFiles = files.length > 0 && (
            <Stack vertical>
              {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                  <Thumbnail
                    size="small"
                    alt={file.name}
                    source={window.URL.createObjectURL(file)}
                  />
                  <div>
                    {file.name} <Caption>{file.size} bytes</Caption>
                  </div>
                </Stack>
              ))}
            </Stack>
          );
        
          const errorMessage = hasError && (
            <Banner
              title="The following images couldn�t be uploaded:"
              status="critical"
            >
              <List type="bullet">
                {rejectedFiles.map((file, index) => (
                  <List.Item key={index}>
                    {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
                  </List.Item>
                ))}
              </List>
            </Banner>
          );

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
    {revise ? '':
    <ContextualSaveBar
                  message={message}
                  saveAction={{
                    onAction: async () => {
                            const request = {};
                            request.PROGRAM_NAME = programname;
                            request.PROGRAM_DESCRIPTION = programdesc;
                            request.BOM_ITEM_NO = product;
                            request.NO_OF_CANCEL_RET = numcancels;
                            request.PROGRAM_START_DATE = selectedDates;
                            
                            request.PROGRAM_END_DATE = selectedendDates;
                            request.NO_OF_RETRY =numretries;
                            request.RETRY_PERIOD = retryperiods;
                            request.REPEAT_OPTION = cycle;
                            request.CUST_ACCOUNT_ID =1;
                            request.BOM_ITEM_DESC = producttitle;
                            request.REVISION_NUMBER = revision;
                    const resp =  await fetch(
                                    			'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/manage/subscription/'+ id,
                                            {
                                              method: 'POST',
                                              body : JSON.stringify(request),
                                    	  headers: {
                                                'Content-Type' : 'application/json'
                                              },
                                            },
                                    
                                          );
                    const Subid = await resp.json();
                    if(Subid.subscription_items)
                    {
                        setMessage("Subscription Saved!");
                        setRevise(true);
                    }
                    else
                      setMessage("Error");
                            
                            
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
      <Page breadcrumbs={[{content: 'Subscriptions', url: '/manage_subscriptions'}]}
      title={programname}
      
      subtitle={programdesc}
	     
          thumbnail={   <Thumbnail source={"https://objectstorage.us-phoenix-1.oraclecloud.com/n/axzxx9cwmhzp/b/subscribenowdev/o/"+id}/>}
       primaryAction={<Button onClick={() => {
    
    setRevision((parseInt(revision) + 1)+'' );
    setRevise(false);
    }}>Create Revision</Button>}
      
	     separator
	    >
         {loading?
      <Spinner accessibilityLabel="Spinner example" size="large" color="teal" />
      :
         <FormLayout>
         
         
         
         <Card title="Program Details" sectioned>
           <TextField  value={programname} onChange={programnameChange} helpText="Enter a unique Name for the Subscription program."  disabled={revise}/>
          
          <TextField  value={programdesc} onChange={programdescChange} helpText="Enter a detailed description for the Subscription program." disabled={revise}   />
          <TextField value={revision}  type="number" onChange={revisionChange} helpText="Revision" disabled={revise} />
        </Card>
        <Card title="Upload Subscription Image">
          <Stack vertical>
              {errorMessage}
              <DropZone accept="image/*" type="image" onDrop={handleDrop} style={{width: 114, height: 114}} >
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </Stack>
         </Card>
          <Card title="Program  Options" >
           <Card.Section title="Cycle">
          <Select  value={cycle} options={options} onChange={setCycle} helpText="Select Program Cycle Options"  disabled={revise} />
            </Card.Section>
            <Card.Section title="APPLIES TO">
             
               <ResourcePicker
                  resourceType="Product"
                  open={active}
                  onSelection={handleSelection}
                  onCancel={handleResourcePickerClose}
                />
                
                <TextField
                 value={producttitle}
                onChange={setProduct}
                helpText="Select product" 
                connectedRight={
                  <Button onClick={() => setActive(true)}>browse</Button>
                 }
                disabled={revise}
              />
            </Card.Section>
          </Card>
          
          <Popover
        active={popoverActive}
        activator={activator}
        onClose={togglePopoverActive}
      >
         <DatePicker
      month={month}
      year={year}
      onChange={handleDateChange}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      allowRange={true} 
    />
      </Popover>
       <Card title="Limits" sectioned>
          <TextField  value={numcancels} type="number" onChange={numcancelsChange} helpText="Enter number of Cancel/Returns Allowed for life of subscription"  disabled={revise} />
          
          
      </Card>
      
      <Card title="Retries" sectioned>
          <TextField  value={numretries} type="number" onChange={numretriesChange} helpText="Enter number of Retries Allowed for Payment capture" disabled={revise}/>
          
          <Select  value={retryperiods} options={options} onChange={retryperiodsChange} helpText="Select retry interval options"  disabled={revise}/>
      </Card>
         
        </FormLayout>
        }
        
      </Page>
      </Frame>
        </AppProvider>
    );
  

 
}

export default subscription;
