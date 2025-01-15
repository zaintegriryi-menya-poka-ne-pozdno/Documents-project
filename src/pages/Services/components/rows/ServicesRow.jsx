import React, { useEffect, useState } from 'react'

// utils

// styles
import {
  Row,
  Text,
  InputCount
} from './ServicesRow.style'

// components
import CustomCheckbox from '../../../../components/CustomCheckbox/CustomCheckbox';

const ServicesRow = ({ isSelected, title, count, price, onCheckboxChange, onFieldChange, config }) => {
  const [editedData, setEditedData] = useState({ count, price });

  const handleCheckboxChange = (isSelected) => {
    onCheckboxChange(title, isSelected);
  };

  useEffect(() => {
    if (count !== editedData.count || price !== editedData.price) {
      onFieldChange(title, editedData);
      updateTextareaValue(config.title, title);
      updateInputValue(config.count, editedData.count);
      updateInputValue(config.price, editedData.price);
      updateInputValue(config.summ, editedData.price * editedData.count);
    } else {
      onFieldChange(title, null);
      updateTextareaValue(config.title, title);
      updateInputValue(config.count, editedData.count);
      updateInputValue(config.price, editedData.price);
      updateInputValue(config.summ, editedData.price * editedData.count);
    }

  }, [editedData, title, count, price]);

  const handleInputChange = (field, value) => {
    setEditedData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const updateInputValue = (name, newValue) => {
    const element = document.querySelector(`[data-id="${name}"]`);
    if (element) {
      const input = element.querySelector('input');
      if (input) {
        input.value = newValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const updateTextareaValue = (name, newValue) => {
    const element = document.querySelector(`[data-id="${name}"]`);
    if (element) {
      const input = element.querySelector('textarea');
      if (input) {
        input.value = newValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const isEdited = count !== editedData.count || price !== editedData.price;

  return (
    <Row className='services__row'>

      <Text style={{ display: 'inline-flex', flex: 6 }}>
        <CustomCheckbox
          isSelected={isSelected}
          onChange={handleCheckboxChange}
        />
        <div style={{ marginLeft: '10px' }} className='services__row__title'>{title}</div>
      </Text>

      <Text style={{ textAlign: 'center', flex: 1 }}>
        <InputCount
          className='services__row__count'
          type="number"
          value={editedData.count}
          isEdited={isEdited}
          onChange={(e) => handleInputChange('count', Number(e.target.value))}
        />
      </Text>

      <Text style={{ textAlign: 'center', flex: 2 }}>
        <InputCount
          className='services__row__price'
          type="number"
          value={editedData.price}
          isEdited={isEdited}
          onChange={(e) => handleInputChange('price', Number(e.target.value))}
        />  
      </Text>

    </Row>
  )
};

export default ServicesRow;
