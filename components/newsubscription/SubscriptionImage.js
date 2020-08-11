import React,{useCallback, useState} from 'react';
import {
    Button,
    Card,
    Stack,
    Banner, Caption, DropZone, List, Thumbnail
  } from '@shopify/polaris';
const SubscriptionImage = ({ formData, setForm,navigation,files, setFiles }) => {

 const { previous,next, go } = navigation;
 const { IMAGES } = formData;
 const [rejectedFiles, setRejectedFiles] = useState([]);
 const hasError = rejectedFiles.length > 0;
 
 const handleDrop = useCallback(
   (_droppedFiles, acceptedFiles, rejectedFiles) => {
     setFiles(acceptedFiles);
     //setForm(acceptedFiles,'IMAGES');
     setRejectedFiles(rejectedFiles);
   },
   [],
 );

         const fileUpload = !files && <DropZone.FileUpload />;
         const uploadedFiles = files && (
           <Stack vertical>
             {files.map((file, index) => (
               <Stack alignment="center" key={index}>
                 <Thumbnail
                   size="small"
                   alt={file.name}
                   source={window.URL.createObjectURL(file)}
                 />
                 <div>
                   {file.name} <Caption>{file.size} bytes</Caption>
                 </div>
               </Stack>
             ))}
           </Stack>
         );
       
         const errorMessage = hasError && (
           <Banner
             title="The following images couldn't be uploaded:"
             status="critical"
           >
             <List type="bullet">
               {rejectedFiles.map((file, index) => (
                 <List.Item key={index}>
                   {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
                 </List.Item>
               ))}
             </List>
           </Banner>
         );

         return(
            <div>
                <Card title="Upload Subscription Image">
          <Stack vertical>
              {errorMessage}
              <DropZone accept="image/*" allowMultiple={false} type="image" onDrop={handleDrop} style={{width: 114, height: 114}} >
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </Stack>
         </Card>
            <br/>
        <div style={{float:"left"}}>
              <Button primary size="large" onClick={previous} >Back</Button>
            </div>
            <div style={{float:"right"}}>
              <Button primary size="large" onClick={next} >Next</Button>
            </div>
       </div>);
 
 
};

export default SubscriptionImage;