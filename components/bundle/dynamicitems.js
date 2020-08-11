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
import ProductPicker from './productPicker';
import CollectionPicker from './CollectionPicker';
 const Dynamicitem = ({formData, setForm,id}) =>
  {
      let pitems = [];
      const {PRODUCTS} = formData;
    
    const [type, setType] = useState(PRODUCTS && PRODUCTS[id] ? PRODUCTS[id].TYPE:'');
    const typeChange = useCallback((newValue) => {
      setType(newValue[0]);
           }, []
        );
  
       return(
          <Card.Section title="APPLIES TO">

          <ChoiceList  selected={type}  choices={[
                  {label: 'Specific products', value: 'Product'},
                  {label: 'Specific collections', value: 'Collection'},
                  
                  ]} onChange={typeChange} helpText="Select product  or collection" />
             
             {type == "Product"? <ProductPicker formData={formData} setForm={setForm} id={id} type={type}/>:
              <CollectionPicker formData={formData} setForm={setForm} id={id} type={type}/>}
             
             
           
            </Card.Section>
            );
  }
       
      

export default Dynamicitem;