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

  const getPostData = async (postId) => {
    const docRef = doc(postsRef, postId);
    try {
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return null;
      } else {
        const data = snapshot.data();
        return data;
      }
    } catch (error) {
      console.log(`Failed to get ${postId} post data: `);
      console.log(error);
    }
  };

  const getPostsList = async (postIds) => {
    const postsContent = [];
    try {
      const postPromises = postIds.map(async (postId) => {
        const postRef = doc(postsRef, postId);
        const docSnap = await getDoc(postRef);
        const data = docSnap.data();
        const title = data.title;
        const createTime = data.createAt;
        const mainPhoto = data.mainPhoto;
        const content = data.parsedContent;
        const id = data.postId;
        postsContent.push({
          id,
          title,
          createTime,
          mainPhoto,
          content,
        });
      });
      await Promise.all(postPromises);
      return postsContent;
    } catch (error) {
      console.log(`Failed to fetch all posts from ${postIds}: `);
      console.log(error);
    }
  };

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

  const saveTempPost = async (
    postId,
    tripName,
    title,
    content,
    allUploadPhotos,
    mainPhoto
  ) => {
    const docRef = doc(postsRef, postId);
    try {
      await setDoc(docRef, {
        postId,
        tripName,
        title,
        content,
        allUploadPhotos,
        mainPhoto,
        isTemporary: true,
      });
    } catch (error) {
      console.log(`Failed to save post: ${postId} temporarily.`);
      console.log(error);
    }
  };

  return { getPostData, publishPost, saveTempPost, getPostsList };
};

export default usePostsDB;
