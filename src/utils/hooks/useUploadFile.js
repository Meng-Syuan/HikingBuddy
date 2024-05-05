import { storage } from '@utils/firebase/firebaseConfig';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const useUploadFile = () => {
  const getUploadFileUrl = async (type, file, id) => {
    try {
      const ref = storageRef(storage, `${type}/${id}`);
      const snapshot = await uploadBytes(ref, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.log('Failed to upload file');
      console.log(error);
    }
  };

  const compressImage = async (file) => {
    console.log('Original file size:', file.size / 1024 / 1024, 'MB');
    const getMaxSizeMB = (originalSize) => {
      // return unit:KB
      if (originalSize <= 1200) return 0.9;
      if (originalSize <= 2000) return 1.5;
      return 2;
    };

    const options = {
      maxWidthOrHeight: 670, //might be change
      maxSizeMB: getMaxSizeMB(file.size),
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        'Compressed file size:',
        compressedFile.size / 1024 / 1024,
        'MB'
      );
      return compressedFile;
    } catch (error) {
      console.log('Failed to compress image.');
      console.log(error);
    }
  };
  return {
    getUploadFileUrl,
    compressImage,
  };
};

export default useUploadFile;
