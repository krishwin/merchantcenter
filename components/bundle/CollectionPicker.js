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

const CollectionPicker = ({formData,setForm,id,type}) =>{
    const {PRODUCTS} = formData;
    const [product, setProduct] = useState(PRODUCTS && PRODUCTS[id] ? PRODUCTS[id].PRODUCT_ID : '');
    const [producttitle, setProducttitle] = useState(PRODUCTS && PRODUCTS[id] ? PRODUCTS[id].PRODUCT_DESC: '' );
    const [productalttitle, setProductalttitle] = useState(PRODUCTS && PRODUCTS[id] ? PRODUCTS[id].PRODUCT_DESC_ALT: '' );

    const [pgmlineid, setPgmlineid] = useState(PRODUCTS && PRODUCTS[id] ? PRODUCTS[id].PROGRAM_LINE_ID: '' );
    const [multiple, setMultiple] = useState(false);
    const [active, setActive] = useState(false);
    const handleResourcePickerClose = useCallback(() => setActive(false), []);
  
  const handlealttitle = useCallback((newValue) => {
    setProductalttitle(newValue);
    const products = {
      PRODUCT_ID:product,
          PRODUCT_DESC:producttitle,
          TYPE:'Collection',
          PROGRAM_LEVEL:id,
          PROGRAM_LINE_ID:pgmlineid,
          PRODUCT_DESC_ALT: newValue
      }
      setForm(products,'PRODUCTS',id);
  },[product,producttitle]);
  const handleSelection = useCallback(
    ({selection}) => {
      
      const idsFromResources = selection.map((product) => product.id);
      const titleFromResources = selection.map((product) => product.title);
      console.log('Selected products: ', idsFromResources);
      setProduct(idsFromResources[0]);
      setProducttitle(titleFromResources[0]);
      setProductalttitle('');
       const products = {
              PRODUCT_ID:idsFromResources[0],
            PRODUCT_DESC:titleFromResources[0],
            TYPE:'Collection',
            PROGRAM_LEVEL:id,
            PROGRAM_LINE_ID:pgmlineid
      }
      setForm(products,'PRODUCTS',id);
      handleResourcePickerClose();
    },
    [handleResourcePickerClose],
  );
return(
            <div>
            <ResourcePicker
            resourceType="Collection"
            open={active}
            onSelection={handleSelection}
            onCancel={handleResourcePickerClose}
            allowMultiple={multiple}
            />
                 
                
            <TextField
                value={producttitle}
            onChange={setProduct}
            helpText={"Select Collection"}
            connectedRight={
                <Button onClick={() => setActive(true)}>browse</Button>
                }
            />
            <TextField
                value={productalttitle}
            onChange={handlealttitle}
            helpText={"Enter Display Title"}
            
            />
           </div>
          
    );
}
 export default CollectionPicker;