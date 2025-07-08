import React, {useCallback, useState,useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {PlusMinor} from '@shopify/polaris-icons';
import {Thumbnail, Button, Card, Filters, 
  ResourceItem, ResourceList, TextField, TextStyle,Spinner,Stack,Badge,Pagination} from '@shopify/polaris';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID,API_HOST,ASSETS_HOST} from '../common/constants';
require('isomorphic-fetch');
import moment from 'moment';


 const manage_bundles = () => {
const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);
  const [bundles,setBundles] = useState([]);	 
  const [loading,setLoading]= useState(true);
  const [pagenum,setPagenum] = useState(1);
  const [displedItems,setDisplayedItems] = useState([]);
  const [isFirstPage,setisFirstPage] = useState(false);
  const [isLastPage,setisLastPage] = useState(false);
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = {
    singular: 'bundle',
    plural: 'bundles',
  };
    useEffect(() => {
    	const fetchData = async () => {
      const result = await fetch(
        API_HOST+'/all/'+SHOPORIGIN,
        {
          method: 'GET',
	  headers: {
            'Content-Type' : 'application/json',
            'token'     : AUTHTOKEN
          },
        },

      );
		let resp = await result.json()
		console.log(resp);
    setBundles(resp.bundles);
    resp.bundles ? setDisplayedItems(resp.bundles.slice(0,5)):setDisplayedItems([]);
    if(resp.bundles)
    {
      setisFirstPage(true);
      if(resp.bundles.length > 5)
      setisLastPage(false);
      else
      setisLastPage(true);
    }
 setLoading(false);

    }
	    fetchData();
	  },[]);

    useEffect(() => {
      let config ={};
  const fetchconfig = async () =>{
    const response =
    await fetch(
      ASSETS_HOST+'/'+SHOPORIGIN.split('.')[0]+'.config.json',
      {
        method: 'GET',

      },

    );

  config = await response.json();
  sessionStorage.setItem('shopconfig', config.token);

  return config;
  }
   fetchconfig();

},[]);

  const promotedBulkActions = [
    {
      content: 'Edit Bundles',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: 'Delete Bundles',
      onAction: () => console.log('Todo: implement bulk delete'),
    },
  ];

  const filters = [
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

 

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: 'taggedWith',
          label: disambiguateLabel('taggedWith', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{paddingLeft: '8px'}}>
        <Button onClick={() => console.log('New filter saved')}>Save</Button>
      </div>
    </Filters>
  );

  function handlePreviousPage() {
    
    console.log(pagenum);
    let startIndex;
    if(pagenum  == '1' )
    startIndex=  0;
    else if (isLastPage)
    {
      startIndex = (pagenum -2 )*5;
      setPagenum(pagenum-2);
    }
  
    else 
    {
      startIndex = (pagenum -1 )*5;
    setPagenum(pagenum-1);
    }
    

    setDisplayedItems(bundles.slice(startIndex,startIndex+5));
    if(startIndex== 0)
    {
      setisFirstPage(true);
    }
    setisLastPage(false);
    

  }


  function handleNextPage() {
    
    let startIndex = pagenum*5;
    setDisplayedItems(bundles.slice(startIndex,startIndex+5));
    if(!bundles[startIndex+5])
    {
      setisLastPage(true);
    }
    setisFirstPage(false);
    setPagenum(pagenum+1);

  }


  const  pagination = bundles.length > 0 ?
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
<Page
  fullWidth
  title="Manage Bundles"
  primaryAction={<Button primary url="/new_bundle">Create Bundles</Button>}
>
      
	    <Card>
      <ResourceList
        resourceName={resourceName}
        items={displedItems}
        renderItem={renderItem}
        loading={loading}
       

      />
       {pagination}
    </Card>
    
</Page>
 );

function renderItem(item) {
    const {PROGRAM_ID, URL, PROGRAM_NAME, GROUP_LIST, latestOrderUrl,PROGRAM_DESCRIPTION,REVISION_NUMBER,STATUS,PROGRAM_START_DATE,PROGRAM_END_DATE} = item;
    const media = <Thumbnail 
    source={ASSETS_HOST+"/b"+PROGRAM_ID}/>;
    const shortcutActions = [{content: 'Recommendations', url: "/BundleRecommend?id="+PROGRAM_ID+"&rev="+REVISION_NUMBER}];
    return (
      <ResourceItem
        id={PROGRAM_ID}
        url={"/new_bundle?id="+PROGRAM_ID+"&rev="+REVISION_NUMBER}
        media={media}
        accessibilityLabel={`View details for ${PROGRAM_NAME}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <h3>
          <TextStyle variation="strong">{PROGRAM_NAME}</TextStyle>
        </h3>
        <div>{PROGRAM_DESCRIPTION}</div>
        <Stack distribution="equalSpacing">
        <div>{'Revision: '+REVISION_NUMBER}</div>
        
        <Badge>{STATUS}</Badge>
        <Badge> {moment(PROGRAM_START_DATE).isBefore() && moment(PROGRAM_END_DATE).isAfter() ? 'Active':'Inactive'}</Badge>:
        <Button outline onClick={() => window.open('https://'+SHOPORIGIN+'/admin/draft_orders?query=bundle'+PROGRAM_ID)}>View latest order</Button>
        </Stack>
        
        
      </ResourceItem>
    );
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }




  }
  
export default manage_bundles;
