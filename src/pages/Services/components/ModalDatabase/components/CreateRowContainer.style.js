
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid #EDEDED;
  border-radius: 6px;
  padding: 10px;
  margin: 10px 0px 20px 0px;
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
  
  align-items: justify-content: flex-start;center;
`;

const ContainerCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LineContainerRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const InputCount = styled.input`
  border-radius: 4px;
  width: 100%;
  background: #EDEDED;
  transition: background-color 0.3s ease;
  text-align: center;

  &:focus {
    background: #CCCCCC;
  }

  /* Убираем стрелочки у Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Убираем стрелочки у Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

export {
  Container,
  InfoLine,
  LineContainerLeft,
  ContainerCenter,
  LineContainerRight,
  InputCount
}