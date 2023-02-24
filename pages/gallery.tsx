import { animated, to as interpolate, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useState } from "react";
import styled from "styled-components";
import bearUrl from "../resources/a.png";

const cards = [
  "https://res.cloudinary.com/dxuntw2ej/image/upload/v1677244604/backs/KakaoTalk_Photo_2023-02-24-21-18-22_002_a8orwv.jpg",
  "https://res.cloudinary.com/dxuntw2ej/image/upload/v1677244604/backs/KakaoTalk_Photo_2023-02-24-21-18-22_003_rprmzi.jpg",
  "https://res.cloudinary.com/dxuntw2ej/image/upload/v1677244602/backs/KakaoTalk_Photo_2023-02-24-21-18-25_005_jdgbbt.jpg",
  "https://res.cloudinary.com/dxuntw2ej/image/upload/v1677244597/backs/KakaoTalk_Photo_2023-02-24-21-18-21_001_xt0h28.jpg",
  "https://res.cloudinary.com/dxuntw2ej/image/upload/v1677244605/backs/KakaoTalk_Photo_2023-02-24-21-18-24_004_etjta3.jpg",
];

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.2; // If you flick hard enough it should trigger the card to fly out

      if (!active && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = active ? 1.1 : 1; // Active cards lift up a bit

        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });

      if (!active && gone.size === cards.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
    }
  );

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <StyledDeck as={animated.div} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`,
            }}
          />
        </StyledDeck>
      ))}
    </>
  );
}

export default function Gallery() {
  return (
    <Container>
      <Deck />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;

  background: lightblue;
  cursor: url("https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png")
      39 39,
    auto;
`;

const StyledDeck = styled.div`
  position: absolute;
  width: 300px;
  height: 200px;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    touch-action: none;
    background-color: white;
    background-size: auto 85%;
    background-repeat: no-repeat;
    background-position: center center;
    width: 45vh;
    max-width: 300px;
    height: 85vh;
    max-height: 570px;
    will-change: transform;
    border-radius: 10px;
    box-shadow: 0 12.5px 100px -10px rgba(50, 50, 73, 0.4),
      0 10px 10px -10px rgba(50, 50, 73, 0.3);
  }
`;
