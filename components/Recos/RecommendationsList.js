import React, {useCallback, useState,useEffect} from 'react';
import { Button, Card, DataTable, 
  ResourceItem, ResourceList, EmptyState, Icon,DisplayText,Stack,Thumbnail} from '@shopify/polaris';
  import {CirclePlusMinor} from '@shopify/polaris-icons';
import PricingTable from './PricingTable';
  
const RecommendationsList = ({data,loading,recommendations,removerecommendations}) => {

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
            <Card sectioned primaryFooterAction={{content: 'Delete', destructive: true,onAction:() => removerecommendations(id)}}>
              <Card.Header title = "This combo contains the below items"></Card.Header>
            <Stack vertical={true}>
            {item.products.map((product,i) => (
              
              <div>
                 <Card.Section title={product.name}>
                <Stack vertical={false} distribution="equalSpacing">
            <Thumbnail source={product.image}  name={product.name} size="large"/>
            <br/>
            <DisplayText size="small">{'$' +product.price}</DisplayText>
            </Stack>
            </Card.Section>
            {i < item.products.length-1 ?
            <Icon source={CirclePlusMinor} />
            :''}
            </div>
            )
           
            )}
             </Stack>
             <Card.Section>
               <PricingTable item={item} bundle={data.bundles[0]}/>
            </Card.Section>
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