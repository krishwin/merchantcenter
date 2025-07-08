import React, {useCallback, useState,useEffect} from 'react';
import {  DataTable} from '@shopify/polaris';

const PricingTable =({item,bundle}) =>{

    const totalprice = item? item.products.reduce((a,b)=>a+parseInt(b.price),0):0;
    const discount  = bundle? bundle.PROGRAM_PRICING_TYPE === 'DISCOUNT_FLAT' ? (parseInt(totalprice)-parseInt(bundle.PROGRAM_PRICING_RATE)) : (parseInt(totalprice)/100)*parseInt(bundle.PROGRAM_PRICING_RATE):0;

    const rows = 
        [
        ['Total Price', '$'+totalprice],
          ['Discount', '$'+ discount],
        [ 'Net',     '$'+ (totalprice-discount)],
      ];
  

    return(
        <DataTable
        columnContentTypes={[
          'text',
          'numeric',
        ]}
        headings={[
          ' ',
          ' ',
          
        ]}
        rows={rows}
      />

        );

}


export default PricingTable;