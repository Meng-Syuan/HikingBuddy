import styled from 'styled-components';
import color from '@utils/theme';
import { TextField } from '@mui/material';
import { usePostState } from '@utils/zustand';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

//components
import TripSelection from './PostTool/TripSelection';
import Marker from './PostTool/Marker';
import ReleaseBtn from './PostTool/ReleaseBtn';
import ScratchBtn from './PostTool/ScratchBtn';

const PostContainer = styled.div`
  background-color: ${color.lightBackgroundColor};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 40px;
`;

const PostWrapper = styled.article`
  width: 100%;
  /* border: 2px solid #000; */
  min-height: 55vh; //?????
`;

const PreviewPhotos = styled.div`
  display: flex;
  width: 100%;
  border: 2px solid #000;
  margin: 4px 0;
`;

const ToolBar = styled.div`
  display: flex;
  padding: 10px 20px;
  width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 4px;
  min-height: 60px;
  /* position:;//props? */
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

const UploadFile = styled.div``;

const Post = () => {
  //先取得 temporaryPost 的資訊
  const { title, content, photosUrls, mainPhoto, setPostState } =
    usePostState();

  useEffect(() => {
    if (!content) return;
    console.log(content);
  }, [content]);

  const handleContentChange = (e) => {
    setPostState('content', e.target.value);
  };

  const handlePhotoUpload = async (e) => {};
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
        <PreviewPhotos>
          {photosUrls && photosUrls.map((photo) => <></>)}
        </PreviewPhotos>
        <ToolBar>
          <ToolWrapper>
            <UploadFile as="label" htmlFor="uploadImage">
              <FontAwesomeIcon
                icon={faImage}
                style={{ color: '#6f6f6f' }}
                size="2x"
              />
            </UploadFile>
            <input
              type="file"
              id="uploadImage"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <TripSelection />
            <Marker />
          </ToolWrapper>
          <ButtonWrapper>
            <ScratchBtn />
            <ReleaseBtn />
          </ButtonWrapper>
        </ToolBar>
      </PostWrapper>
    </PostContainer>
  );
};

export default Post;
