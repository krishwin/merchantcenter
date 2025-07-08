import React, { useContext,useCallback,useState } from 'react';
import {
    Button,
    Card,   
    Select,
    ChoiceList,
    TextField,
    DatePicker,
    Popover,
  } from '@shopify/polaris';
  import moment from 'moment';
const BundleConfig = ({ formData, setForm,navigation }) => {

    const { previous,next, go } = navigation;
    const {NO_OF_CANCEL_RET,PROGRAM_START_DATE,PROGRAM_END_DATE,NO_OF_RETRY,RETRY_PERIOD } = formData
    const [{month, year}, setDate] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      });
      const [selectedDates, setSelectedDates] = useState({start: new Date(PROGRAM_START_DATE),end: new Date(PROGRAM_END_DATE)});
    
      const handleMonthChange = useCallback(
        (month, year) => setDate({month, year}),
        [],
      );
     
      const handleDateChange = useCallback(
        (newValue) => {
        setSelectedDates(newValue);
        setForm(new Date(newValue.start),'PROGRAM_START_DATE');
        setForm(new Date(newValue.end),'PROGRAM_END_DATE');
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
        <Button onClick={togglePopoverActive} >{moment(selectedDates.start).format('MM/DD/YYYY')} - {moment(selectedDates.end).format('MM/DD/YYYY') }</Button>
          </Card>
       
      );

      const [numretries, setNumretries] = useState('');
    const numretriesChange = useCallback((newValue) => setNumretries(newValue), []);
     const [retryperiods, setRetryperiods] = useState(RETRY_PERIOD);
     const retryperiodsChange = useCallback((newValue) => {
         setRetryperiods(newValue);
         setForm(newValue,'RETRY_PERIOD');
     }, []);
     const  options= [
        {label: 'Daily', value: 'Daily'},
        {label: 'Every 15 Days', value: '15'},
        {label: 'Every Week', value: 'Weekly'},
        {label: 'Monthly', value: 'Monthly'},
      ];
      const [numcancels, setNumcancels] = useState('');
    const numcancelsChange = useCallback((newValue) => setNumcancels(newValue), []);
    return(
        <div>
                        <Popover
                    active={popoverActive}
                    activator={activator}
                    onClose={togglePopoverActive}
                    preferredPosition="below"
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
                
        <br/>
    <div style={{float:"left"}}>
          <Button primary size="large" onClick={previous} >Back</Button>
        </div>
        <div style={{float:"right"}}>
          <Button primary size="large" onClick={next} >Next</Button>
        </div>
   </div>);
};

export default BundleConfig;