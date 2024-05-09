import styled from 'styled-components';
import { usePostState } from '@utils/zustand';
import usePostsDB from '@utils/hooks/usePostsDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { Toast } from '@utils/sweetAlert';

const IconWrapper = styled(IconButton)`
  &:hover {
    color: #0161bb;
    cursor: pointer;
  }
  .icon {
  }
`;

const TempSave = () => {
  const {
    postId,
    tripName,
    title,
    content,
    allUploadPhotos,
    mainPhoto,
    setPostState,
  } = usePostState();
  const { saveTempPost } = usePostsDB();

  const handleTempPost = async () => {
    console.log(postId);
    console.log('postId');
    if (!postId) {
      Toast.fire({
        icon: 'error',
        text: '請選取左下角路線名稱',
        position: 'center',
        timerProgressBar: false,
      });
    } else {
      await saveTempPost(
        postId,
        tripName,
        title,
        content,
        allUploadPhotos,
        mainPhoto
      );
      setPostState('postId', '');
      setPostState('tripName', '');
      setPostState('title', '');
      setPostState('content', '');
      setPostState('allUploadPhotos', '');
      Toast.fire({
        icon: 'success',
        title: '暫存成功 🤗',
        position: 'center',
        timer: 1500,
      });
    }
  };

  return (
    <Tooltip title="暫存" position="top" size="small" theme="transparent">
      <IconWrapper onClick={handleTempPost}>
        <FontAwesomeIcon icon={faBookmark} size="lg" className="icon" />
      </IconWrapper>
    </Tooltip>
  );
};

export default TempSave;
