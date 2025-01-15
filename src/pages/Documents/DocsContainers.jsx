import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client';

// utils

// styles

// components
import CheckContainer from './containers/Check/CheckContainer';
import CarierRequestContainer from './containers/CarierRequest/CarierRequest';
import ClientRequestContainer from './containers/ClientRequest/ClientRequest';
import DogovorContainer from './containers/Dogovor/Dogovor';
import DoverennostContainer from './containers/Doverennost/Doverennost';
import KPContainer from './containers/KP/KP';
import OneTimeRequestContainer from './containers/OneTimeRequest/OneTimeRequest';
import TTHContainer from './containers/TTH/TTH';
import YPDContainer from './containers/YPD/YPD';

const DocsIds = {
  check: 1271007,  // Cчёт
  carierrequest: 1271019, // Заявка с перевозчиком
  clientrequest: 1271001, // Заявка с клиентом
  dogovor: 1262271, // Экспедиторская расписка
  doverennost: 1271003, // Доверенность
  kp: 1271011, // КП
  onetimerequest: 1271015,//Заявка разовая с клиентом
  tth:1262275, // ТТН
  ypd:1262293 // УПД 
}

const DocsContainers = () => {

  useEffect(() => {
    const CheckContainerDiv = document.querySelector(`[data-id="${DocsIds.check}"]`);
    if (CheckContainerDiv) {
      const parent = CheckContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, CheckContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <CheckContainer type='check' />
      );
    }

    const CarierRequestContainerDiv = document.querySelector(`[data-id="${DocsIds.carierrequest}"]`);
    if (CarierRequestContainerDiv) {
      const parent = CarierRequestContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, CarierRequestContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <CarierRequestContainer type='carierrequest' />
      );
    }

    const ClientRequestContainerDiv = document.querySelector(`[data-id="${DocsIds.clientrequest}"]`);
    if (ClientRequestContainerDiv) {
      const parent = ClientRequestContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, ClientRequestContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <ClientRequestContainer type='clientrequest' />
      );
    }

    const DogovorContainerDiv = document.querySelector(`[data-id="${DocsIds.dogovor}"]`);
    if (DogovorContainerDiv) {
      const parent = DogovorContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, DogovorContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <DogovorContainer type='dogovor' />
      );
    }

    const DoverennostContainerDiv = document.querySelector(`[data-id="${DocsIds.doverennost}"]`);
    if (DoverennostContainerDiv) {
      const parent = DoverennostContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, DoverennostContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <DoverennostContainer type='doverennost' />
      );
    }

    const KPContainerDiv = document.querySelector(`[data-id="${DocsIds.kp}"]`);
    if (KPContainerDiv) {
      const parent = KPContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, KPContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <KPContainer type='kp' />
      );
    }

    const OneTimeRequestContainerDiv = document.querySelector(`[data-id="${DocsIds.onetimerequest}"]`);
    if (OneTimeRequestContainerDiv) {
      const parent = OneTimeRequestContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, OneTimeRequestContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <OneTimeRequestContainer type='onetimerequest' />
      );
    }

    const TTHContainerDiv = document.querySelector(`[data-id="${DocsIds.tth}"]`);
    if (TTHContainerDiv) {
      const parent = TTHContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, TTHContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <TTHContainer type='tth' />
      );
    }

    const YPDContainerDiv = document.querySelector(`[data-id="${DocsIds.ypd}"]`);
    if (YPDContainerDiv) {
      const parent = YPDContainerDiv.parentElement;
      const div = document.createElement('div');
      parent.replaceChild(div, YPDContainerDiv);
      const root = ReactDOM.createRoot(div);
      root.render(
        <YPDContainer type='ypd' />
      );
    }

  }, []);

  return (
    <>

    </>
  );

};

export default DocsContainers;