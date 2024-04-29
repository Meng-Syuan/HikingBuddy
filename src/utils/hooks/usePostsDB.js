import db from '../firebase/firebaseConfig.js';
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

const usePostsDB = () => {
  const postsRef = collection(db, 'posts');

  const publishPost = async (postId, title, parsedContent, mainPhoto) => {
    const docRef = doc(postsRef, postId);
    try {
      await setDoc(docRef, {
        postId,
        title,
        parsedContent,
        mainPhoto,
        isTemporary: false,
        createAt: new Date().getTime(),
      });
      console.log('publish finish...');
    } catch (error) {
      console.log('Failed to publish post..');
      console.log(error);
    }
  };

  const storeTempPost = async () => {};

  return { publishPost, storeTempPost };
};

export default usePostsDB;
