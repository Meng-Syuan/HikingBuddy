import styled, { keyframes } from 'styled-components';
import color, { screen } from '@/theme';
import { SignInButton, useAuth, useSignIn } from '@clerk/clerk-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { useRef, useState, useEffect } from 'react';
import { Toast } from '@/utils/sweetAlert';

//components
import schedulePlanner from '/src/assets/svg/mapPlanning.svg';
import hiking from '/src/assets/svg/hiking.svg';
import protector from '/src/assets/svg/protector.svg';
import world from '/src/assets/svg/homepageWorld.svg';
import upToTopIcon from '/src/assets/svg/arrow.svg';

//utils
import { useUserState } from '@/zustand';
//#region

const IntroContainer = styled.div`
  background-color: rgba(150, 150, 150, 0.4);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10vh;
`;

const IntroWrapper = styled.section`
  display: flex;
  justify-content: center;
  gap: 10vw;
  align-items: center;
  height: 55vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.8);
  ${screen.md} {
    flex-direction: column-reverse;
    padding: 2rem 3rem;
  }
`;

const IntroWrapper_protector = styled(IntroWrapper)``;

const IntroWrapper_posts = styled(IntroWrapper_protector)`
  align-self: flex-end;
`;

const CardWrapper = styled.section`
  height: 70vh;
  width: 75vw;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(#cbdddfea, #8ebcc2);
  border-radius: 15px;
  margin-bottom: 15vh;
  padding: 0 5vw;
  ${screen.md} {
    flex-direction: column;
    justify-content: center;
    gap: 30%;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 45%;
  ${screen.md} {
    height: 40%;
    align-self: flex-start;
  }
`;

const TextWrapper_protector = styled(TextWrapper)`
  align-items: flex-end;
  height: 30%;
  ${screen.md} {
    align-items: flex-start;
  }
`;

const Title = styled.h3`
  font-size: 1.8rem;
  color: #000;
  letter-spacing: 4px;
  font-weight: 600;
`;

const ImgWrapper = styled.div`
  width: 20vw;
  ${screen.md} {
    width: 180px;
    align-self: flex-end;
  }
`;

const PlannerImg = styled.img`
  width: 100%;
  ${screen.md} {
    width: 180px;
  }
`;

const ProtectorImg = styled(PlannerImg)`
  ${screen.md} {
    width: 210px;
  }
`;

const HikingImg = styled(ProtectorImg)``;

const WorldImg = styled.img`
  width: 50%;
  ${screen.md} {
    width: 250px;
  }
`;

const PlannerContext = styled.p`
  font-size: 1.3rem;
  letter-spacing: 8px;
  color: #000;
`;

const ProtectorContext = styled(PlannerContext)`
  align-items: flex-end;
  ${screen.md} {
    align-items: flex-start;
  }
`;
const PostsContext = styled(PlannerContext)``;

const CardContext = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledContainedButton = styled(Button)`
  background: #3f3d56;
  &:hover {
    background: #58576d;
  }
  &:active {
    color: #ccc;
  }
`;
const SignInText = styled.p`
  font-size: 1rem;
  color: #ccc;
`;

const StyledOutLinedButton = styled(Button)`
  border: #3f3d56 2px solid;
  color: #3f3d56;
  &:hover {
    border: #58576d 2px solid;
    background-color: #58576d60;
  }
  &:active {
    color: #58576d50;
    color: #ddd;
  }
`;

const LinkText = styled(SignInText)`
  color: #3f3d56;
`;

const FooterContext = styled.p`
  color: ${color.textColor};
  font-size: 1.5rem;
  align-self: end;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const IconWrapper = styled.a`
  position: fixed;
  bottom: 20px;
  right: 2rem;
  z-index: 3;
  width: 35px;
  height: 35px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
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
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const { isTestingAccount } = useUserState();

  const plannerSection = useRef(null);
  const planningImg = useRef(null);
  const plannerText = useRef(null);

  const protectorSection = useRef(null);
  const postsSection = useRef(null);

  const cardSection = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(planningImg.current, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: plannerSection.current,
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    gsap.from(plannerText.current, {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: plannerSection.current,
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    gsap.from(protectorSection.current, {
      x: -200,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: protectorSection.current,
        start: 'top 100%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    gsap.from(postsSection.current, {
      x: 200,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: postsSection.current,
        start: 'top 100%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    gsap.from(cardSection.current, {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardSection.current,
        start: 'top 90%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });
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

  const signInAsGuest = async () => {
    const identifier = 'testor+clerk_test@example.com';
    const password = 'testaccountpassword';
    try {
      await signIn.create({
        identifier,
        password,
      });
      window.location.reload();
    } catch (error) {
      await Toast.fire({
        icon: 'error',
        title: '登入失敗',
        text: '可嘗試重整或洽專案管理員',
        position: 'center',
      });
    }
  };

  return (
    <IntroContainer>
      <IntroWrapper ref={plannerSection} id="first-intro">
        <ImgWrapper>
          <PlannerImg src={schedulePlanner} ref={planningImg} />
        </ImgWrapper>
        <TextWrapper ref={plannerText}>
          <Title>規劃助手</Title>
          <PlannerContext>陪伴你展開旅程</PlannerContext>
          <PlannerContext>完整詳細的行前規劃</PlannerContext>
        </TextWrapper>
        <IconWrapper $isVisible={showBtn} href="#header">
          <Icon src={upToTopIcon}></Icon>
        </IconWrapper>
      </IntroWrapper>
      <IntroWrapper_protector ref={protectorSection}>
        <TextWrapper_protector>
          <Title>親愛的留守人</Title>
          <ProtectorContext>相伴身後，靜守你的安全</ProtectorContext>
        </TextWrapper_protector>
        <ImgWrapper>
          <ProtectorImg src={protector}></ProtectorImg>
        </ImgWrapper>
      </IntroWrapper_protector>

      <IntroWrapper_posts ref={postsSection}>
        <ImgWrapper>
          <HikingImg src={hiking}></HikingImg>
        </ImgWrapper>
        <TextWrapper>
          <Title>山閱足跡</Title>
          <PostsContext>保存每一段回憶</PostsContext>
          <PostsContext>記錄每一次感動</PostsContext>
        </TextWrapper>
      </IntroWrapper_posts>

      <CardWrapper ref={cardSection}>
        <CardContext>
          {!isSignedIn && !isTestingAccount && (
            <>
              <FooterContext>開啟你的第一段旅程吧。</FooterContext>
              <StyledContainedButton variant="contained">
                <SignInButton>
                  <SignInText>立即註冊 / 登入</SignInText>
                </SignInButton>
              </StyledContainedButton>
              {!isTestingAccount && (
                <StyledOutLinedButton
                  variant="outlined"
                  onClick={signInAsGuest}
                >
                  <LinkText>訪客模式登入</LinkText>
                </StyledOutLinedButton>
              )}
            </>
          )}
          {(isSignedIn || isTestingAccount) && (
            <StyledOutLinedButton
              variant="outlined"
              endIcon={<AdsClickIcon />}
              color="primary"
            >
              <LinkText as={Link} to="/path-planner">
                即刻開啟你的旅程
              </LinkText>
            </StyledOutLinedButton>
          )}
        </CardContext>
        <WorldImg src={world}></WorldImg>
      </CardWrapper>
    </IntroContainer>
  );
};

export default Intro;
