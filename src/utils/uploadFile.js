import { storage } from '@/utils/firebase/firebaseConfig';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const uploadFile = () => {
  const getUploadFileUrl = async (type, file, id) => {
    try {
      const ref = storageRef(storage, `${type}/${id}`);
      const snapshot = await uploadBytes(ref, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      throw new Error('上傳失敗，稍後再試，或聯絡系統管理員。');
    }
  };

  const compressImage = async (file) => {
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
      return compressedFile;
    } catch (error) {
      throw new Error('壓縮失敗，稍後再試，或聯絡系統管理員。');
    }
  };
  return {
    getUploadFileUrl,
    compressImage,
  };
};

export default uploadFile;
