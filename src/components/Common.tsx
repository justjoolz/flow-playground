import styled from '@emotion/styled';
import { motion } from "framer-motion";

interface FullScreenContainerProps {
  elevation?: number;
}

export const MdeContainer = styled.div`
  h1 {
    font-size: 200%;
    line-height: 200%;
  }

  h2 {
    font-size: 160%;
    line-height: 160%;
  }

  h3 {
    font-size: 125%;
    line-height: 125%;
  }

  h4 {
    font-size: 110%;
    line-height: 110%;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  blockquote {
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    padding: .5em 10px;
    font-style: italic;
  }

  ul li {
    /* https://stackoverflow.com/questions/32039846/can-i-use-css-to-add-a-bullet-point-to-any-element */
    display: list-item;          /* This has to be "list-item"                                               */
    list-style-type: disc;       /* See https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type     */
    list-style-position: inside; /* See https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position */
  }


`;

export const FullScreenContainer = styled(motion.div)<FullScreenContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ elevation = 0 }) => elevation};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
`;

export const WhiteOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: -1;
`;

interface PopupContainerProps {
  width?: string;
}

export const PopupContainer = styled(motion.div)<PopupContainerProps>`
  display: flex;
  width: ${({ width }) => width};
  max-width: 80%;
  flex-direction: column;
  padding: 20px;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1), 0 0 3px 1px rgba(0,0,0,0.05);
  z-index: 2;
  box-sizing: border-box;
`;

interface CommonProps {
  mb?: string;
  color?: string;
  lineColor?: string;
}

export const PopupHeader = styled.h3<CommonProps>`
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ color = 'inherit' }) => color};
  margin-bottom: ${({ mb = '0' }) => mb};
  :after{
    content: "";
    display: block;
    height: 3px;
    width: 16px;
    background-color: ${({lineColor = "currentColor"}) => lineColor};
    margin-top: 4px;
  }
`;

export const SpaceBetween = styled.div<CommonProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: ${({ mb = '0' }) => mb};
`;

export const Separator = styled.div`
  width: 2px;
  height: 30px;
  background-color: #ccc;
  margin: 0 16px;
`;
