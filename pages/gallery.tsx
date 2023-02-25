import Link from "next/link";
import styled from "styled-components";
import dynamic from "next/dynamic";

const Deck = dynamic(() => import("../components/Deck"), { ssr: false });

export default function Gallery() {
  return (
    <Container>
      <Deck />
      <LinkContainer href="/">&#127968;</LinkContainer>
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

  background: #ffffbf;
  cursor: url("https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png")
      39 39,
    auto;
`;

const LinkContainer = styled(Link)`
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  font-size: 30px;
  margin: 1rem;
  /* pointer-events: none; */
`;
