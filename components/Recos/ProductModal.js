import React, {useCallback, useState} from 'react';
import {Scrollable, Button, TextContainer, Modal,Card,ResourceList,ResourceItem,Avatar,TextStyle} from '@shopify/polaris';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Loading} from '@shopify/app-bridge-react';
import ProductWrapper from './ProductsWrapper';
let query = gql`
query query ($col: String!,$cursor: String){
  shop {
    name
    description
      collections(query: $col,first:10){
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
          products(first:10,after: $cursor) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                id
                title
                availableForSale
                onlineStoreUrl
                options {
                  id
                  name
                  values
                }
                variants(first: 250) {
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                  }
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        src
                      }
                      price
                    }
                  }
                }
                images(first: 250) {
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                  }
                  edges {
                    node {
                      src
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const ProductModal = ({open,setActive,collection,setProducttitle,addSelectedProducts}) =>
{
    const handleChange = useCallback(() => setActive(!open), [open]);
    const { loading:shopLoading, error:shopError, data:shopData ,refetch,fetchMore} = useQuery(query,{variables:{col : `title:'${collection.PRODUCT_DESC}'`} } );
    
    const handleScrollBottom = () => {
    if(shopData.shop.collections.edges[0].node.products.pageInfo.hasNextPage)
     fetchMore({
      variables: {
        cursor:
        shopData.shop.collections.edges[0].node.products.edges[shopData.shop.collections.edges[0].node.products.edges.length - 1]
            .cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        fetchMoreResult.shop.collections.edges[0].node.products.edges =  [
          ...previousResult.shop.collections.edges[0].node.products.edges,
          ...fetchMoreResult.shop.collections.edges[0].node.products.edges
        ];
          
        return fetchMoreResult;
      }
    });
    
    }
        if (shopLoading) {
            return (<Loading />);
            
        }

        if (shopError) {
            return <p>Error ...</p>;
        }
    return(      <Modal title="Product Picker"  open={open} onClose={handleChange}
    onScrolledToBottom={handleScrollBottom}
    >
     
      <Modal.Section>
       <ProductWrapper items={shopData.shop.collections.edges[0].node.products.edges} setActive={setActive} setProducttitle={setProducttitle} addSelectedProducts={addSelectedProducts} collection={collection}/>
        </Modal.Section>
        

      </Modal>
    );

}

export default ProductModal;