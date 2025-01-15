/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// utils

// styles

// components
import EntitiesContainer from '../pages/Entities/EntitiesContainer';
import ServicesContainer from '../pages/Services/ServicesContainer';
import DocsContainers from '../pages/Documents/DocsContainers';


const App = () => {

  useEffect(() => {
    const EntitiesContainerDiv = document.querySelector('[data-id="1262365"]'); //Основная группа полей, поле для сущностей
    if (EntitiesContainerDiv) {
      const parent = EntitiesContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, EntitiesContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(<EntitiesContainer />);
    }

    const ServicesContainerDiv = document.querySelector('[data-id="1262375"]'); //Услуги поле для услуг
    if (ServicesContainerDiv) {
      const parent = ServicesContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, ServicesContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(<ServicesContainer />);
    }
  }, []);

  return (
    <DocsContainers />
  );
};

export default App;
