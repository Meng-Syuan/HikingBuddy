import styled from 'styled-components';
import { usePostState, useUserState } from '@utils/zustand';
import usePostsDB from '@utils/hooks/usePostsDB';
import useUsersDB from '@utils/hooks/useUsersDB';

const Button = styled.div`
  width: 40px;
  height: 40px;
`;

const ReleaseBtn = () => {
  const {
    postId,
    tripName,
    title,
    mainPhoto,
    markers,
    allUploadPhotos,
    content,
    setPostState,
  } = usePostState();
  const { deletePastTrip } = useUserState();
  const { publishPost } = usePostsDB();
  const { addUserInfo, setMarkersDoc, deleteTargetData } = useUsersDB();

  const handlePublication = async () => {
    const result = checkReqirement();
    if (!result) return;
    const reorderedPhotos = reorderPhotos();
    const parsedContent = structureContent(reorderedPhotos);
    await publishPost(postId, title, parsedContent, mainPhoto);
    await addUserInfo('posts', postId);
    await deleteTargetData('schedulesIDs', postId);
    deletePastTrip(postId);
    if (markers.length > 0) {
      await setMarkersDoc(postId, { ...markers });
    }
    setPostState('postId', '');
    setPostState('tripName', '');
    setPostState('title', '');
    setPostState('content', '');
    setPostState('mainPhoto', '');
    setPostState('markers', '');
    setPostState('allUploadPhotos', '');
    alert('發送完成');
  };

  const checkReqirement = () => {
    if (postId && tripName && title && content) {
      alert('完成填寫');
      return true;
    } else {
      alert(
        `請完成${postId ? '' : ' 路線選擇'}${title ? '' : ' 標題'}${
          content ? '' : ' 內文填寫'
        }`
      );
      return false;
    }
  };

  const reorderPhotos = () => {
    if (allUploadPhotos.length === 0) return null;
    const idGroup = allUploadPhotos.map((photo) => photo.id);
    console.log(idGroup);
    const orderedIds = idGroup.map((id) => {
      return {
        order: content.indexOf(id),
        id,
      };
    });
    orderedIds.sort((a, b) => {
      return a.order - b.order;
    });
    const reorderedPhotos = orderedIds.map((id) => {
      return allUploadPhotos.find((photo) => {
        if (photo.id === id.id) {
          return {
            id: photo.id,
            url: photo.url,
          };
        }
      });
    });

    return reorderedPhotos;
  };

  const structureContent = (photos) => {
    if (!photos) {
      return [{ type: 'text', content }];
    } else {
      const parsedContent = [];
      let currentIndex = 0;
      photos.forEach((photo) => {
        const urlIndex = content.indexOf(photo.id);
        if (urlIndex !== -1) {
          if (urlIndex > currentIndex) {
            parsedContent.push({
              type: 'text',
              content: content.slice(currentIndex, urlIndex),
            });
          }
          parsedContent.push({ type: 'photo', url: photo.url });
          currentIndex = urlIndex + photo.id.length;
        }
      });
      if (currentIndex < content.length) {
        parsedContent.push({
          type: 'text',
          content: content.slice(currentIndex),
        });
      }
      return parsedContent;
    }
  };

  return <Button onClick={handlePublication}>發文按鈕</Button>;
};

export default ReleaseBtn;
