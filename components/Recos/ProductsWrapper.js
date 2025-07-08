import React, {useCallback, useState} from 'react';
import {Scrollable, Button, TextContainer, Modal,Card,ResourceList,ResourceItem,Avatar,TextStyle} from '@shopify/polaris';

const Productwrapper = ({items,setActive,setProducttitle,addSelectedProducts,collection}) =>
{
    const [selectedItems, setSelectedItems] = useState([]);
    const selectionchange = useCallback((newValue) => {
              setSelectedItems(newValue);
              const item = items.find((item) => item.node.id === newValue[0]);
              console.log(item);
              setProducttitle(item.node.title);
              setActive(false);
              addSelectedProducts({product_level:collection.PROGRAM_LEVEL,name:item.node.title,id:item.node.id,image:item.node.images.edges[0].node.src,price:item.node.variants.edges[0].node.price});
            },[items]);
    const renderItem = (item) =>{
        const {id, images, title} = item.node;
            const media = <Avatar  size="medium" name={title} source = {images.edges[0].node.src}/>;
            
            return (
              <ResourceItem
                id={id}
                media={media}
                accessibilityLabel={`View details for ${title}`}
                name={title}
              >
                <h3>
                  <TextStyle variation="strong">{title}</TextStyle>
                </h3>
              </ResourceItem>
            );
    }
return(
    <Card>
          <ResourceList
          resourceName={{singular: 'product', plural: 'products'}}
          items={items}
          renderItem={renderItem}
          hasMoreItems={true} 
          selectedItems={selectedItems}
          onSelectionChange={selectionchange}
          selectable
        />
        </Card>);
}

export default Productwrapper;