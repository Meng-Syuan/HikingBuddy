import styled from 'styled-components';
import { usePostWritingState, useUserState, usePostMapState } from '@/zustand';
import useUsersDB from '@/hooks/useUsersDB';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { Tooltip } from 'react-tippy';
import { Toast, showErrorToast } from '@/utils/sweetAlert';

const IconWrapper = styled(IconButton)`
  &:hover {
    color: #0161bb;
    cursor: pointer;
  }
`;

const ReleaseBtn = () => {
  const {
    postId,
    title,
    mainPhoto,
    markers,
    allUploadPhotos,
    content,
    resetPostWritingState,
  } = usePostWritingState();
  const { deleteTrip, userPostsIds, setUserState } = useUserState();
  const { postMarkers, setPostMarkers } = usePostMapState();
  const { addUserInfo, deleteTargetData } = useUsersDB();

  const handlePublication = async () => {
    const result = checkReqirement();
    if (!result) return;

    const reorderedPhotos = reorderPhotos();
    const parsedContent = structureContent(reorderedPhotos);
    const createTime = new Date().getTime();

    const firestoreItem = {
      postId,
      title,
      parsedContent,
      mainPhoto,
      marker: { ...markers },
      isTemp: false,
      createAt: createTime,
    };
    try {
      await setFirestoreDoc('posts', postId, firestoreItem);
      //to renew postsData and posts page map markers
      setUserState('userPostsIds', [...userPostsIds, postId]);
      const newPostMarkers = updatePostsMarkers(createTime);
      setPostMarkers('postMarkers', [...postMarkers, ...newPostMarkers]);

      await addUserInfo('posts', postId);
      await deleteTargetData('schedulesIDs', postId);
      deleteTrip('pastSchedules', postId);
      resetPostWritingState();
      await Toast.fire({
        icon: 'success',
        title: '發送成功',
        text: '可至山閱足跡查看文章',
        position: 'center',
      });
    } catch (error) {
      await showErrorToast('發生錯誤', error.message);
    }
  };

  const checkReqirement = async () => {
    if (postId && title && content) {
      return true;
    } else {
      await Toast.fire({
        icon: 'warning',
        title: '必要欄位未填寫',
        text: `請完成${postId ? '' : ' 路線選擇'}${title ? '' : ' 標題'}${
          content ? '' : ' 內文填寫'
        }`,
      });
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
  const updatePostsMarkers = (createTime) => {
    const postMarkers = markers.map((marker) => ({
      id: postId,
      title,
      createTime,
      coordinates: marker,
    }));
    return postMarkers;
  };

  return (
    <>
      <Tooltip title="發布文章" position="top" size="small" theme="transparent">
        <IconWrapper onClick={handlePublication}>
          <FontAwesomeIcon icon={faPaperPlane} size="lg" className="icon" />
        </IconWrapper>
      </Tooltip>
    </>
  );
};

export default ReleaseBtn;
