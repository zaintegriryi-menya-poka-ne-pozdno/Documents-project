
import React, { useEffect, useState } from 'react';

// utils
import { deeperEqual } from '../../utils/functions';
import ServicesAPI from '../../utils/apiServices';

// styles
import {
  Container,
  ContainerHeader,
  ContainerLeft,
  ContainerRight,
  ContainerCenter,
  InputSearch
} from './ServicesContainer.style';

// components
import CustomButton from '../../components/CustomButton/CustomButton';
import ServicesTableContainer from './components/ServicesTableContainer';
import ModalDatabase from './components/ModalDatabase/ModalDatabase';

import { ServicesData } from './ServicesData';


const ServicesContainer = () => {
  const [servicesData,        setServicesData]        = useState(null);
  const [selectedItems,       setSelectedItems]       = useState([]);
  const [changedItems,        setChangedItems]        = useState({});

  const [summTotal, setSummTotal] = useState(0);

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  
  useEffect(() => {
    const fetchStartData = async () => {
      const data = await ServicesAPI.fetchServicesToDeal();
      setServicesData(data);
      console.log(data);
    };
    
    fetchStartData();
  }, []);

  const handleCheckboxChange = (title, isSelected) => {
    setSelectedItems(prevSelectedItems =>
      isSelected
        ? [...prevSelectedItems, title]
        : prevSelectedItems.filter(item => item !== title)
    );
  };

  const handleFieldChange = (title, changes) => {
    setChangedItems(prevChangedItems => {
      if (changes) {
        return { ...prevChangedItems, [title]: changes };
      } else {
        const { [title]: _, ...rest } = prevChangedItems;
        return rest;
      }
    });
  };

  const handleSaveChanges = async () => {
    const changedData = Object.keys(changedItems).map(title => ({
      title: title,
      ...changedItems[title]
    }));
    console.log(changedData);
    const response = await ServicesAPI.saveUpdatedServiceToDeal(changedData);
    if (response.success) {
      setServicesData(null);
      const data = await ServicesAPI.fetchServicesToDeal();
      setServicesData(data);
      setSelectedItems([]);
      setChangedItems({});
    }
  };

  
  const handleDeleteSelected = async () => {
    console.log(selectedItems);
    const response = await ServicesAPI.deleteSelectedServicesToDeal(selectedItems);
    if (response.success) {
      setServicesData(null);
      const data = await ServicesAPI.fetchServicesToDeal();
      setServicesData(data);
      setSelectedItems([]);
      setChangedItems({});
    }
  };


  // const handleChangeBudget = (newValue) => {
  //   const element = document.querySelector(`[name="lead[PRICE]"]`);
  //   element.value = newValue;
  //   element.dispatchEvent(new Event('input', { bubbles: true }));
  // };
  // useEffect(() => {
  //   handleChangeBudget(summTotal);
  // }, [summTotal]);


  
  useEffect(() => {
    if (servicesData !== null) {
      const updatedServicesData = servicesData.map(service => {
        if (changedItems.hasOwnProperty(service.title)) {
          return {
            ...service,
            ...changedItems[service.title]
          };
        }
        return service;
      });
    
      const total = updatedServicesData.reduce((sum, service) => {
        return sum + (service.price * service.count);
      }, 0);
    
      setSummTotal(total);
    }
  
  }, [servicesData, changedItems]);

  useEffect(() => {
    console.log(servicesData, selectedItems, changedItems);
  }, [servicesData, selectedItems, changedItems]);

  return (
    <Container className='services'>

      <ContainerHeader>
        <ContainerLeft style={{ fontWeight: 'bold', fontSize: '16px' }}>Товары и услуги</ContainerLeft>
        <ContainerRight>Sett.</ContainerRight>
      </ContainerHeader>

      <ContainerHeader style={{ marginTop: '10px' }}>
        <ContainerLeft style={{ flex: 2 }} >
          <CustomButton
            text="Открыть базу товаров"
            padding={'6px'}
            color={'blue'}
            style={{
              width: '100%'
            }}
            onClick={openModal}
          />
        </ContainerLeft>
        <ContainerCenter style={{ flex: 1 }}/>
        <ContainerRight style={{ flex: 2 }}/>
      </ContainerHeader>

      <ContainerHeader style={{ marginTop: '15px' }}>
        <ServicesTableContainer
          servicesData={servicesData}
          onCheckboxChange={handleCheckboxChange}
          onFieldChange={handleFieldChange}
        />
      </ContainerHeader>

      <ContainerHeader style={{ marginTop: '15px' }}>
        <ContainerLeft style={{ flex: 2 }} >
        </ContainerLeft>
        <ContainerCenter style={{ flex: 1 }}/>
        <ContainerRight style={{ flex: 2, fontWeight: 'bold', fontSize: '16px' }} className='services__total'>
          Итого: {summTotal} рублей
        </ContainerRight>
      </ContainerHeader>

      <ContainerHeader style={{ marginTop: '15px' }}>
        <ContainerLeft style={{ flex: 2 }} >
          {Object.keys(changedItems).length > 0 && (
            <CustomButton
              text="Сохранить изменения"
              padding={'6px'}
              color={'green'}
              style={{
                width: '100%'
              }}
              onClick={handleSaveChanges}
            />
          )}
        </ContainerLeft>
        <ContainerCenter style={{ flex: 1 }}/>
        <ContainerRight style={{ flex: 2 }} >
          {selectedItems.length > 0 && Object.keys(changedItems).length == 0 && (
            <CustomButton
              text="Удалить выбранные"
              padding={'6px'}
              color={'red'}
              style={{ width: '100%' }}
              onClick={handleDeleteSelected}
            />
          )}
        </ContainerRight>
      </ContainerHeader>

      <ModalDatabase
        isOpen={isModalOpen}
        onClose={closeModal}
        setServicesDataDeal={setServicesData}
        setSelectedItemsDeal={setSelectedItems}
        setChangedItemsDeal={setChangedItems}
      />

    </Container>
  )
};

export default ServicesContainer;
