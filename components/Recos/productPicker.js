import React, {useCallback, useState} from 'react';
import {
    Button,
    TextField,
   
} from '@shopify/polaris';
import ProductModal from './ProductModal';

const ProductPicker = ({collection,addSelectedProducts}) =>{
    
    const [multiple, setMultiple] = useState(false);
    const [active, setActive] = useState(false);
    const handleResourcePickerClose = useCallback(() => setActive(false), []);
    const [product,setProduct] = useState();
    const [producttitle,setProducttitle] = useState();
    const handleChange = useCallback(() => setActive(!active), [active]);
    const handletitleChange = useCallback((newValue) => {
      setActive(true);
    }, []);
  
    const activator = <Button onClick={handleChange}>browse</Button>;
    

  
return(
            <div>
            
            
              <ProductModal
                activator={activator}
                open={active}
                setActive={setActive}
                collection={collection}
                setProducttitle ={setProducttitle}
                addSelectedProducts={addSelectedProducts}
                />
            <TextField
                value={producttitle}
            onChange={handletitleChange}
            helpText={"Select product"}
            connectedRight={
              activator
                }
            />
           </div>
          
    );
}
 export default ProductPicker;