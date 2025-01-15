
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  padding: 3px 10px 3px 10px;
  background-color: ${props => (props.isSelected ? '#f0f8ff' : '#fff')};
`;

const Text = styled.div`
  flex: 1;
  font-size: 14px;
`;

const InputCount = styled.input`
  width: 90%;
  border-radius: 4px;
  background: ${props => (props.isEdited ? '#77CBDE' : '#EDEDED')};
  transition: background-color 0.3s ease;
  text-align: center;

  &:focus {
    background: ${props => (props.isEdited ? '#67B3C5' : '#CCCCCC')}
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
  Row,
  Text,
  InputCount
};