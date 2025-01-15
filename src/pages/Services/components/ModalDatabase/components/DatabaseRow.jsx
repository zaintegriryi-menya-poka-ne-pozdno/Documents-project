
import React, { useEffect, useState } from 'react'

// utils
import { deeperEqual } from '../../../../../utils/functions';

// styles
import {
  Row,
  Text,
  InputCount
} from './DatabaseRow.style'

// components
import CustomCheckbox from '../../../../../components/CustomCheckbox/CustomCheckbox';
import CustomButton from '../../../../../components/CustomButton/CustomButton';


const DatabaseRow = ({ isSelected, onCheckboxChange, id, title, price, onFieldChange }) => {
  const [editedData, setEditedData] = useState({ title, price });

  const handleCheckboxChange = (isSelected) => {
    onCheckboxChange(id, isSelected);
  };

  useEffect(() => {
    if (title !== editedData.title || price !== editedData.price) {
      onFieldChange(id, editedData);
    } else {
      onFieldChange(id, null);
    }
  }, [editedData]);

  const handleInputChange = (field, value) => {
    setEditedData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const isEdited = title !== editedData.title || price !== editedData.price;

  return (
    <div>
      <Row>
        <Text style={{ display: 'inline-flex', flex: 4 }}>
          <CustomCheckbox
            isSelected={isSelected}
            onChange={handleCheckboxChange}
          />
          <InputCount 
            type="text"
            value={editedData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            isEdited={isEdited}
            style={{
              marginLeft: '10px',
              textAlign: 'left',
              paddingLeft: '5px'
            }}
          /> 
        </Text>

        <Text style={{ textAlign: 'center', flex: 1 }}>
          <InputCount
            type="number"
            value={editedData.price}
            onChange={(e) => handleInputChange('price', Number(e.target.value))}
            isEdited={isEdited}
          />  
        </Text>
      </Row>
    </div>
  );
};

export default DatabaseRow;