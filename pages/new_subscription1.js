import React, {useCallback, useState} from 'react';
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
  Banner, Caption, DropZone, List, Thumbnail,ChoiceList,Stepper
} from '@shopify/polaris';
import moment from 'moment';
import {Dynamicitem} from '../components/newsubscription'

 const new_subscription = () =>  {
 const [{month, year}, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState(new Date());
  const [selectedendDates, setSelectedendDates] = useState(new Date());

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
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
    <p>Start Date- End Date</p>
    <Button onClick={togglePopoverActive} >{moment(selectedDates).format('MM/DD/YYYY')} - {moment(selectedendDates).format('MM/DD/YYYY') }</Button>
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
    const  options= [
    {label: 'Daily', value: 'Daily'},
    {label: 'Every 15 Days', value: '15'},
    {label: 'Every Week', value: 'Weekly'},
    {label: 'Monthly', value: 'Monthly'},
  ];
      const [type, setType] = useState('');
      const typeChange = useCallback((newValue) => setType(newValue), []);
      const typeoptions = [
        {label: 'Digital', value: 'Digital'},
        {label: 'Shippable', value: 'Shippable'},
       
      ];
  const [config, setConfig] = useState('');
  const configChange = useCallback((newValue) => setConfig(newValue), []);
  const [packsize, setPacksize] =useState('1');
  const packsizeChange = useCallback((newValue) => setPacksize(newValue), []);
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
  const dynamicitems = (size) =>
  {
      let pitems = [];
       for (var i=0; i < size; i++)
       {
       
         pitems.push( <Dynamicitem />);
       }
       return pitems;
      };
      
  const renderChildren = useCallback(
    (isConfig) =>
      isConfig && (
        
        <Card>
        <TextField
          label ="box items"
          labelHidden
          type = "number"
          onChange={packsizeChange}
          value={packsize}
          helpText="Items per pack"
        />
       
          {dynamicitems(packsize)}
            </Card>
      ),
    [packsizeChange, packsize],
  );
   const configoptions = [
        {label: 'Box/pack', value: 'pack', renderChildren,},
        {label: 'Single Item', value: 'single'},
       
      ];
  

  
  const [numcancels, setNumcancels] = useState('');
    const numcancelsChange = useCallback((newValue) => setNumcancels(newValue), []);
    const [message, setMessage] = useState(['Unsaved Subscription']);
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
              title="The following images couldn’t be uploaded:"
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
                    if(Subid.subscription_items)
                    {
                    
                        setMessage("Subscription Saved!");
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
                <br/>
                <br/>
      <Page breadcrumbs={[{content: 'Manage Subscriptions', url: '/manage_subscriptions'}]}
	     title="Create a New Subscription"
	     separator
	    >
         <FormLayout>
         
         
         
         <Card title="Program Details" sectioned>
           <TextField  value={programname} onChange={programnameChange} helpText="Enter a unique Name for the Subscription program." />
          
          <TextField  value={programdesc} onChange={programdescChange} helpText="Enter a detailed description for the Subscription program." />
          
        </Card>
          <Card title="Program  Options" >
          <Card.Section title="Type">
          <Select  value={type} options={typeoptions} onChange={setType} helpText="Select Program Type" />
            </Card.Section>
          
           <Card.Section title="Configuration">
          <ChoiceList  selected={config} choices={[
        {label: 'Box/pack', value: 'pack', renderChildren,},
        {label: 'Single Item', value: 'single'},
       
      ]} onChange={setConfig} helpText="Select Program Configuration" />
            </Card.Section>
           <Card.Section title="Cycle">
          <Select  value={cycle} options={options} onChange={setCycle} helpText="Select Program Cycle Options" />
            </Card.Section>
          
            
          
          </Card>
          <Card title="Upload Subscription Image">
          <Stack vertical>
              {errorMessage}
              <DropZone accept="image/*" allowMultiple={false} type="image" onDrop={handleDrop} style={{width: 114, height: 114}} >
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </Stack>
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
          <TextField  value={numcancels} type="number" onChange={numcancelsChange} helpText="Enter number of Cancel/Returns Allowed for life of subscription" />
          
          
      </Card>
      
      <Card title="Retries" sectioned>
          <TextField  value={numretries} type="number" onChange={numretriesChange} helpText="Enter number of Retries Allowed for Payment capture" />
          
          <Select  value={retryperiods} options={options} onChange={retryperiodsChange} helpText="Select retry interval options" />
      </Card>
         
        </FormLayout>
        
      </Page>
      </Frame>
        </AppProvider>
    );
  

 
}

export default new_subscription;
