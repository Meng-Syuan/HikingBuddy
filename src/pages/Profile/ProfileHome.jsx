import styled from 'styled-components';
import color from '@utils/theme';
//components
import PersonalInfo from './PersonalInfo';

const StyledArticle = styled.article`
  background-color: ${color.lightBackgroundColor};
  position: relative;
  left: 40px;
`;

const ProfileHome = () => {
  return (
    <>
      <StyledArticle>發文功能</StyledArticle>
      <PersonalInfo />
    </>
  );
};

export default ProfileHome;
