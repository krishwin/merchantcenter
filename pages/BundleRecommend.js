import React, {useCallback, useState,useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {PlusMinor} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import {Thumbnail, Button, Card, Filters, 
  ResourceItem, ResourceList, TextField, TextStyle,Spinner,Stack,Badge,Frame,FormLayout,Pagination} from '@shopify/polaris';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID,API_HOST,ASSETS_HOST} from '../common/constants';
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
        'X-Shopify-Storefront-Access-Token': sessionStorage.getItem('shopconfig')
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
    const [isFirstPage,setisFirstPage] = useState(false);
  const [isLastPage,setisLastPage] = useState(false);
  const [pagenum,setPagenum] = useState(1);
  const [displedItems,setDisplayedItems] = useState([]);



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
            'store'     : SHOPORIGIN.split('.')[0]
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
            API_HOST+'/recommendations',
          {
            method: 'GET',
          headers: {
              'Content-Type' : 'application/json',
              'token'     : AUTHTOKEN,
              'store'     : SHOPORIGIN.split('.')[0],
            },
          },
  
          );
          let subresp = await result.json();   
          setPayload(subresp);
          let bundle =  subresp.bundles.find((bundle) => bundle.id ===id);    
          if(bundle && bundle.recommendations)
          setRecommendations(bundle.recommendations);

         /* bundle.recommendations ? setDisplayedItems(bundle.recommendations.slice(0,2)):setDisplayedItems([]);
          if(bundle.recommendations)
          {
            setisFirstPage(true);
            if(bundle.recommendations.length > 2)
            setisLastPage(false);
            else
            setisLastPage(true);
          }*/
          

          setLoading(false);
          }
      
          fetchData();
          fetchreco();
        

        
        },[]);

        useEffect(() => {
          setDisplayedItems(recommendations.slice(0,2));
          setisFirstPage(true);
          setPagenum(1);
            if(recommendations.length > 2)
            setisLastPage(false);
            else
            setisLastPage(true);
        },[recommendations]);

        function handlePreviousPage() {
    
          console.log(pagenum);
          let startIndex;
          if(pagenum -1  == '1' )
          startIndex=  0;
          else
          startIndex = (pagenum -1 )*2;
          setDisplayedItems(recommendations.slice(startIndex,startIndex+2));
          if(startIndex== 0)
          {
            setisFirstPage(true);
          }
          setisLastPage(false);
      
          setPagenum(pagenum-1);
        }
      
        function handleNextPage() {
          
          let startIndex = pagenum*2;
          setDisplayedItems(recommendations.slice(startIndex,startIndex+2));
          if(!recommendations[startIndex+2])
          {
            setisLastPage(true);
          }
          setisFirstPage(false);
          setPagenum(pagenum+1);
      
        }
      
      
        const  pagination = recommendations.length > 0 ?
           (
            <div style={{display:"flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              borderTop: "1px solid #dfe4e8"}}>
            <Pagination
          
            hasPrevious={!isFirstPage}
            hasNext={!isLastPage}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
          />
                  </div>
      ):'';

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
             data && data.bundles ? <RecommendationsList data={data} loading={loading} recommendations={recommendations ?displedItems :[] } removerecommendations={removerecommendations}/> : ''
         }
         <br/>
         {pagination}
           </FormLayout>
        
      </Page>
          </Frame>
          </ApolloProvider>
          );

}
export default BundleRecommend;