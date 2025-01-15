
import React, { useState, useEffect } from 'react'

// utils
import entityLabels from './EntityLabels';
import { deepEqual } from '../../../../utils/functions';

// styles
import {
  EntityHeaderLeft,
  EntityHeaderRight,
  ContainerEntity,
  ContainerLine,
  LineContainerLeft,
  LineContainerRight,
  InfoLine
} from './EntityComponent.style'

// components
import CustomButton from '../../../../components/CustomButton/CustomButton';
import ModalEntityEdit from './ModalEntityEdit/ModalEntityEdit';


const EntityComponent = ({ type, loadedType, data, setData, onAttach, role, setLoadedEntityType, newType, setNewType, loadedEntityDetails, setLoadedEntityDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const labels = entityLabels[type];

  if (!labels) {
    return null;
  }

  if (type !== loadedType) {
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const [firstKey, secondKey] = Object.keys(labels).slice(0, 2);

  return (
    <ContainerEntity>
      {/* Объединяем первые два свойства в один контейнер */}
      <ContainerLine style={{ margin: '0px 0px 0px 0px' }}>
        <EntityHeaderLeft style={{ fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={toggleExpand}>
          <p style={{ marginRight: '5px' }}>{isExpanded ? '▼' : '►'}</p>
          <p className={'entity__key__' + secondKey} >{data[secondKey] || 'N/A'}</p>
        </EntityHeaderLeft>
        <EntityHeaderRight style={{ fontSize: '16px', fontWeight: 'bold' }} className={'entity__key__' + firstKey}>
          {data[firstKey] || 'N/A'}
        </EntityHeaderRight>
      </ContainerLine>

      {/* Рендерим остальные свойства как раньше, но управляем видимостью через стиль display */}
      <div style={{ display: isExpanded ? 'block' : 'none', marginTop: '10px' }}>
        {Object.keys(labels).slice(2).map((key) => (
          <InfoLine key={key}>
            <LineContainerLeft>
              {labels[key]}
            </LineContainerLeft>
            <LineContainerRight className={'entity__key__' + key}>
              {data[key] || 'N/A'}
            </LineContainerRight>
          </InfoLine>
        ))}
      </div>

      {!deepEqual(loadedEntityDetails, data) && (
        <CustomButton
          text="Привязать"
          padding={'7px'}
          color={'blue'}
          onClick={() => {
            onAttach(data, role);
            setNewType(type);
            setLoadedEntityDetails(data);
          }}
          style={{
            width: '188px',
            marginTop: '15px',
          }}
        />
      )}

        <CustomButton
          text="✏️"
          padding={'5px'}
          onClick={() => {
            setShowModal(true);
          }}
          style={{
            marginTop: '15px',
          }}
        />

        {showModal && (
          <ModalEntityEdit
            showModal={showModal}
            setShowModal={setShowModal}
            type={type}
            data={data}
            setData={setData}
            setLoadedEntityDetails={setLoadedEntityDetails}
          />
        )}

    </ContainerEntity>
  );

};

export default EntityComponent;