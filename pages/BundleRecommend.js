import React, {useCallback, useState,useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {PlusMinor} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import {Thumbnail, Button, Card, Filters, 
  ResourceItem, ResourceList, TextField, TextStyle,Spinner,Stack,Badge,Frame,FormLayout} from '@shopify/polaris';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID} from '../common/constants';
import {RecommendationsList} from '../components/Recos';
import {AddRecommendation} from '../components/Recos';
require('isomorphic-fetch');
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';


const client = new ApolloClient({
  uri: 'https://' + SHOPORIGIN+'/api/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        'X-Shopify-Storefront-Access-Token':'6b21d0466c4f2a73d7d21bf5557c755f'
      },
    });
  },
});

const BundleRecommend = () => {
    const router = useRouter();
    const { id,rev } = router.query;
    const [data,setData] = useState();
    const [recommendations,setRecommendations] = useState([]);
    const [addReco,setAddReco] = useState(false);
    const [loading, setLoading] = useState(true);
    const changeData = useCallback(
        (value) => setData(value),
        [],
    );

    const addrecommendations = (selectedProducts) => {
      const reco = {id:Date.now,products:selectedProducts}
      setRecommendations( recommendations.concat(reco) );
      console.log(recommendations);
    }
    
          useEffect(() => {
            const fetchData = async () => {
        const result = await fetch(
        'https://exntjiylhp46knqgk7nchwtyve.apigateway.us-phoenix-1.oci.customer-oci.com/bundles_dev/'+ id+'/'+rev,
        {
          method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'token'     : AUTHTOKEN
          },
        },

        );
        let subresp = await result.json();
         setData(subresp);
        }
        
        const fetchreco = async () => {
          const result = await fetch(
          'https://objectstorage.us-phoenix-1.oraclecloud.com/n/axzxx9cwmhzp/b/'+SHOPORIGIN.split('.')[0]+'/o/recommendations.json',
          {
            method: 'GET',
          headers: {
              'Content-Type' : 'application/json',
              'token'     : AUTHTOKEN
            },
          },
  
          );
          let subresp = await result.json();   

          let bundle =  subresp.bundles.find((bundle) => bundle.id ===id);    
          if(bundle && bundle.recommendations)
          setRecommendations(bundle.recommendations);
          

          setLoading(false);
          }
      
         fetchData();
         fetchreco();
        

        
        },[]);

        return (
          <ApolloProvider client={client}> 
            <Frame>
                <Page breadcrumbs={[{content: 'Manage Bundles', url: '/manage_bundles'}]}
       title={data && data.bundles[0].PROGRAM_NAME ? 'Recommended products combo for '+ data.bundles[0].PROGRAM_NAME :''}
      
       primaryAction={<Button onClick={() => {setAddReco(true);}}>Add Recommendations</Button> }
       
         separator
	    >
         <FormLayout>{ loading ? <Spinner accessibilityLabel="Spinner example" size="large" color="teal" /> :
             addReco ? <AddRecommendation data={data} setAddReco={setAddReco} addrecommendations={addrecommendations}></AddRecommendation>  :
             <RecommendationsList data={data} loading={loading} recommendations={recommendations ?recommendations :[]}/>
         }
         <br/>
         
           </FormLayout>
        
      </Page>
          </Frame>
          </ApolloProvider>
          );

}
export default BundleRecommend;