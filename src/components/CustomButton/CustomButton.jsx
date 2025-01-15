
import React from 'react';
import styled from 'styled-components';

const getColor = (color) => {
  switch (color) {
    case 'green':
      return {
        background: '#B7DE77',
        hover: '#99BC60',
        textColor: 'black'
      };
    case 'blue':
      return {
        background: '#77CBDE',
        hover: '#67B3C5',
        textColor: 'black'
      };
    case 'red':
      return {
        background: '#EDA58E',
        hover: '#D97B5D',
        textColor: 'black'
      };
    case 'orange':
      return {
        background: 'orange',
        hover: 'darkorange',
        textColor: 'white'
      };
    default:
      return {
        background: 'gray',
        hover: 'darkgray',
        textColor: 'black'
      };
  }
};


const Button = styled.div`
  display: inline-block;
  padding: ${(props) => props.padding};
  user-select: none;
  border-radius: 5px;
  text-align: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;
  background-color: ${(props) => (props.disabled ? 'lightgray' : getColor(props.color).background)};
  color: ${(props) => getColor(props.color).textColor};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${(props) => (props.disabled ? 'lightgray' : getColor(props.color).hover)};
  }

  &:active {
    transform: ${(props) => (props.color === 'red' ? 'none' : 'scale(0.98)')};
  }
`;

const CustomButton = ({ style, color, text, padding, onClick, disabled }) => {
  return (
    <Button
      style={style}
      color={color}
      padding={padding}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
