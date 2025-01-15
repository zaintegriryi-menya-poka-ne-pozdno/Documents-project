
import styled from 'styled-components';

const ContainerEntity = styled.div`
  margin-top: 10px;
  padding: 15px;
  border-radius: 7px;
  border: 1px solid #ABABAB;
`;

const ContainerLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

const InfoLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const EntityHeaderLeft = styled.div`
  flex: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const EntityHeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LineContainerLeft = styled.div`
  font-size: 13px;
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const LineContainerRight = styled.div`
font-size: 12px;
  flex: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export {
  EntityHeaderLeft,
  EntityHeaderRight,
  ContainerEntity,
  ContainerLine,
  LineContainerLeft,
  LineContainerRight,
  InfoLine
};