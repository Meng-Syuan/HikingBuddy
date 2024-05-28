import styled from 'styled-components';
import { screen } from '@/theme';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import lightFormat from 'date-fns/lightFormat';
import { SignedIn } from '@clerk/clerk-react';

//utils
import getDocById from '@/firestore/getDocById';
import { showErrorToast } from '@/utils/sweetAlert';
import { usePostReadingState } from '@/zustand';
import useNavigateToHomeWithAlert from '@/hooks/useNavigateToHomeWithAlert';

const PostContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1100px;
  min-height: calc(100vh - 80px);
  background-color: #fafafa;
  position: relative;
  padding: 20px 150px 80px;
  ${screen.xl} {
    width: 100vw;
    padding: 20px 0 80px;
  }
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
  ${screen.xl} {
    margin-right: 5rem;
  }
  ${screen.md} {
    margin-right: 2rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextContent = styled.p`
  margin: 0.5rem 0;
  width: 100%;
  text-indent: 2rem;
  letter-spacing: 2px;
  word-break: break-all;
  white-space: pre-wrap;
  ${screen.xl} {
    width: 70vw;
    min-width: 600px;
  }
  ${screen.md} {
    width: 80vw;
    min-width: 0;
  }
`;

const PhotoWrapper = styled.figure`
  margin: 0.5rem 0;
`;

const Photo = styled.img`
  max-width: 100%;
  height: auto;
`;

const Post = () => {
  const { postId } = useParams();
  const { setPostReadingState, id, title, content, createTime } =
    usePostReadingState();

  useNavigateToHomeWithAlert();

  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const data = await getDocById('posts', postId);
        if (!data) return;
        const createTime = data.createAt
          ? lightFormat(data.createAt, 'yyyy-MM-dd')
          : '';
        const content = data.parsedContent;
        const title = data.title;
        const id = data.id;
        setPostReadingState('createTime', createTime);
        setPostReadingState('content', content);
        setPostReadingState('title', title);
        setPostReadingState('id', id);
      } catch (error) {
        await showErrorToast('發生錯誤', error.message);
      }
    })();
  }, [postId]);

  return (
    <SignedIn>
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
    </SignedIn>
  );
};

export default Post;
