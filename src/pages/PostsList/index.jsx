import styled from 'styled-components';
import color from '@theme';
import { useAuth } from '@clerk/clerk-react';
import { useUserState } from '@utils/zustand';
import { Toast } from '@utils/sweetAlert';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import mountain from '../../assets/img/mountain.jpg';
import usePostsDB from '@utils/hooks/usePostsDB';
import lightFormat from 'date-fns/lightFormat';
import wireframe from '../../assets/img/wireframe.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Map from './PostsMap';

const PostsContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1100px;
  min-height: calc(100vh - 80px);
  background-color: #fafafa;
  padding: 3rem;
  padding-bottom: 0;
`;

const PostsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 0.5rem;
  min-height: 50vh;
  max-height: 80vh;
  overflow-y: auto;
  margin: 1.5rem 0 4rem;
  .skeletonWrapper {
    width: 620px;
  }
`;

const PostWrapper = styled.article`
  width: 620px;
  height: 168px;
  border-radius: 10px;
  display: flex;
  &:hover {
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);
  }
`;

const PhotoWrapper = styled.figure`
  width: 200px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px 0 0 10px;
  background-color: ${color.borderColor};
  background-image: ${wireframe};
`;

const Photo = styled.img`
  border-radius: 10px 0 0 10px;
  width: 100%;
  height: 100%;
  border: none;
  object-fit: cover;
`;

const TextArea = styled.div`
  width: 400px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  padding-bottom: 0.5rem;
  border-radius: 0px 10px 10px 0px;
  border: ${color.borderColor} 1px solid;
  border-left: none;
  background-color: #fff;
`;

const Title = styled.h2`
  color: #000;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.15rem;
`;

const Excerpt = styled.p`
  text-indent: 2rem;
  color: ${color.textColor};
`;

const CreateTime = styled.small`
  color: #000;
  align-self: end;
  font-style: italic;
  font-size: 0.75rem;
`;

const Story = styled.h3`
  font-weight: 700;
  font-size: 1.5rem;
  align-self: start;
  letter-spacing: 0.5rem;
  margin-bottom: 2rem;
`;

const SubStory = styled(Story)`
  align-self: end;
  margin: 2rem 4rem;
`;

const Figure = styled.figure`
  margin-top: 2rem;
  position: relative;
  width: 1050px;
`;

const Img = styled.img`
  z-index: 1;
  width: 100%;
`;

const MapContainer = styled(PostsList)`
  width: 100%;
  position: relative;
`;

const Posts = () => {
  const { isSignedIn } = useAuth();
  const { userPostsIds, postsData, setUserState } = useUserState();
  const navigate = useNavigate();
  const { getPostsList } = usePostsDB();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      Toast.fire({
        text: '請先登入 😊',
      });
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (userPostsIds.length === 0) return;
    const fetchAllPosts = async () => {
      setIsLoading(true);
      const postsData = await getPostsList(userPostsIds);
      setUserState('postsData', postsData.reverse());
      setIsLoading(false);
    };
    fetchAllPosts();
  }, [userPostsIds]);

  return (
    <PostsContainer>
      <Story>走進山裡，帶著回憶與故事回來</Story>
      {userPostsIds.length < 1 && (
        <>
          <SubStory>期待你記錄下更多美好故事</SubStory>
          <Figure>
            <Img src={mountain} />
          </Figure>
        </>
      )}
      {userPostsIds.length > 0 && (
        <>
          <PostsList>
            {isLoading ? (
              <Skeleton
                containerClassName="skeletonWrapper"
                height="168px"
                count={2}
              />
            ) : (
              postsData.map((post) => {
                const excerptObj = post.content.find(
                  (index) => index.type === 'text'
                );
                const excerpt = `${excerptObj.content.slice(0, 20)} ...`;
                const createTime = lightFormat(post.createTime, 'yyyy-MM-dd');

                return (
                  <NavLink to={`/post/${post.id}`} key={post.id}>
                    <PostWrapper>
                      <PhotoWrapper>
                        <Photo src={post.mainPhoto || wireframe} />
                      </PhotoWrapper>
                      <TextArea>
                        <Title>{post.title}</Title>
                        <Excerpt>{excerpt}</Excerpt>
                        <CreateTime>{`發布日期：${createTime}`}</CreateTime>
                      </TextArea>
                    </PostWrapper>
                  </NavLink>
                );
              })
            )}
          </PostsList>
          <Story>找尋過往足跡</Story>
          <MapContainer>
            <Map />
          </MapContainer>
        </>
      )}
    </PostsContainer>
  );
};

export default Posts;
