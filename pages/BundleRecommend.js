import React, {useCallback, useState,useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {PlusMinor} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import {Thumbnail, Button, Card, Filters, 
  ResourceItem, ResourceList, TextField, TextStyle,Spinner,Stack,Badge,Frame,FormLayout} from '@shopify/polaris';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID,API_HOST} from '../common/constants';
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
    const [payload,setPayload] = useState({});
    const changeData = useCallback(
        (value) => setData(value),
        [],
    );

    const addrecommendations = async (selectedProducts) => {
      const reco = {id:id,recommendation: {id:Date.now(),products:selectedProducts}};
      
      let request = reco;
   
      const response = await fetch(
        API_HOST+'/recommendations',
        {
          method: 'POST',
          body:  JSON.stringify(request),
        headers: {
            'Content-Type' : 'application/json',
            'token'     : AUTHTOKEN,
            'store'     : SHOPORIGIN.split('.')[0]
          },
        },

        );
        let respstatus = await response.json();
        if(respstatus.store)
        {
          setRecommendations(respstatus.bundles.find((bundle) => bundle.id ===id).recommendations );
          return 'Success'; 
        }else
        return 'Error';
             
    }

    const removerecommendations = async (rec_id) => {
      const reco = {bundle_id:id,rec_id: rec_id};
      
      let request = reco;
   
      const response = await fetch(
        API_HOST+'/recommendations',
        {
          method: 'DELETE',
          body:  JSON.stringify(request),
        headers: {
            'Content-Type' : 'application/json',
            'token'     : AUTHTOKEN,
            'store'     : SHOPORIGIN.split('.')[0],
            'Cache-Control': 'no-cache'
          },
        },

        );
        let respstatus = await response.json();
        if(respstatus.store)
        {
          setRecommendations( respstatus.bundles.find((bundle) => bundle.id ===id).recommendations );
          return 'Success';
        }
        else
        return 'Error';
             
    }
    
          useEffect(() => {
            const fetchData = async () => {
        const result = await fetch(
          API_HOST+'/'+ id+'/'+rev,
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
          setPayload(subresp);
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
         <FormLayout>{  loading ? <Spinner accessibilityLabel="Spinner example" size="large" color="teal" /> :
             addReco ? <AddRecommendation data={data} setAddReco={setAddReco} addrecommendations={addrecommendations}></AddRecommendation>  :
             data && data.bundles ? <RecommendationsList data={data} loading={loading} recommendations={recommendations ?recommendations :[] } removerecommendations={removerecommendations}/> : ''
         }
         <br/>
         
           </FormLayout>
        
      </Page>
          </Frame>
          </ApolloProvider>
          );

}
export default BundleRecommend;