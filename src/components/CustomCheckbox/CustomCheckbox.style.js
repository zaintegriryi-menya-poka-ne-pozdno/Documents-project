
import styled from 'styled-components';

const CheckboxContainer = styled.div`
  width: 17px;
  height: 17px;
  min-width: 17px;
  min-height: 17px;
  border: 1px solid #ABABAB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const InnerBox = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 3px;
  background-color: #ABABAB;
`;

export { CheckboxContainer, InnerBox };