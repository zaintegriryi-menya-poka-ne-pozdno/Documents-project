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
import EntityAPI from '../../../../utils/apiEntity'

const ModalEntities = ({ isOpen, onClose, type, dataSearch, setDataSearch, entityComponents }) => {
  const [typeOrg, setTypeOrg] = useState(type === 'contact' ? false : 'ООО')

  const initialDriverState = {
    phone: '', name: '', series: '', number: '', issueDate: '', issuedBy: '',
    code: '', TipTS: '', markaAvto: '', gosNomer: '', TipPricepa: '', pp: ''
  };

  const initialCompanyState = {
    inn: '', name: '', contactPerson: '', position: '', kpp: '', company_phone: '',
    ogrn: '', ogrnip: '', bic: '', bank: '', ks: '', rs: '', postalСode: '', city: '', street: '',
    building: '', office: '', emailcompani: '', customer_org_type: '', customer_org_type_short: ''
  };
  const initialCarrierState = {
    carrier_inn: '',  carrier_name: '',  carrier_contactPerson: '',  carrier_position: '',
    carrier_kpp: '',  carrier_company_phone: '',  carrier_ogrn: '', carrier_ogrnip: '',  carrier_bic: '',
    carrier_bank: '',  carrier_ks: '',  carrier_rs: '',  carrier_postalCode: '',  carrier_city: '',
    carrier_street: '',  carrier_building: '',  carrier_office: '',  carrier_emailcompani: '',
    customer_org_type: '', customer_org_type_short: ''
  }

  const getInitialFormState = (type) => {
    return type === 'contact'
        ? { ...initialDriverState }
        : type === 'carrier'
            ? {...initialCarrierState}
            : { ...initialCompanyState };
  };

  const [formData, setFormData] = useState(getInitialFormState(type));

  useEffect(() => {
    const targetInputName = type === 'contact'
        ? 'CFV[1276575]'
        : type === 'carrier'
            ? 'CFV[1279353]'
            : 'CFV[1276573]';
    const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
    if (targetInput && targetInput.value) {
      setFormData(JSON.parse(targetInput.value));
      setTypeOrg(JSON.parse(targetInput.value).customer_org_type_short)
    } else {
      setFormData(getInitialFormState(type));
    }
    setDataSearch('');
  }, [type]);

  if (!isOpen) return null;

  const labels = entityLabels[type];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEntity = () => {
    const filteredData = Object.keys(formData).reduce((filtered, key) => {
      if (formData[key]) {
        filtered[key] = formData[key];
      }
      if (typeOrg === 'ИП') {
        if (key === 'carrier_kpp') filtered[key] = ''
        if (key === 'kpp') filtered[key] = ''
        if (key === 'ogrn') filtered[key] = ''
        if (key === 'carrier_ogrn') filtered[key] = ''
      }
      if (typeOrg === 'ООО') {
        if (key === 'ogrnip') filtered[key] = ''
        if (key === 'carrier_ogrnip') filtered[key] = ''
      }
      return filtered;
    }, {});

    const targetInputName = type === 'contact'
        ? 'CFV[1276575]'
        : type === 'carrier'
            ? 'CFV[1279353]'
            : 'CFV[1276573]';
    const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
    if (targetInput) {
      targetInput.value = JSON.stringify(filteredData);
    }
    onClose();
  };

  const handleFind = () => {
    alert('ИНН')
  }

  const handleSwitch = () => {
    if (typeOrg === 'ООО') {
      setFormData((prev) => ({ ...prev, customer_org_type: 'Индивидуальный предприниматель', customer_org_type_short: 'ИП' }));
      setTypeOrg('ИП')
    } else if (typeOrg === 'ИП') {
      setFormData((prev) => ({ ...prev, customer_org_type: 'Общество с ограниченной ответственностью', customer_org_type_short: 'ООО' }));
      setTypeOrg('ООО')
    }
  }

  const handleFindDadata = async () => {
    if (type === 'carrier') {
      const getCompanyByINN = EntityAPI.fetchCompanyByINN;
      const dataCompany = await getCompanyByINN(formData.carrier_inn);
      const dataCompanyResult = JSON.parse(dataCompany);
      const companyData = dataCompanyResult.suggestions[0].data;


      const getBankDataByINN = EntityAPI.fetchBankDataByINN;
      const dataBank = await getBankDataByINN(formData.carrier_inn);
      const dataBankResult = JSON.parse(dataBank);
      let bankData = null;



      if (dataCompanyResult) {
        let formDaData
        if (typeOrg === 'ИП') {
          formDaData = {
            carrier_inn: formData.carrier_inn,
            carrier_name: companyData.name.full,
            carrier_contactPerson: companyData.name.full,
            carrier_ogrnip: companyData.ogrn,
            carrier_postalСode: companyData.address.data.postal_code,
            carrier_city: companyData.address.data.city,
            carrier_street: companyData.address.data.street_with_type,
            carrier_building: `${companyData.address.data.house_type} ${companyData.address.data.house} ${companyData.address.data.block_type} ${companyData.address.data.block}`,
            carrier_office: companyData.address.data.flat,
            customer_org_type: companyData.opf.full,
            customer_org_type_short: companyData.opf.short
          };
        } else if (typeOrg === 'ООО') {
          formDaData = {
            carrier_inn: formData.carrier_inn,
            carrier_name: companyData.name.short,
            carrier_contactPerson: companyData.management.name,
            carrier_position: companyData.management.post,
            carrier_kpp: companyData.kpp,
            carrier_ogrn: companyData.ogrn,
            carrier_postalСode: companyData.address.data.postal_code,
            carrier_city: companyData.address.data.city,
            carrier_street: companyData.address.data.street_with_type,
            carrier_building: `${companyData.address.data.house_type} ${companyData.address.data.house} ${companyData.address.data.block_type} ${companyData.address.data.block}`,
            carrier_office: companyData.address.data.flat,
            customer_org_type: companyData.opf.full,
            customer_org_type_short: companyData.opf.short
          };
        }

        if (dataBankResult && dataBankResult.suggestions && dataBankResult.suggestions.length > 0 && dataBankResult.suggestions[0].data) {
          bankData = dataBankResult.suggestions[0].data;

          if (Object.keys(dataBankResult).length > 0) {
            formDaData.carrier_bic  = bankData.bic || '';
            formDaData.carrier_bank = dataBankResult.suggestions[0].value || '';
            formDaData.carrier_ks   = bankData.correspondent_account || '';
            formDaData.carrier_rs   = bankData.treasury_accounts?.[0] || '';
          }
        }

        setFormData(formDaData);
      }
    } else if (type === 'company') {
        const getCompanyByINN = EntityAPI.fetchCompanyByINN;
        const dataCompany = await getCompanyByINN(formData.inn);
        const dataCompanyResult = JSON.parse(dataCompany);
        const companyData = dataCompanyResult.suggestions[0].data;


        const getBankDataByINN = EntityAPI.fetchBankDataByINN;
        const dataBank = await getBankDataByINN(formData.inn);
        const dataBankResult = JSON.parse(dataBank);
        let bankData = null;


        if (dataCompanyResult) {
          let formDaData
          if (typeOrg === 'ИП') {
            formDaData = {
              inn: formData.inn,
              name: companyData.name.full,
              contactPerson: companyData.name.full,
              ogrnip: companyData.ogrn,
              postalСode: companyData.address.data.postal_code,
              city: companyData.address.data.city,
              street: companyData.address.data.street_with_type,
              building: `${companyData.address.data.house_type} ${companyData.address.data.house} ${companyData.address.data.block_type} ${companyData.address.data.block}`,
              office: companyData.address.data.flat,
              customer_org_type: companyData.opf.full,
              customer_org_type_short: companyData.opf.short
            };
          } else if (typeOrg === 'ООО') {
            formDaData = {
              inn: formData.inn,
              name: companyData.name.short,
              contactPerson: companyData.management.name,
              position: companyData.management.post,
              kpp: companyData.kpp,
              ogrn: companyData.ogrn,
              postalСode: companyData.address.data.postal_code,
              city: companyData.address.data.city,
              street: companyData.address.data.street_with_type,
              building: `${companyData.address.data.house_type} ${companyData.address.data.house} ${companyData.address.data.block_type} ${companyData.address.data.block}`,
              office: companyData.address.data.flat,
              customer_org_type: companyData.opf.full,
              customer_org_type_short: companyData.opf.short
            };
          }


          if (dataBankResult && dataBankResult.suggestions && dataBankResult.suggestions.length > 0 && dataBankResult.suggestions[0].data) {
            bankData = dataBankResult.suggestions[0].data;

            if (Object.keys(dataBankResult).length > 0) {
              formDaData.bic  = bankData.bic || '';
              formDaData.bank = dataBankResult.suggestions[0].value || '';
              formDaData.ks   = bankData.correspondent_account || '';
              formDaData.rs   = bankData.treasury_accounts?.[0] || '';
            }
          }

          setFormData(formDaData);
      }
    }
  };


  const renderInputFields = () => (
    Object.keys(labels).map((key) => {
      if (typeOrg === 'ИП') {
        if (key === 'carrier_kpp') return
        if (key === 'kpp') return
        if (key === 'ogrn') return
        if (key === 'carrier_ogrn') return
      }
      if (typeOrg === 'ООО') {
        if (key === 'ogrnip') return
        if (key === 'carrier_ogrnip') return
      }
      return (
          <InfoLine key={key} style={{marginTop: '10px'}}>
            <LineContainerLeft>{labels[key]}</LineContainerLeft>
            <LineContainerRight>
              <InputSave
                  type="text"
                  value={formData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </LineContainerRight>
          </InfoLine>
      )
    })
  );

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <InfoLine style={{ marginBottom: '20px' }}>
          <LineContainerLeft style={{ fontWeight: 'bold' }}>
            Добавление в базу: {type === 'contact' ? 'Водитель' : type === 'carrier' ? 'Сущность перевозчика' : 'Сущность компании'}
          </LineContainerLeft>
          <LineContainerRight style={{ flex: 0 }}>
            <CustomButton text="Закрыть" color="red" onClick={onClose} style={{ width: '70px' }} />
          </LineContainerRight>
        </InfoLine>

        { typeOrg && <div style={{ display: 'flex', gap: '20px'}}>
          <CustomButton text="Поменять тип" color="green" onClick={handleSwitch} style={{ padding: '0 5px' }} />
          <LineContainerRight>
              <CustomButton
                  text="Найти в Dadata"
                  padding={'6px'}
                  color={'blue'}
                  onClick={handleFindDadata}
                  style={{
                    width: '150px'
                  }}
              />
          </LineContainerRight>

        </div> }

        <div style={{ marginTop: '15px' }}>
          <p style={{ fontWeight: 'bold' }}>Обязательные поля:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderInputFields()}
          </div>
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
