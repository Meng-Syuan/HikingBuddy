import styled from 'styled-components';
import color from '@utils/theme';
import { TextField } from '@mui/material';
import { usePostState } from '@utils/zustand';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import useUploadFile from '@utils/hooks/useUploadFile';
import { useBlocker } from 'react-router-dom';
import sweetAlert from '@utils/sweetAlert';
//components
import TripSelection from './PostTool/TripSelection';
import Marker from './PostTool/Marker';
import ReleaseBtn from './PostTool/ReleaseBtn';
import TempSave from './PostTool/TempSave';

//#region

const PostContainer = styled.div`
  background-color: ${color.lightBackgroundColor};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 40px;
  .tooltip {
    background-color: #fff;
  }
`;

const PostWrapper = styled.article`
  width: 100%;
  min-height: 55vh;
`;

const ToolBar = styled.div`
  display: flex;
  padding: 10px 20px;
  width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 4px;
`;

const ToolWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 2 1 70%;
  gap: 10px;
`;

const ButtonWrapper = styled(ToolWrapper)`
  flex: 1 1 30%;
  justify-content: end;
`;

const UploadFile = styled.div`
  &:hover {
    cursor: ${(props) =>
      props.islimit === 'true' ? 'not-allowed' : 'pointer'};
  }
  .uploadImg {
    color: #6f6f6f;
    &:hover {
      color: ${(props) => (props.islimit === 'true' ? '' : '#0161bb')};
    }
  }
`;
const PreviewPhotos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 2px 10px;
  gap: 5px;
  min-width: 100%;
  margin: 4px 0;
`;

const PhotoWrapper = styled.div`
  position: relative;
`;

const Photo = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  border: 1px solid #bfbfbf;
`;

const FavoriteWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 3px;
  color: ${(props) =>
    props.id === props.favoritephoto ? color.secondary : color.borderColor};
  &:hover {
    color: ${color.secondary};
  }
`;

const DeletionWrapper = styled.div`
  position: absolute;
  right: 1.25rem;
  top: 5px;
  .deletion {
    color: #bfbfbf;
    &:hover {
      color: red;
    }
  }
`;

const Span = styled.span`
  position: absolute;
  right: 0;
  bottom: 5px;
  color: #fff;
  font-size: 0.625rem;
`;

//#endregion

const uploadLimit = 6;
const Post = () => {
  const { title, content, allUploadPhotos, mainPhoto, setPostState } =
    usePostState();
  const { getUploadFileUrl, compressImage } = useUploadFile();
  const [lastUploadedImg, setLastUploadedImg] = useState();

  useEffect(() => {
    if (!title && !content) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      return (event.returnValue = '確定要離開嗎？您可能會遺失未儲存的變更。');
    };
    addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [title, content]);

  useEffect(() => {
    if (!lastUploadedImg) return;
    const urls = [...allUploadPhotos, lastUploadedImg];
    setPostState('allUploadPhotos', urls);
  }, [lastUploadedImg]);

  const handleContentChange = (e) => {
    setPostState('content', e.target.value);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const compressedImg = await compressImage(file);
    const url = await getUploadFileUrl(`post_photos`, compressedImg, file.name);
    setLastUploadedImg({ id: `[${file.name}-${allUploadPhotos.length}]`, url });
    setPostState(
      'content',
      content + `[${file.name}-${allUploadPhotos.length}]`
    );
  };

  const handleDeletePhoto = (e) => {
    const id = e.currentTarget.id;
    console.log(id);
    const updateImgUrls = allUploadPhotos.filter((img) => img.id !== id);
    setPostState('allUploadPhotos', updateImgUrls);
    const updatedContent = content.replace(id, '');
    setPostState('content', updatedContent);
  };

  const handleMainPhoto = (e) => {
    const id = e.currentTarget.id;
    const mainPhotoUrl = allUploadPhotos.find((img) => img.url === id);
    setPostState('mainPhoto', mainPhotoUrl.url);
  };
  // Block navigating elsewhere when post has been filled
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (title || content) && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleFilledPostNavigate = async () => {
      if (blocker.state === 'blocked') {
        const { value: confirm } = await sweetAlert.confirm(
          '提醒',
          '現在離開可能導致文章遺失。',
          'warning',
          '離開',
          '停留'
        );
        confirm ? blocker.proceed() : blocker.reset();
      }
    };
    handleFilledPostNavigate();
  }, [title, content, blocker]);

  return (
    <PostContainer>
      <PostWrapper>
        <TextField
          id="outlined-basic"
          label="標題"
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setPostState('title', e.target.value)}
          inputProps={{ maxLength: 30 }}
        />
        <TextField
          id="outlined-basic"
          label="內文"
          variant="outlined"
          fullWidth
          margin="dense"
          multiline
          minRows={13}
          value={content}
          onChange={handleContentChange}
        />
        {allUploadPhotos && (
          <Tooltip
            open={allUploadPhotos.length > 0 && allUploadPhotos.length < 5}
            title="選擇最喜歡的照片"
            arrow={true}
            position="left-end"
            size="small"
            theme="transparent"
            duration={3000}
          >
            <PreviewPhotos>
              {allUploadPhotos.map((photo) => (
                <PhotoWrapper key={photo.id}>
                  <DeletionWrapper id={photo.id} onClick={handleDeletePhoto}>
                    <FontAwesomeIcon icon={faXmark} className="deletion" />
                  </DeletionWrapper>
                  <Photo src={photo.url}></Photo>
                  <FavoriteWrapper
                    id={photo.url}
                    onClick={handleMainPhoto}
                    favoritephoto={mainPhoto}
                  >
                    <FontAwesomeIcon icon={faStar} className="like" size="xl" />
                  </FavoriteWrapper>
                  <Span>{photo.id}</Span>
                </PhotoWrapper>
              ))}
            </PreviewPhotos>
          </Tooltip>
        )}

        <ToolBar>
          <ToolWrapper>
            <Tooltip
              open={allUploadPhotos.length >= uploadLimit}
              title={`最多上傳 ${uploadLimit} 張照片`}
              position="bottom"
              size="small"
              theme="transparent"
            >
              <UploadFile
                as="label"
                htmlFor="uploadImage"
                islimit={(allUploadPhotos.length >= uploadLimit).toString()}
              >
                <FontAwesomeIcon
                  icon={faImage}
                  size="2x"
                  className="uploadImg"
                  islimit={(allUploadPhotos.length >= uploadLimit).toString()}
                />
              </UploadFile>
            </Tooltip>
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              disabled={allUploadPhotos.length >= uploadLimit}
            />
            <TripSelection />
            <Marker />
          </ToolWrapper>
          <ButtonWrapper>
            <TempSave />
            <ReleaseBtn />
          </ButtonWrapper>
        </ToolBar>
      </PostWrapper>
    </PostContainer>
  );
};

export default Post;
