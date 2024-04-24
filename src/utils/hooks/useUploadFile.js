import { nanoid } from 'nanoid';
import { storage } from '@utils/firebase/firebaseConfig';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';

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

  return {
    getUploadFileUrl,
  };
};

export default useUploadFile;
