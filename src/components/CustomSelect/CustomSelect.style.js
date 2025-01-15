
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
  width: 200px;
`;

const SelectedOption = styled.div`
  padding: 6px;

  border-radius: 4px;
  cursor: pointer;
  background: #D9D9D9;
  transition: background-color 0.3s ease;

  &:hover {
    background: #B1B1B1;
  }

  &::before {
    content: '';
    position: absolute;
    right: 10px;
    top: 60%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-top-color: #767676;
  }
`;

const OptionsList = styled.ul`
  position: absolute;
  width: calc(100% - 2px);
  border: 1px solid #ccc;
  border-top: none;
  background: white;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
  padding: 0;
  margin: 0;
  list-style: none;
  border-radius: 5px;
`;

const OptionItem = styled.li`
  padding: 5px;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
`;

export {
  SelectWrapper,
  SelectedOption,
  OptionsList,
  OptionItem
};