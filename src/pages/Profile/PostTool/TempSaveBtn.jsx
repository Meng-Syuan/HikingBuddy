import styled from 'styled-components';
import { usePostWritingState } from '@/zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { Toast, showErrorToast } from '@/utils/sweetAlert';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';

const IconWrapper = styled(IconButton)`
  &:hover {
    color: #0161bb;
    cursor: pointer;
  }
  .icon {
  }
`;

const TempSaveBtn = () => {
  const {
    postId,
    tripName,
    title,
    content,
    allUploadPhotos,
    mainPhoto,
    resetPostWritingState,
  } = usePostWritingState();

  const handleTempPost = async () => {
    if (!postId) {
      Toast.fire({
        icon: 'error',
        text: '請選取左下角路線名稱',
        position: 'center',
        timerProgressBar: false,
      });
    } else {
      try {
        const firestoreItem = {
          postId,
          tripName,
          title,
          content,
          allUploadPhotos,
          mainPhoto,
          isTemporary: true,
        };
        await setFirestoreDoc('posts', postId, firestoreItem);
        resetPostWritingState();
        Toast.fire({
          icon: 'success',
          title: '暫存成功 🤗',
          position: 'center',
          timer: 1200,
        });
      } catch (error) {
        await showErrorToast('發生錯誤', error.message);
      }
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

export default TempSaveBtn;
