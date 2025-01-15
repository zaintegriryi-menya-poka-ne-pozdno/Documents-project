
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// utils
import ServicesAPI from '../../../../utils/apiServices.js';
import { deepEqual } from '../../../../utils/functions.js' 

// styles
import {
  ModalOverlay,
  ModalContent,
  LineContainerLeft,
  ContainerCenter,
  LineContainerRight,
  InfoLine,
  InputSave
} from './ModalDatabase.style.js';

// components
import CustomButton from '../../../../components/CustomButton/CustomButton';
import DatabaseTable from './components/DatabaseTable.jsx';
import CreateRowContainer from './components/CreateRowContainer.jsx';



const ModalDatabase = ({ isOpen, onClose, setServicesDataDeal, setSelectedItemsDeal, setChangedItemsDeal }) => {
  const [servicesBase,        setServicesBase]       = useState([]);
  const [loadedServicesBase,  setLoadedServicesBase] = useState([]);
  const [selectedItems,       setSelectedItems]      = useState([]);
  const [changedItems,        setChangedItems]       = useState({});

  const [isSaveFormOpen, setIsSaveFormOpen] = useState(false);

  useEffect(() => {
    const fetchStartData = async () => {
      const data = await ServicesAPI.fetchServicesData();
      setServicesBase(data);
    };

    fetchStartData();
  }, []);

  const handleCheckboxChange = (id, isSelected) => {
    setSelectedItems(prevSelectedItems =>
      isSelected
        ? [...prevSelectedItems, id]
        : prevSelectedItems.filter(item => item !== id)
    );
  };

  const handleAddToDeal = async () => {
    const selectedItemsData = selectedItems.map(id => servicesBase.find(item => item.id === id));
    const response = await ServicesAPI.addSelectedServicesToDeal(selectedItemsData);
    if (response.success) {
      setServicesBase([]);
      const data = await ServicesAPI.fetchServicesData();
      setServicesBase(data);
      setSelectedItems([]);

      const dataDeal = await ServicesAPI.fetchServicesToDeal();
      setServicesDataDeal(dataDeal);
      setSelectedItemsDeal([]);
      setChangedItemsDeal({});
    }
  };

  const handleFieldChange = (id, changes) => {
    setChangedItems(prevChangedItems => {
      if (changes) {
        return { ...prevChangedItems, [id]: changes };
      } else {
        const { [id]: _, ...rest } = prevChangedItems;
        return rest;
      }
    });
  };

  const handleSaveChanges = async () => {
    const changedData = Object.keys(changedItems).map(id => ({
      id: Number(id),
      ...changedItems[id]
    }));
    const response = await ServicesAPI.saveUpdatedService(changedData);
    if (response.success) {
      const data = await ServicesAPI.fetchServicesData();
      setServicesBase(data);
      setSelectedItems([]);
      setChangedItems({});
    }
  };

  const handleDeleteSelected = async () => {
    const response = await ServicesAPI.deleteSelectedServices(selectedItems);
    if (response.success) {
      const data = await ServicesAPI.fetchServicesData();
      setServicesBase(data);
      setSelectedItems([]);
    }
  };

  const openSaveForm = () => setIsSaveFormOpen(true);
  const closeSaveForm = () => setIsSaveFormOpen(false);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent onClick={e => e.stopPropagation()}>


        <InfoLine style={{ marginBottom: '20px' }}>
          <LineContainerLeft style={{ fontWeight: 'bold' }}>
            База услуг
          </LineContainerLeft>

          <LineContainerRight style={{ flex: 0 }}>
              <CustomButton
                text="Закрыть"
                padding={'3px'}
                color={'red'}
                onClick={onClose}
                style={{
                  width: '70px'
                }}
              />
          </LineContainerRight>
        </InfoLine>

        {!isSaveFormOpen && (
          <InfoLine style={{ marginBottom: '20px' }}>
            <LineContainerLeft>
              <CustomButton
                text="Добавить новую услугу"
                padding={'5px'}
                color={'blue'}
                onClick={openSaveForm}
                style={{ width: '100%' }}
              />
            </LineContainerLeft>
            <LineContainerRight></LineContainerRight>
          </InfoLine>
        )}

        <CreateRowContainer
          isOpen={isSaveFormOpen}
          onClose={closeSaveForm}
          setServicesBase={setServicesBase}
        />

        <DatabaseTable
          servicesBase={servicesBase}
          setServicesBase={setServicesBase}
          onCheckboxChange={handleCheckboxChange}
          onFieldChange={handleFieldChange}
        />

        
        <InfoLine style={{ marginTop: '15px' }}>
          {selectedItems.length > 0 && Object.keys(changedItems).length == 0 && (
            <LineContainerLeft style={{ flex: 1 }}>
              <CustomButton
                text="Добавить выбранное в сделку"
                padding={'5px'}
                color={'blue'}
                style={{ width: '100%' }}
                onClick={handleAddToDeal}
              />
            </LineContainerLeft>
          )}
          <ContainerCenter style={{ flex: 1, height: '30px' }}></ContainerCenter>
          {selectedItems.length > 0 && Object.keys(changedItems).length == 0 && (
            <LineContainerRight style={{ flex: 1, justifyContent: 'flex-end' }}>
              <CustomButton
                text="Удалить выбранные"
                padding={'5px'}
                color={'red'}
                onClick={handleDeleteSelected}
                style={{ width: '100%' }}
              />
            </LineContainerRight>
          )}
        </InfoLine>
        
        
        <InfoLine style={{ marginTop: '15px' }}>
          {Object.keys(changedItems).length > 0 && (
            <LineContainerLeft style={{ flex: 1 }}>
              <CustomButton
                text="Сохранить изменения"
                padding={'5px'}
                color={'green'}
                onClick={handleSaveChanges}
                style={{ width: '100%' }}
              />
            </LineContainerLeft>
          )}
          <ContainerCenter style={{ flex: 1, height: '30px' }}></ContainerCenter>
          <LineContainerRight style={{ flex: 1, justifyContent: 'flex-end' }}></LineContainerRight>
        </InfoLine>


      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default ModalDatabase;