import { useState } from 'react';
import { Input, Image, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const CloudinaryUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const toast = useToast();

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'eventease_unsigned'); // your preset
    data.append('folder', 'eventease'); // optional

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
        data
      );
      const imageUrl = res.data.secure_url;
      toast({ title: 'Upload Successful', status: 'success' });

      // send imageUrl back to parent (optional)
      if (onUpload) onUpload(imageUrl);
    } catch (err) {
      toast({ title: 'Upload Failed', status: 'error' });
    }
  };

  return (
    <>
      <Input type="file" onChange={handleChange} />
      {preview && <Image src={preview} boxSize="200px" mt={2} />}
      <Button mt={3} colorScheme="blue" onClick={handleUpload}>
        Upload Image
      </Button>
    </>
  );
};

export default CloudinaryUpload;
