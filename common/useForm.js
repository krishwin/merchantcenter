import { useState } from 'react';

import { getChildData, cloneDeepLimited } from './utils';

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  return [
    formValues,
    ( value,id,idx,checked,type) => {
      //const {
        //value, id, checked, type,
      //} = target;
      console.log(idx);
      const isCheckbox = type === 'checkbox';

      setFormValues((data) => {
        const dataClone = cloneDeepLimited(data);
        const keys = id.split('.'); // 'a.b.c' => ['a', 'b', 'c'] | 'a' => ['a']
        const nestedSegments = keys.slice(0, -1); // ['a', 'b'] | []
        const [finalSegment] = keys.slice(-1); // 'c' | 'a'
        const finalData = nestedSegments.reduce(getChildData, dataClone);
        if(idx > -1)
        finalData[finalSegment].splice(idx,1,value);
        else
        finalData[finalSegment] = isCheckbox ? checked : value;
        console.log(dataClone);
        return dataClone;
      });
    },
  ];
};

export default useForm;