
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const ContainerLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ContainerRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ContainerCenter = styled.div`
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


export {
  Container,
  ContainerHeader,
  ContainerLeft,
  ContainerRight,
  ContainerCenter,
  InputSearch 
};