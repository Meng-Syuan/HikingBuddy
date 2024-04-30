import styled from 'styled-components';
import { Toast } from '@utils/sweetAlert';
import { useAuth } from '@clerk/clerk-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import usePostsDB from '@utils/hooks/usePostsDB';
import { usePostReadingState } from '@utils/zustand';
import lightFormat from 'date-fns/lightFormat';

const MainBackground = styled.div`
  width: 1050px;
  background-color: #d9d9d9;
  position: relative;
  left: 50%;
  transform: translate(-50%);
`;

const PostContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 900px;
  min-height: calc(100vh - 100px);
  background-color: #fafafa;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 115px;
`;

const H1 = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.4rem;
  margin: 1rem;
`;

const CreateTime = styled.span`
  letter-spacing: 2px;
  font-size: 0.875rem;
  align-self: end;
`;

const ContentWrapper = styled.div`
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextContent = styled.p`
  margin: 0.5rem 0;
  width: 100%;
`;

const PhotoWrapper = styled.figure`
  margin: 0.5rem 0;
`;

const Photo = styled.img``;

const Post = () => {
  const { isSignedIn } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getPostData } = usePostsDB();
  const { setPostReadingState, id, title, content, createTime } =
    usePostReadingState();

  useEffect(() => {
    if (!isSignedIn) {
      Toast.fire({
        text: '請先登入 😊',
      });
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        const data = await getPostData(postId);
        const createTimestamp = data.createAt;
        const createTime = lightFormat(createTimestamp, 'yyyy-MM-dd');
        const content = data.parsedContent;
        const title = data.title;
        const id = data.id;
        setPostReadingState('createTime', createTime);
        setPostReadingState('content', content);
        setPostReadingState('title', title);
        setPostReadingState('id', id);
      };
      fetchPostData();
    }
  }, [postId]);

  return (
    <MainBackground>
      <PostContainer>
        <H1>{title}</H1>
        <CreateTime>{`發布於${createTime}`}</CreateTime>
        <ContentWrapper>
          {content &&
            content.map((item, index) => {
              if (item.type === 'text') {
                return (
                  <TextContent key={`${id}${index}text`}>
                    {item.content}
                  </TextContent>
                );
              } else {
                return (
                  <PhotoWrapper key={`${id}${index}photo`}>
                    <Photo src={item.url} />
                  </PhotoWrapper>
                );
              }
            })}
        </ContentWrapper>
      </PostContainer>
    </MainBackground>
  );
};

export default Post;
