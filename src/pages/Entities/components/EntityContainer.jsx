import React, { useState, useEffect } from 'react';

// utils
import apiEntity from '../../../utils/apiEntity';

// styles
import {
  Container,
  ContainerHeader,
  TitleContainerLeft,
  TitleContainerRight

} from './EntityContainer.style';
// components
import CustomButton from '../../../components/CustomButton/CustomButton';
import ModalEntities from './ModalEntities/ModalEntities';

const entityComponents = {
  contact: {
    label: 'Физическое лицо',
  },
  company: {
    label: 'Юридическое лицо',
  }
};

const FIELD_LABELS = {
  contact: {
    phone:      'Номер телефона',
    name:       'Имя клиента',
    series:     'Серия',
    number:     'Номер',
    issueDate:  'Дата выдачи',
    issuedBy:   'Выдал',
    code:       'Код',
    TipTS:      'Тип ТС',
    markaAvto: 'Марка авто',
    gosNomer:       'г/н',
    TipPricepa:     'п/прицеп',
    pp:             'г/н пп'
  },
  company: {
    inn:            'ИНН',
    name:           'Название',
    contactPerson:  'ФИО',
    position:       'Должность',
    kpp:            'КПП',
    company_phone:  'Номер телефона',
    ogrn:           'ОГРН',
    bic:            'БИК',
    bank:           'Банк',
    ks:             'к/с',
    rs:             'р/с',
    postalСode:    'Почтовый индекс',
    city:          'Город',
    street:        'Улица',
    building:      'Дом',
    office:        "Офис",
    phonecompani:  "Номер телефона",
    emailcompani:  "Электронная почта"
  }
};

const EntityContainer = ({ label, role, doDuplicate, setDoDuplicate, dataDuplicate, setDataDuplicate }) => {
  const [entityType, setEntityType] = useState(role === 'recipient' ? 'contact' : 'company');
  const [entityDetails, setEntityDetails] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const targetInputName = entityType === 'contact' ? 'CFV[1276575]' : 'CFV[1276573]';
      const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
      if (targetInput && targetInput.value) {
        setEntityDetails(JSON.parse(targetInput.value));
      } else {
        const response = await apiEntity.fetchDataDetails(role);
        setEntityDetails(response.details);
      }
    };

    fetchData();

    const observer = new MutationObserver(() => {
      const targetInputName = entityType === 'contact' ? 'CFV[1276575]' : 'CFV[1276573]';
      const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
      if (targetInput && targetInput.value) {
        setEntityDetails(JSON.parse(targetInput.value));
        const event = new Event('input', { bubbles: true });
        targetInput.dispatchEvent(event);
      }
    });

    const targetNode = document.body;
    observer.observe(targetNode, { attributes: true, childList: true, subtree: true });

    return () => observer.disconnect();
  }, [entityType, role]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFindData = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Container className={`entity__${role}`} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
      <ContainerHeader style={{ marginBottom: '16px' }}>
        <TitleContainerLeft style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{label}</TitleContainerLeft>
        <TitleContainerRight>
          <CustomButton
            text="Редактировать"
            padding={'6px'}
            color={'green'}
            onClick={handleFindData}
            style={{ width: '188px' }}
          />
        </TitleContainerRight>
      </ContainerHeader>

      {entityDetails && (
        <div style={{ marginTop: '15px' }}>
          {entityType === 'company' ? (
            <>
              <p style={{ fontSize: '16px', color: '#555' }}><strong>Название компании:</strong> {entityDetails.name || '-'}</p>
              <p style={{ fontSize: '16px', color: '#555' }}><strong>ИНН:</strong> {entityDetails.inn || '-'}</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: '16px', color: '#555' }}><strong>Имя:</strong> {entityDetails.name || '-'}</p>
              <p style={{ fontSize: '16px', color: '#555' }}><strong>Номер телефона:</strong> {entityDetails.phone || '-'}</p>
            </>
          )}
          {isExpanded && (
            <div style={{ marginTop: '10px', background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
              {Object.keys(FIELD_LABELS[entityType]).map((key) => (
                <p key={key} style={{ fontSize: '14px', color: '#666' }}>
                  <strong>{FIELD_LABELS[entityType][key]}:</strong> {entityDetails[key] || '-'}
                </p>
              ))}
            </div>
          )}
          <CustomButton
            text={isExpanded ? 'Скрыть детали' : 'Показать детали'}
            padding={'6px'}
            color={'blue'}
            onClick={toggleExpand}
            style={{ marginTop: '10px', width: '150px' }}
          />
        </div>
      )}

      <ModalEntities
        isOpen={isModalOpen}
        onClose={closeModal}
        type={entityType}
        dataSearch={''}
        setDataSearch={() => {}}
        entityComponents={entityComponents}
      />
    </Container>
  );
};

export default EntityContainer;
