
import styled from 'styled-components';

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #D9D9D9;
  border-radius: 0px 0px 6px 6px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  padding: 10px;
  background-color: #D9D9D9;
`;

const TableTitle = styled.div`
  flex: 1;
`;


const Content = styled.div`
  height: 400px;
  min-height: 400px;
  max-height: 400px;
  padding-bottom: 10px;
  padding-top: 10px;
  overflow: auto;
`;

const InputCount = styled.input`
  border-radius: 4px;
  background: #EDEDED;
  transition: background-color 0.3s ease;

  &:focus {
    background: #CCCCCC;
  }
`;


export {
  Table,
  Header,
  Content,
  TableTitle,
  InputCount
};