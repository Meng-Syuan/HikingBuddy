import db from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';

export default async function getPostsList(postIds) {
  const postsContent = [];
  try {
    const postPromises = postIds.map(async (postId) => {
      const postRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(postRef);
      const data = docSnap.data();
      const title = data.title;
      const createTime = data.createAt;
      const mainPhoto = data.mainPhoto;
      const content = data.parsedContent;
      const id = data.postId;
      const markers = data.markers;
      postsContent.push({
        id,
        title,
        createTime,
        mainPhoto,
        content,
        markers: markers || {}, //if no marker selection when publish a post
      });
    });
    await Promise.all(postPromises);
    return postsContent;
  } catch (error) {
    throw new Error('讀取失敗，請稍後再試😵');
  }
}
