import React, { useState, useEffect } from 'react';

import {
  Container,
  ContainerHeader,
  ContainerLeft,
  ContainerRight,
  ContainerCenter,
  InputSearch
} from '../Contract/DocsContainer.style';

import { InputFields, SelectFields } from '../CustomFields/CustomFields.style';

const getFieldProperties = (element, type) => {

  const getInputValue = (element, selector, typeContent) => {
    const selectedElement = element.querySelector(selector);
    if (typeContent == 'value') {
      return selectedElement ? selectedElement.value : '';
    }
    if (typeContent == 'textContent') {
      return selectedElement ? selectedElement.textContent : '';
    }
  };

  const fieldProperties = {
    text: {
      value: getInputValue(element, 'input', 'value'),
    },
    number: {
      value: getInputValue(element, 'input', 'value'),
    },
    textarea: {
      value: getInputValue(element, 'textarea', 'value')
    },
    select: {
      value: getInputValue(element, '.control--select--button-inner', 'textContent'),
      selectedId: element.querySelector('.control--select--list--item-selected') ? element.querySelector('.control--select--list--item-selected').getAttribute('data-value') : '',
      options: Array.from(element.querySelectorAll('.control--select--list--item')).map(item => ({
        id: item.getAttribute('data-value'),
        value: item.querySelector('.control--select--list--item-inner') ? item.querySelector('.control--select--list--item-inner').textContent.trim() : ''
      }))
    },
    budget: {
      value: getInputValue(document, 'input[name="lead[PRICE]"]', 'value')
    },
  };

  return fieldProperties[type];
};


const CustomFields = ({ id, type, name, nameId, onFieldChange }) => {
  const [fieldData, setFieldData] = useState(null);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);

  useEffect(() => {
    const element = document.querySelector(`[data-id="${id}"]`);

    // console.log(element);
    
    if (element) {
      const fieldProps = getFieldProperties(element, type);
      const initialData = { fieldId: id, fieldType: type, label: name, ...fieldProps };
      setFieldData(initialData);

      onFieldChange(nameId, initialData.value);

    }
  }, [id, type, name]);

  const updateInputValue = (name, newValue) => {
    const element = document.querySelector(`[name="${name}"]`);
    if (element) {
      element.value = newValue;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const handleChange = (newValue) => {
    setFieldData((prevData) => {
      updateInputValue(`CFV[${id}]`, newValue);
      if (type === 'select') {
        const newSelectedOption = prevData.options.find(option => option.id === newValue);
        onFieldChange(nameId, newSelectedOption ? newSelectedOption.value : '');
        return { ...prevData, selectedId: newValue, value: newSelectedOption ? newSelectedOption.value : '' };
      } else {
        onFieldChange(nameId, newValue);
        return { ...prevData, value: newValue };
      }
    });
  };

  // const handleChangeBudget = (newValue) => {
  //   setFieldData((prevData) => {
  //     updateInputValue(`lead[PRICE]`, newValue);
  //     onFieldChange(nameId, newValue);
  //     return { ...prevData, value: newValue };
  //   });
  // };

  useEffect(() => {
    if (fieldData) {
      // console.log('fieldData', fieldData);
      if (fieldData.value == '' || fieldData.value.trim() == 'Выбрать') {
        setIsFieldEmpty(true);
      } else {
        setIsFieldEmpty(false);
      }
    }
  }, [fieldData]);

  if (!fieldData) return null;

  return (
    <ContainerHeader style={{ marginTop: '5px' }}>
      
      <ContainerLeft style={{ flex: 4 }}>{name}</ContainerLeft>

      <ContainerRight style={{ justifyContent: 'flex-start', flex: 7 }}>

        {type === 'text' && (
          <>
            <InputFields
              type="text"
              placeholder='...'
              value={fieldData.value}
              onChange={(e) => handleChange(e.target.value)}
              isFieldEmpty={isFieldEmpty}
            />
            <p 
              className={'field__biba_id_' + fieldData.fieldId}
              style={{ display: 'none' }}
            >
              {fieldData.value}
            </p>
          </>
        )}

        {type === 'textarea' && (
          <>
            <InputFields
              type="text"
              placeholder='...'
              value={fieldData.value}
              onChange={(e) => handleChange(e.target.value)}
              isFieldEmpty={isFieldEmpty}
            />
            <p 
              className={'field__biba_id_' + fieldData.fieldId}
              style={{ display: 'none' }}
            >
              {fieldData.value}
            </p>
          </>
        )}

        {type === 'number' && (
          <>
            <InputFields
              type="number"
              placeholder='...'
              value={fieldData.value}
              onChange={(e) => handleChange(e.target.value)}
              isFieldEmpty={isFieldEmpty}
            />
            <p
              className={'field__biba_id_' + fieldData.fieldId}
              style={{ display: 'none' }}
            >
              {fieldData.value}
            </p>
          </>
        )}

        {type === 'select' && (
          <>
            <SelectFields
              value={fieldData.selectedId}
              onChange={(e) => handleChange(e.target.value)}
              isFieldEmpty={isFieldEmpty}
            >
              {fieldData.options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
            </SelectFields>
            <p
              className={'field__biba_id_' + fieldData.fieldId}
              style={{ display: 'none' }}
            >
              {fieldData.options.find(option => option.id === fieldData.selectedId).value}
            </p>
          </>
        )}

      </ContainerRight>

    </ContainerHeader>
  );
};

export default CustomFields;