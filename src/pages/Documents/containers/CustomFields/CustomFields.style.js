
import styled from 'styled-components';

const InputFields = styled.input`
  width: 100%;
  padding: 3px;
  border-radius: 4px;
  background: ${props => props.isFieldEmpty ? '#FFD7C2' : '#EDEDED'};
  transition: background-color 0.3s ease;

  &:focus {
    background: #C9C9C9;
    background: ${props => props.isFieldEmpty ? '#EDA58E' : '#C9C9C9'};
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

const SelectFields = styled.select`
  width: 100%;
  padding: 3px 3px 3px 0px;
  border-radius: 4px;
  background: ${props => props.isFieldEmpty ? '#FFD7C2' : '#EDEDED'};
  border: none;
  transition: background-color 0.3s ease;

  &:focus {
    background: #C9C9C9;
    background: ${props => props.isFieldEmpty ? '#EDA58E' : '#C9C9C9'};
  }
`;

export {
  InputFields,
  SelectFields
};