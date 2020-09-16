import React, {useCallback, useState,useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {PlusMinor} from '@shopify/polaris-icons';
import {Thumbnail, Button, Card, Filters, 
  ResourceItem, ResourceList, TextField, TextStyle,Spinner,Stack,Badge} from '@shopify/polaris';
import {AUTHTOKEN,SHOPORIGIN ,SHOPID} from '../common/constants'
require('isomorphic-fetch');



 const manage_bundles = () => {
const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);
  const [bundles,setBundles] = useState([]);	 
  const [loading,setLoading]= useState(true);
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
			'https://exntjiylhp46knqgk7nchwtyve.apigateway.us-phoenix-1.oci.customer-oci.com/bundles_dev/all/'+SHOPORIGIN,
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
 setLoading(false);

    }
	    fetchData();
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

    return (
<Page
  fullWidth
  title="Manage Bundles"
  primaryAction={<Button primary url="/new_bundle">Create Bundles</Button>}
  secondaryActions={[{content: 'Export'}]}
  pagination={{
    hasNext: true,
  }}
>
      
	    <Card>
      <ResourceList
        resourceName={resourceName}
        items={bundles}
        renderItem={renderItem}
        
        filterControl={filterControl}
        loading={loading}
      />
    </Card>
    
</Page>
 );

function renderItem(item) {
    const {PROGRAM_ID, URL, PROGRAM_NAME, GROUP_LIST, latestOrderUrl,PROGRAM_DESCRIPTION,REVISION_NUMBER,STATUS} = item;
    const media = <Thumbnail source={"https://objectstorage.us-phoenix-1.oraclecloud.com/n/axzxx9cwmhzp/b/subscribenowdev/o/b"+PROGRAM_ID}/>;
    const shortcutActions = [{content: 'View latest order', url: latestOrderUrl},{content: 'Recommendations', url: "/BundleRecommend?id="+PROGRAM_ID+"&rev="+REVISION_NUMBER}];
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
