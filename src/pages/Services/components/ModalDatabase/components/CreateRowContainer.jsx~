
import React, { useState } from 'react';

// utils
import ServicesAPI from '../../../../../utils/apiServices';

// styles
import {
  Container,
  InfoLine,
  LineContainerLeft,
  ContainerCenter,
  LineContainerRight,
  InputCount
} from './CreateRowContainer.style'

// components
import CustomButton from '../../../../../components/CustomButton/CustomButton';


const CreateRowContainer = ({ isOpen, onClose, setServicesBase }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSubmit = async () => {
    const newService = {
      title: title,
      price: price
    };

    console.log(newService);

    const data = await ServicesAPI.addService(newService);
    console.log(data);

    clearInputs();
    setServicesBase(await ServicesAPI.fetchServicesData());
  };

  const clearInputs = () => {
    setTitle('');
    setPrice('');
  };

  if (!isOpen) return null;

  return (
    <Container>
      
      <InfoLine style={{ marginBottom: '15px' }}>
        <LineContainerLeft style={{ fontWeight: 'bold' }}>
          Добавление новой услуги
        </LineContainerLeft>
        <LineContainerRight>

        </LineContainerRight>
      </InfoLine>

      <InfoLine style={{ marginBottom: '10px' }}>
        <LineContainerLeft>
          Название услуги
        </LineContainerLeft>
        <LineContainerRight style={{ flex: 2 }}>
          <InputCount
            type="text"
            value={title}
            onChange={handleTitleChange}
            style={{ textAlign: 'left', paddingLeft: '5px' }}
            required
          />
        </LineContainerRight>
      </InfoLine>

      <InfoLine>
        <LineContainerLeft>
        Цена
        </LineContainerLeft>
        <LineContainerRight style={{ flex: 2 }}>
          <InputCount
            type="number"
            value={price}
            onChange={handlePriceChange}
            style={{ textAlign: 'left', paddingLeft: '5px' }}
            required
          />
        </LineContainerRight>
      </InfoLine>

      <InfoLine style={{ marginTop: '10px'}}>
        <LineContainerLeft>
          <CustomButton
            text="Сохранить в базу"
            padding={'5px'}
            color={'green'}
            onClick={handleSubmit}
            style={{
              width: '100%'
            }}
          />
        </LineContainerLeft>
        <ContainerCenter></ContainerCenter>
        <LineContainerRight>
          <CustomButton
            text="Отменить"
            padding={'5px'}
            color={'red'}
            onClick={() => {
              onClose();
              clearInputs();
            }}
            style={{
              width: '100%'
            }}
          />
        </LineContainerRight>
      </InfoLine>

    </Container>
  )
};

export default CreateRowContainer;