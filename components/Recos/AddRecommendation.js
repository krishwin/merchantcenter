import React, {useCallback, useState,useEffect} from 'react';
import {
    Button,
    Card,   
    Toast,
    ChoiceList,
    TextField
  } from '@shopify/polaris';
import ProductPicker from './productPicker';

const AddRecommendation = ({data,setAddReco,addrecommendations}) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const addSelectedProducts = useCallback((newValue) => {
        console.log(newValue);
        let newarray =[];
        if(selectedProducts.find((product) => product.product_level === newValue.product_level))
         newarray = selectedProducts.map((product) => product.product_level === newValue.product_level ? newValue : product );
        else
         newarray = selectedProducts.concat(newValue);
        setSelectedProducts(newarray);
        console.log(selectedProducts);
    });

        const [active, setActive] = useState(false);

        const toggleActive = useCallback(() => setActive((active) => !active), []);

        const toastMarkup = active ? (
            <Toast content="Failed!!! try again" onDismiss={toggleActive} />
        ) : null;
    return(
        <div>
            {  data && data.products ?
                data.products.map(product => {
                    return <Card title={'Pick a ' + product.PRODUCT_DESC} sectioned subdued={false}>
                   <ProductPicker collection={product} addSelectedProducts={addSelectedProducts} >

                   </ProductPicker>

                  </Card>;
            })
             :''}
             
             <br/>
             <div><div style={{float:"left"}}>
         <Button primary onClick={() => {setAddReco(false);}}>Cancel</Button>
         </div>
      <div style={{float:"right"}}>
      <Button primary onClick={async () => {
          let status = await addrecommendations(selectedProducts);
          if(status != 'Success')
          toggleActive;
          else
          setAddReco(false);
            }}>Save</Button>
      </div>
      </div>
        </div>
         
       
    
    );
}
export default AddRecommendation;