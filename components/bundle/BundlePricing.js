import React, { useContext,useCallback,useState ,useEffect} from 'react';
import {
    Button,
    Card,   
    Select,
    ChoiceList,
    TextField
  } from '@shopify/polaris';
const BundlePricing = ({ formData, setForm,navigation ,setMessage}) => {

    const { previous,next, go } = navigation;
    const {   PROGRAM_PRICING_TYPE ,  PROGRAM_PRICING_RATE  }= formData;
    const [pricing, setPricing] =useState(PROGRAM_PRICING_RATE);
    const pricingChange = useCallback((newValue) => {
        setPricing(newValue);
        setForm(newValue,'PROGRAM_PRICING_RATE');
    }, []);
    const [type,setType] = useState(PROGRAM_PRICING_TYPE);
    const typeChange =  useCallback((newValue) => {
        setType(newValue[0]);
        setForm(newValue[0],'PROGRAM_PRICING_TYPE');
     }, []
        );

        useEffect(() => setMessage(""),[]);

    const renderChildren = useCallback(
        (isConfig) =>
        isConfig &&  (
            
          
            <TextField
              label ="pricing"
              labelHidden
              type = "number"
              onChange={pricingChange}
              value={pricing}
              helpText={type == "FLAT_PRICING" ? "Flat Amount" : "Discounted Rate"}
            />
           
          ),
        [pricingChange, pricing,type],
      );
    const  options= [
        {label: 'No Change', value: 'NO'},
        {label: '% Discount', value: 'DISCOUNT_PRECENT',renderChildren},
        {label: 'Amount Discount', value: 'DISCOUNT_FLAT',renderChildren},
        {label: 'Flat Amount', value: 'FLAT_PRICING',renderChildren},
        
      ];
      
 return(
        <div>
            <Card title="Pricing  Options" >
            <Card.Section>
            <ChoiceList  selected={type}  choices={options} onChange={typeChange} helpText="Select Pricing  Configuration" />
            </Card.Section>

           
            </Card>
        <br/>
    <div style={{float:"left"}}>
          <Button primary size="large" onClick={previous} >Back</Button>
        </div>
        <div style={{float:"right"}}>
          <Button primary size="large" onClick={() => PROGRAM_PRICING_TYPE && PROGRAM_PRICING_RATE ? next() : setMessage("Pricing details required")} >Next</Button>
        </div>
   </div>);
 
};

export default BundlePricing;