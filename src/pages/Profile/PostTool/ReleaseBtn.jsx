import styled from 'styled-components';
import {
  usePostWritingState,
  useUserState,
  usePostMapState,
} from '@utils/zustand';
import usePostsDB from '@utils/hooks/usePostsDB';
import useUsersDB from '@utils/hooks/useUsersDB';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { Tooltip } from 'react-tippy';
import { Toast } from '@utils/sweetAlert';

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
    setPostState,
  } = usePostWritingState();
  const { deleteTrip, userPostsIds, postsData, setUserState } = useUserState();
  const { postMarkers, setPostMarkers } = usePostMapState();
  const { publishPost } = usePostsDB();
  const { addUserInfo, deleteTargetData } = useUsersDB();

  const handlePublication = async () => {
    const result = checkReqirement();
    if (!result) return;
    const reorderedPhotos = reorderPhotos();
    const parsedContent = structureContent(reorderedPhotos);
    const createTime = new Date().getTime();
    await publishPost(postId, title, parsedContent, mainPhoto, markers);
    const newPost = {
      id: postId,
      title,
      content: parsedContent,
      mainPhoto,
      createTime,
    };
    const newPostsData = [newPost, ...postsData];
    setUserState('postsData', newPostsData);
    const newPostsIds = [...userPostsIds, postId];
    setUserState('userPostsIds', newPostsIds);
    const newMarkers = updateHomepageMarkers(createTime);
    setPostMarkers('postMarkers', [...postMarkers, ...newMarkers]);
    await addUserInfo('posts', postId);
    await deleteTargetData('schedulesIDs', postId);
    deleteTrip('pastSchedules', postId);
    setPostState('postId', '');
    setPostState('tripName', '');
    setPostState('title', '');
    setPostState('content', '');
    setPostState('mainPhoto', '');
    setPostState('markers', '');
    setPostState('allUploadPhotos', '');
    await Toast.fire({
      icon: 'success',
      title: '發送成功',
      text: '可至山閱足跡查看文章',
      position: 'center',
    });
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
  const updateHomepageMarkers = (createTime) => {
    const result = markers.map((marker) => {
      return {
        id: postId,
        title,
        createTime,
        coordinates: marker,
      };
    });
    return result;
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
