

import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 850px;
  width: 100%;
`;



const InfoLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LineContainerLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const LineContainerRight = styled.div`
  flex: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const InputSave = styled.input`
  width: 292px;
  padding: 6px;
  border-radius: 4px;
  background: #D9D9D9;
  transition: background-color 0.3s ease;

  &:focus {
    background: #B1B1B1;
  }
`;

export {
  ModalOverlay,
  ModalContent,
  LineContainerLeft,
  LineContainerRight,
  InfoLine,
  InputSave
}