import { gsap } from 'gsap';

const createAnimation = (target, vars, scrollTriggerOptions) => {
  return gsap.from(target, {
    ...vars,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      ...scrollTriggerOptions,
      scrub: 1,
      end: 'bottom 50%',
    },
  });
};

export const oddAnimation = (
  sectionRef,
  titleRef,
  upperImg,
  bottomImg,
  firstText,
  secondText
) => {
  createAnimation(
    titleRef.current,
    { y: 50 },
    { trigger: sectionRef.current, start: 'top 80%' }
  );
  createAnimation(
    upperImg.current,
    { x: -50 },
    { trigger: sectionRef.current, start: 'top 80%' }
  );
  createAnimation(
    bottomImg.current,
    { y: 50 },
    { trigger: sectionRef.current, start: 'top 70%' }
  );
  createAnimation(
    firstText.current,
    { x: 50 },
    { trigger: sectionRef.current, start: 'top 80%' }
  );
  createAnimation(
    secondText.current,
    { x: 50 },
    { trigger: sectionRef.current, start: 'top 70%' }
  );
};

export const evenAnimation = (
  sectionRef,
  titleRef,
  upperImg,
  bottomImg,
  text
) => {
  createAnimation(
    titleRef.current,
    { y: 50 },
    { trigger: sectionRef.current, start: 'top 80%' }
  );
  createAnimation(
    upperImg.current,
    { y: -50 },
    { trigger: sectionRef.current, start: 'top 80%' }
  );
  createAnimation(
    bottomImg.current,
    { y: 50 },
    { trigger: sectionRef.current, start: 'top 70%' }
  );
  createAnimation(
    text.current,
    { x: 80 },
    { trigger: sectionRef.current, start: 'top 80%' }
  );
};
