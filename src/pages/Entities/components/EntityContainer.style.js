
import styled from 'styled-components';

const Container = styled.div`
  padding: 17px;
  border-radius: 11px;
  border: 1px solid #ABABAB;
`;

const ContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TitleContainerLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TitleContainerRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const InputSearch = styled.input`
  width: 188px;
  padding: 6px;
  border-radius: 4px;
  background: #D9D9D9;
  transition: background-color 0.3s ease;

  &:focus {
    background: #B1B1B1;
  }
`;

const ContextMenu = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ContextMenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const DropdownButton = styled.div`
  background-color: #bebebe;
  border-radius: 4px;
  color: white;
  padding: 1px 8px;
  border: none;
  cursor: pointer;
  position: relative;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #888888;
  }
`;

// Стилизация контейнера для выпадающего меню
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: -182px;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 9999;
  width: max-content;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

// Стилизация элементов меню
const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;


export {
  Container,
  ContainerHeader,
  TitleContainerLeft,
  TitleContainerRight,
  InputSearch,
  ContextMenu,
  ContextMenuItem,
  DropdownButton,
  DropdownMenu,
  DropdownItem
};