import React, {useCallback, useState,useEffect} from 'react';
import {
    Button,
    Card,   
    Select,
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
    return(
        <div>
            {  data.products ?
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
      <Button primary onClick={() => {
          addrecommendations(selectedProducts);
          setAddReco(false);
            }}>Save</Button>
      </div>
      </div>
        </div>
         
       
    
    );
}
export default AddRecommendation;