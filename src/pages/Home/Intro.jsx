import styled from 'styled-components';
import schedulePlanner from '../../assets/svg/mapPlanning.svg';

const IntroWrapper = styled.section`
  display: flex;
  position: relative;
  height: 80vh;
  top: 0;
`;

const Planner_text = styled.div`
  height: 100%;
  width: calc(50vw + 150px);
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0) 15%,
    rgba(94, 162, 0, 1) 60%,
    rgba(65, 112, 0, 1) 100%
  );
`;

const Planner_draw = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  background-color: #fff;
  width: calc(50vw - 150px);
  &:after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 0 0 80vh 300px;
    border-color: transparent transparent transparent #fff;
  }
`;

const Img = styled.img`
  width: 80%;
  height: 80%;
`;

const Intro = () => {
  return (
    <>
      <IntroWrapper>
        <Planner_draw>
          <Img src={schedulePlanner}></Img>
        </Planner_draw>
        <Planner_text></Planner_text>
      </IntroWrapper>
    </>
  );
};

export default Intro;
