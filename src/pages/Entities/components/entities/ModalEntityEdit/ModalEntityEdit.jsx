import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
  ModalOverlay,
  ModModalOverlay,
  ModalContent,
  FormGroup,
  Label,
  Input,
  Button
} from './ModalEntityEdit.style';
import EntityAPI from '../../../../../utils/apiEntity';

const ModalEntityEdit = ({ showModal, setShowModal, type, data, setData, setLoadedEntityDetails }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(data);  // Инициализируем форму данными
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const response = await EntityAPI.editEntity(formData);
    alert('Данные успешно обновлены!');
    setShowModal(false);
    setData(formData);
    setLoadedEntityDetails(formData);
  };

  return ReactDOM.createPortal(
    <ModalOverlay onClick={() => setShowModal(false)}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Редактировать {type === 'contact' ? 'контакт' : 'компанию'}</h2>
        {type === 'contact' && (
          <>
            <FormGroup>
              <Label>Телефон</Label>
              <Input
                name="phone"
                placeholder="Телефон"
                value={formData.phone || ''}
                onChange={handleChange}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label>Имя</Label>
              <Input
                name="name"
                placeholder="Имя"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Серия</Label>
              <Input
                name="series"
                placeholder="Серия"
                value={formData.series || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Номер</Label>
              <Input
                name="number"
                placeholder="Номер"
                value={formData.number || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Дата выдачи</Label>
              <Input
                name="issueDate"
                type="date"
                placeholder="Дата выдачи"
                value={formData.issueDate || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Кем выдан</Label>
              <Input
                name="issuedBy"
                placeholder="Кем выдан"
                value={formData.issuedBy || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Код</Label>
              <Input
                name="code"
                placeholder="Код"
                value={formData.code || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </>
        )}
        {type === 'company' && (
          <>
            <FormGroup>
              <Label>ИНН</Label>
              <Input
                name="inn"
                placeholder="ИНН"
                value={formData.inn || ''}
                onChange={handleChange}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label>Название</Label>
              <Input
                name="name"
                placeholder="Название"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Адрес</Label>
              <Input
                name="address"
                placeholder="Адрес"
                value={formData.address || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Контактное лицо</Label>
              <Input
                name="contactPerson"
                placeholder="Контактное лицо"
                value={formData.contactPerson || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Должность</Label>
              <Input
                name="position"
                placeholder="Должность"
                value={formData.position || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Телефон компании</Label>
              <Input
                name="company_phone"
                placeholder="Телефон компании"
                value={formData.company_phone || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </>
        )}
        <Button onClick={handleSubmit}>Сохранить</Button>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default ModalEntityEdit;