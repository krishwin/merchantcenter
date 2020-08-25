import React, { useContext,useCallback,useState } from 'react';
import {
    Button,
    Card,   
    Select,
    ChoiceList,
    TextField
  } from '@shopify/polaris';
  import Dynamicitem from './dynamicitems'  ;
const BundleType = ({ formData, setForm,navigation }) => {
    const { previous,next, go } = navigation;
    const {   PROGRAM_TYPE,BOM_ITEM_NO,BOM_ITEM_DESC,BOM_TYPE ,REPEAT_OPTION    }= formData;
    const [packsize, setPacksize] =useState(BOM_ITEM_NO);
    
  const packsizeChange = useCallback((newValue) => {
    setPacksize(newValue);
    setForm(newValue[0],'BOM_ITEM_NO');
  }, []);
  const [config, setConfig] = useState(BOM_TYPE);
  const configChange = useCallback((newValue) => {
      setConfig(newValue[0]);
      setForm(newValue[0],'BOM_TYPE');
      
      setPacksize('1');
  }, []
      );
    const dynamicitems = (size) =>
  {
      let pitems = [];
       for (var i=0; i < size; i++)
       {
       
         pitems.push( <Dynamicitem formData={formData} setForm={setForm} id={i}/>);
       }
       return pitems;
      };
      
  const renderChildren = useCallback(
    (isConfig) =>
      isConfig &&  (
        
        <Card>
          <TextField
          label ="box items"
          disabled={config === 'single'? true:false}
          labelHidden
          type = "number"
          onChange={packsizeChange}
          value={packsize}
          helpText="Items per pack"
        />
            
          {dynamicitems(packsize)}
          
         </Card>
        
      ) ,
    [packsizeChange, packsize,config],
  );

 

   const configoptions = [
        {label: 'Box/pack', value: 'pack', renderChildren,},
        {label: 'Single Item', value: 'single',renderChildren},
       
      ];
      const typeoptions = [
        {label: 'Digital', value: 'Digital'},
        {label: 'Shippable', value: 'Shippable'},
       
      ];
      const  options= [
        {label: 'Daily', value: 'Daily'},
        {label: 'Every 15 Days', value: '15'},
        {label: 'Every Week', value: 'Weekly'},
        {label: 'Monthly', value: 'Monthly'},
      ];
 return(
    <div>
     <Card title="Program  Options" >
    
     <Card.Section title="Configuration">
            <ChoiceList  selected={config}  choices={[
        {label: 'Box/pack', value: 'pack', renderChildren,},
        {label: 'Single Item', value: 'single',renderChildren},
        
        ]} onChange={configChange} helpText="Select Program Configuration" disabled/>
      </Card.Section>
     
    
    </Card>
     
        <br/>
        <div style={{float:"left"}}>
              <Button primary size="large" onClick={previous} >Back</Button>
            </div>
            <div style={{float:"right"}}>
              <Button primary size="large" onClick={next} >Next</Button>
            </div>
    </div>

 );
 
};

export default BundleType;