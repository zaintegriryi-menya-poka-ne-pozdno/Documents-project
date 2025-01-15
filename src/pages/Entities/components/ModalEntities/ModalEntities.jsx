import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import entityLabels from '../entities/EntityLabels.js';
import {
  ModalOverlay,
  ModalContent,
  LineContainerLeft,
  LineContainerRight,
  InfoLine,
  InputSave
} from './ModalEntities.style.js';
import CustomButton from '../../../../components/CustomButton/CustomButton.jsx';

const ModalEntities = ({ isOpen, onClose, type, dataSearch, setDataSearch, entityComponents }) => {
  const initialDriverState = {
    phone: '', name: '', series: '', number: '', issueDate: '', issuedBy: '',
    code: '', TipTS: '', markaAvto: '', gosNomer: '', TipPricepa: '', pp: ''
  };

  const initialCompanyState = {
    inn: '', name: '', contactPerson: '', position: '', kpp: '', company_phone: '',
    ogrn: '', bic: '', bank: '', ks: '', rs: '', postalСode: '', city: '', street: '',
    building: '', office: '', phonecompani: '', emailcompani: ''
  };

  const getInitialFormState = (type) => {
    return type === 'contact' ? { ...initialDriverState } : { ...initialCompanyState };
  };

  const [formData, setFormData] = useState(getInitialFormState(type));

  useEffect(() => {
    const targetInputName = type === 'contact' ? 'CFV[1276575]' : 'CFV[1276573]';
    const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
    if (targetInput && targetInput.value) {
      setFormData(JSON.parse(targetInput.value));
    } else {
      setFormData(getInitialFormState(type));
    }
    setDataSearch('');
  }, [type]);

  if (!isOpen) return null;

  const isDriver = type === 'contact';
  const labels = entityLabels[type];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEntity = () => {
    const filteredData = Object.keys(formData).reduce((filtered, key) => {
      if (formData[key]) {
        filtered[key] = formData[key];
      }
      return filtered;
    }, {});

    const targetInputName = isDriver ? 'CFV[1276575]' : 'CFV[1276573]';
    const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
    if (targetInput) {
      targetInput.value = JSON.stringify(filteredData);
    }
    onClose();
  };

  const renderInputFields = () => (
    Object.keys(labels).map((key) => (
      <InfoLine key={key} style={{ marginTop: '10px' }}>
        <LineContainerLeft>{labels[key]}</LineContainerLeft>
        <LineContainerRight>
          <InputSave
            type="text"
            value={formData[key]}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        </LineContainerRight>
      </InfoLine>
    ))
  );

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <InfoLine style={{ marginBottom: '20px' }}>
          <LineContainerLeft style={{ fontWeight: 'bold' }}>
            Добавление в базу: {isDriver ? 'Водитель' : 'Сущность покупателя'}
          </LineContainerLeft>
          <LineContainerRight style={{ flex: 0 }}>
            <CustomButton text="Закрыть" color="red" onClick={onClose} style={{ width: '70px' }} />
          </LineContainerRight>
        </InfoLine>

        <div style={{ marginTop: '15px' }}>
          <p style={{ fontWeight: 'bold' }}>Обязательные поля:</p>
          {renderInputFields()}
        </div>

        <InfoLine>
          <LineContainerRight style={{ flex: 0 }}>
            <CustomButton
              text="Сохранить"
              color="green"
              onClick={handleSaveEntity}
              style={{ width: '188px', marginTop: '20px' }}
            />
          </LineContainerRight>
        </InfoLine>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default ModalEntities;
