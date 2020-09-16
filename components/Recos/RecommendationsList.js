import React, {useCallback, useState,useEffect} from 'react';
import { Button, Card, Filters, 
  ResourceItem, ResourceList, EmptyState, Icon,DisplayText,Stack,Thumbnail} from '@shopify/polaris';
  import {CirclePlusMinor} from '@shopify/polaris-icons';

  
const RecommendationsList = ({data,loading,recommendations}) => {

  const emptyStateMarkup =
    (
      <EmptyState
        heading="No  Recommendations found click on Add Recommendations to get started"
     
      >
        
      </EmptyState>
    );

  
    return(
    <div>
    <Card>
    <ResourceList
    showHeader
                  emptyState={emptyStateMarkup}
      resourceName={{singular: 'combo', plural: 'combos'}}
      items={recommendations}
      renderItem={(item) => {
        const {id} = item;
               return (
          <ResourceItem
            id={id}
            //media={media}
            accessibilityLabel={`View details for ${name}`}
          >
            <Card sectioned primaryFooterAction={{content: 'Delete', destructive: true}}>
            <Stack vertical={true}>
            {item.products.map((product,i) => (
              
              <div>
                 <Card.Section>
                <Stack vertical={false}>
            <Thumbnail source={product.image}  name={product.name} size="large"/>
            <br/>
            <DisplayText size="Medium">{product.name}</DisplayText>
            </Stack>
            </Card.Section>
            {i < item.products.length-1 ?
            <Icon source={CirclePlusMinor} />
            :''}
            </div>
            
            )
           
            )}
             </Stack>
             </Card>
          </ResourceItem>
        );
      }}
      loading ={loading}
    />
  </Card>
  </div>
  );
    
}
export default RecommendationsList;