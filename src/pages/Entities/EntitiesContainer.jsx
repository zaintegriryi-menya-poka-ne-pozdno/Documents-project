
import React, { useState, useEffect, createContext, useContext } from 'react';

// utils

// styles
import { Container } from './EntitiesContainer.style';

// components
import EntityContainer from './components/EntityContainer';
import EntityAPI from '../../utils/apiEntity';


const EntitiesContainer = () => {
  
  const [doDuplicate,   setDoDuplicate] = useState(null);
  const [dataDuplicate, setDataDuplicate] = useState(null);

  return (
    <Container className='entities'>
      <EntityContainer
        label="Клиент"
        role="sender"
        doDuplicate={doDuplicate}
        setDoDuplicate={setDoDuplicate}
        dataDuplicate={dataDuplicate}
        setDataDuplicate={setDataDuplicate}
      />
      <EntityContainer
        label="Перевозчик"
        role="transfer"
        doDuplicate={doDuplicate}
        setDoDuplicate={setDoDuplicate}
        dataDuplicate={dataDuplicate}
        setDataDuplicate={setDataDuplicate}
      />
      <EntityContainer
        label="Водитель"
        role="recipient"
        doDuplicate={doDuplicate}
        setDoDuplicate={setDoDuplicate}
        dataDuplicate={dataDuplicate}
        setDataDuplicate={setDataDuplicate}
      />
    </Container>
  );
};

export default EntitiesContainer;
