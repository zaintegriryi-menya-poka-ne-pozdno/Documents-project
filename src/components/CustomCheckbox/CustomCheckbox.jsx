
import React, { useEffect } from 'react';

import {
  CheckboxContainer,
  InnerBox
} from './CustomCheckbox.style';

const CustomCheckbox = ({ isSelected, onChange }) => {

  const [insideSelected, setInsideSelected] = React.useState(isSelected);

  useEffect(() => {
    setInsideSelected(isSelected);
  }, [isSelected]);

  const handleClick = () => {
    const newSelectedState = !insideSelected;
    setInsideSelected(newSelectedState);
    onChange(newSelectedState);
  };

  return (
    <CheckboxContainer onClick={handleClick}>
      {insideSelected && <InnerBox />}
    </CheckboxContainer>
  );
};

export default CustomCheckbox;