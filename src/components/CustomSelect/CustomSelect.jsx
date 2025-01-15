
import React, { useState } from 'react';

// utils

// styles
import {
  SelectWrapper,
  SelectedOption,
  OptionsList,
  OptionItem
} from './CustomSelect.style'

// components


const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    value(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <SelectWrapper>
      <SelectedOption onClick={handleToggle}>
        {selectedValue ? options.find(option => option.value === selectedValue).label : 'Выбрать'}
      </SelectedOption>
      {isOpen && (
        <OptionsList>
          {options.map(option => (
            <OptionItem key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectWrapper>
  );
};

export default CustomSelect;