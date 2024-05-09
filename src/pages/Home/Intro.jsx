import styled, { keyframes } from 'styled-components';
import color from '@utils/theme';
import schedulePlanner from '../../assets/svg/mapPlanning.svg';
import checklist from '../../assets/svg/checklist.svg';
import hiking from '../../assets/svg/hiking.svg';
import protector from '../../assets/svg/protector.svg';
import photos from '../../assets/svg/photos.svg';
import posts from '../../assets/svg/postsCollection.svg';
import world from '../../assets/svg/homepageWorld.svg';
import upToTopIcon from '../../assets/svg/arrow.svg';
import Lottie from 'lottie-react';
import lottieRipple from '../../assets/ripple_lottie.json';
import { SignInButton } from '@clerk/clerk-react';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { oddAnimation, evenAnimation } from '@utils/animation';

//#region
//reusable
const IntroContainer = styled.div``;
const IntroWrapper = styled.section`
  display: flex;
  justify-content: center;
  position: relative;
  height: 80vh;
  width: 100vw;
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 50%;
  width: 50%;
  position: relative;
  left: 10%;
`;
const Title = styled.h3`
  font-size: 2.2rem;
  color: ${color.textColor};
  letter-spacing: 4px;
  font-weight: 600;
  position: absolute;
  top: 3.5rem;
  z-index: 1;
`;

//
const Planner_text = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: calc(50vw + 10vw);
  background: linear-gradient(115deg, #fff 25%, #7daf3899 60%, #417000b3 100%);
`;

const Protector_text = styled(Planner_text)`
  justify-content: start;
  background: linear-gradient(248deg, #fff 25%, #e09b5e 60%, #8b572a 100%);
`;

const Posts_text = styled(Planner_text)`
  background: linear-gradient(115deg, #fff 25%, #f5f2c4 60%, #f8e114 100%);
`;

const Planner_draw = styled.div`
  display: flex;
  height: 100%;
  background-color: #fff;
  width: calc(50vw - 10vw);

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 0 0 80vh 20vw;
    border-color: transparent transparent transparent #fff;
  }
`;

const Protector_draw = styled(Planner_draw)`
  &:after {
    border-width: 80vh 0 0 20vw;
    border-color: #fff transparent transparent transparent;
  }
`;

const Posts_draw = styled(Planner_draw)``;

const ImgWrapper = styled.div`
  height: 80vh;
  width: 100%;
  display: flex;
  position: relative;
`;

const PlannerImg = styled.img`
  width: 50%;
  height: 50%;
  position: absolute;

  &:nth-child(1) {
    left: 2rem;
    top: 2rem;
  }
  &:nth-child(2) {
    align-self: flex-end;
    width: 65%;
    right: -5rem;
    z-index: 2;
  }
`;

const ProtectorImg = styled(PlannerImg)`
  &:nth-child(1) {
    left: 0;
  }
  &:nth-child(2) {
    right: 1rem;
  }
`;

const PostsImg = styled(PlannerImg)``;

const PlannerContext = styled.p`
  font-size: 1.65rem;
  color: #000;
  &:nth-child(2) {
    position: relative;
    align-self: self-start;
  }
`;

const ProtectorContext = styled(PlannerContext)`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const PostsContext = styled(PlannerContext)`
  color: ${color.secondary};
`;

const Footer_draw = styled.div`
  background-color: #fff;
  width: 100vw;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    border-style: solid;
    border-width: 0 0 80vh 20vw;
    border-color: transparent transparent transparent ${color.borderColor};
  }
`;
const Footer_text = styled.div`
  width: 40vw;
  background-color: ${color.borderColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  position: relative;
`;

const LoddieWrapper = styled.div`
  position: absolute;
  z-index: 2;
  width: 2rem;
  height: 2rem;
  right: -1rem;
  transform: translateY(-1rem);
`;

const StyledLottie = styled(Lottie)`
  width: 100%;
  height: 100%;
`;
const FooterImage = styled.img`
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const FooterContext = styled.p`
  font-size: 1.5rem;
  align-self: end;
  &:nth-child(1) {
    &:hover {
      cursor: pointer;
      font-size: 1.6rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    &:active {
      color: ${color.secondary};
    }
  }
  &:nth-child(2) {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
`;

const IconWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 2rem;
  z-index: 3;
  width: 35px;
  height: 35px;
  opacity: ${(props) => (props['data-is-visible'] ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const bounce = keyframes`
0%, 100% {
  transform: rotate(180deg) translateY(0);
}
50% {
  transform: rotate(180deg) translateY(-10px) ;

}
`;
const Icon = styled.img`
  width: 100%;
  transform: rotate(180deg);
  cursor: pointer;
  animation: ${bounce} 1.8s infinite;
`;
//#endregion
const Intro = () => {
  const plannerSection = useRef(null);
  const protectorSection = useRef(null);
  const postsSection = useRef(null);
  const plannerTitle = useRef(null);
  const protectorTitle = useRef(null);
  const postsTitle = useRef(null);
  const img_planning = useRef(null);
  const img_checklist = useRef(null);
  const img_hiking = useRef(null);
  const img_protector = useRef(null);
  const img_photos = useRef(null);
  const img_posts = useRef(null);
  const text_first_planner = useRef(null);
  const text_first_posts = useRef(null);
  const text_second_planner = useRef(null);
  const text_second_posts = useRef(null);
  const text_protector = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    oddAnimation(
      plannerSection,
      plannerTitle,
      img_planning,
      img_checklist,
      text_first_planner,
      text_second_planner
    );
    evenAnimation(
      protectorSection,
      protectorTitle,
      img_hiking,
      img_protector,
      text_protector
    );
    oddAnimation(
      postsSection,
      postsTitle,
      img_photos,
      img_posts,
      text_first_posts,
      text_second_posts
    );
  }, []);

  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      scrollPosition > viewportHeight ? setShowBtn(true) : setShowBtn(false);
    };

    addEventListener('scroll', handleScroll);
    return () => {
      removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <IntroContainer>
      <IntroWrapper ref={plannerSection}>
        <Planner_draw>
          <ImgWrapper>
            <PlannerImg src={schedulePlanner} ref={img_planning}></PlannerImg>
            <PlannerImg src={checklist} ref={img_checklist}></PlannerImg>
          </ImgWrapper>
        </Planner_draw>
        <Title ref={plannerTitle}>規劃助手</Title>
        <Planner_text>
          <TextWrapper>
            <PlannerContext ref={text_first_planner}>
              陪伴你展開美好的旅程
            </PlannerContext>
            <PlannerContext ref={text_second_planner}>
              完成詳細的行程規劃
            </PlannerContext>
          </TextWrapper>
        </Planner_text>
        <IconWrapper data-is-visible={showBtn} onClick={scrollToTop}>
          <Icon src={upToTopIcon}></Icon>
        </IconWrapper>
      </IntroWrapper>

      <IntroWrapper ref={protectorSection}>
        <Title ref={protectorTitle}>親愛的留守人</Title>
        <Protector_text>
          <TextWrapper>
            <ProtectorContext ref={text_protector}>
              相伴身後，靜守你的安全
            </ProtectorContext>
          </TextWrapper>
        </Protector_text>
        <Protector_draw>
          <ImgWrapper>
            <ProtectorImg src={hiking} ref={img_hiking}></ProtectorImg>
            <ProtectorImg src={protector} ref={img_protector}></ProtectorImg>
          </ImgWrapper>
        </Protector_draw>
      </IntroWrapper>

      <IntroWrapper ref={postsSection}>
        <Posts_draw>
          <ImgWrapper>
            <PostsImg src={photos} ref={img_photos}></PostsImg>
            <PostsImg src={posts} ref={img_posts}></PostsImg>
          </ImgWrapper>
        </Posts_draw>
        <Title ref={postsTitle}>山閱足跡</Title>
        <Posts_text>
          <TextWrapper>
            <PostsContext ref={text_first_posts}>保存每一段回憶</PostsContext>
            <PostsContext ref={text_second_posts}>記錄每一次感動</PostsContext>
          </TextWrapper>
        </Posts_text>
      </IntroWrapper>

      <IntroWrapper>
        <Footer_text>
          <SignInButton>
            <FooterContext>立即註冊 / 登入</FooterContext>
          </SignInButton>
          <FooterContext>開啟你的第一段旅程吧。</FooterContext>
          <LoddieWrapper>
            <StyledLottie animationData={lottieRipple}></StyledLottie>
          </LoddieWrapper>
        </Footer_text>
        <Footer_draw>
          <FooterImage src={world}></FooterImage>
        </Footer_draw>
      </IntroWrapper>
    </IntroContainer>
  );
};

export default Intro;
