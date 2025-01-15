
import React, { useEffect, useState, useMemo } from 'react';

// utils
import DocsAPI from '../../../../utils/apiDocs';

// styles
import {
  Container,
  ContainerHeader,
  ContainerLeft,
  ContainerRight,
  ContainerCenter,
  InputSearch
} from './DocsContainer.style';

// components
import CustomFields from '../../containers/CustomFields/CustomFields';
import FilesContainer from '../../containers/FilesContainer/FilesContainer';
import CustomButton from '../../../../components/CustomButton/CustomButton'


const DocsLabels = {
  contract: {
    name: 'Договор',
    fields: [
      { nameId: 'vid_transporta', id: 133151,    typeValue: 'select', name: 'Вид транспорта' },
      { nameId: 'ves_gruza',      id: 133421,    typeValue: 'number', name: 'Вес груза' },
      { nameId: 'obem_gruza',     id: 133433,    typeValue: 'number', name: 'Объем груза' },
    ],
    typeDocs: 'contract',
    createDocs: DocsAPI.createContract,
    files: 'contract__list_docs'
  },
  ko: {
    name: 'Кассовый ордер'
  },
  label: {
    name: 'Этикетка'
  }
};

const customFields = [
  { name: 'Отправитель', entity: 'sender' },
  { name: 'Получатель',  entity: 'recipient' },
  { name: 'Плательщик',  entity: 'payer' }
];


const DocsContainer = ({ type }) => {
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [dataDocs, setDataDocs] = useState(null);
  const [plotnost, setPlotnost] = useState(null);
  const { name, fields } = DocsLabels[type];

  const [isLoading, setIsLoading] = useState(false); // новое состояние

  const [entities, setEntities] = useState({
    sender: {},
    recipient: {},
    payer: {},
  });

  const extractEntities = () => {
    const newEntities = {
      sender: {},
      recipient: {},
      payer: {},
    };

    document.querySelectorAll('.entity__sender, .entity__recipient, .entity__payer').forEach(entity => {
      const entityClass = entity.classList.contains('entity__sender') ? 'sender' :
        entity.classList.contains('entity__recipient') ? 'recipient' : 'payer';

      entity.querySelectorAll('[class*="entity__key__"]').forEach(item => {
        const key = item.className.split(' ').find(cls => cls.startsWith('entity__key__')).replace('entity__key__', '').toLowerCase();
        newEntities[entityClass][key] = item.textContent;
      });
    });

    setEntities(newEntities);
    checkAllFieldsFilled(newEntities);
  };

  const checkAllFieldsFilled = (newEntities) => {
    const areCustomFieldsFilled = customFields.every(field => Object.keys(newEntities[field.entity]).length > 0);
    
    let areFieldsFilled = false;

    const contractListDocs = document.querySelector('.contract_fields__container');
    if (contractListDocs) {
      const fieldElements = contractListDocs.querySelectorAll('[class*="field__biba_id_"]');
      areFieldsFilled = Array.from(fieldElements).every(field => {
        return field && field.textContent.trim() !== '' && field.textContent.trim() !== 'Выбрать';
      });
    } else {
      areFieldsFilled = false;
    }

    setAllFieldsFilled(areCustomFieldsFilled && areFieldsFilled);
  };

  const handleFieldChange = (id, value) => {
    setFieldValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));
    checkAllFieldsFilled(entities);
  };


  useEffect(() => {
    const vesGruza = fieldValues['ves_gruza'];
    const obemGruza = fieldValues['obem_gruza'];
    if (vesGruza && obemGruza) {
      const newPlotnost = vesGruza / obemGruza;
      setPlotnost(newPlotnost);
    }
  }, [fieldValues]);

  useEffect(() => {
    if (plotnost) {
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

      updateInputValue('179099', plotnost); //плотность
    }
  }, [plotnost]);


  const fetchDataInfo = async () => {
    const fetchInfoDocs = DocsAPI.fetchDocsInfo;
    const dataInfoDocs = await fetchInfoDocs(DocsLabels[type].typeDocs);
    setDataDocs(dataInfoDocs);
  }

  useEffect(() => {

    fetchDataInfo();

    const observer1 = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const element = document.querySelector('.entities');
          if (element) {

            extractEntities();

            const entitiesContainer = document.querySelector('.entities');
            if (entitiesContainer) {
              const observer2 = new MutationObserver(extractEntities);
              observer2.observe(entitiesContainer, { childList: true, subtree: true });

              observer1.disconnect(); // Останавливаем первый наблюдатель
              return () => observer2.disconnect();
            }

            observer1.disconnect();
            break;
          }
        }
      }
    });

    observer1.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      observer1.disconnect(); // Очистка при размонтировании
    };
  }, []);

  useEffect(() => {
    checkAllFieldsFilled(entities);
  }, [fieldValues, entities]);




  const handleGenerateContract = async () => {

    let dataReal = null;

    const dateElement = document.querySelector(`input[name="CFV[133081]"]`);
    if (dateElement) {
      let value = dateElement.value;
      if (!value) {
        dataReal = 'ignore'; 
      } else {
        dataReal = value;
      }
    }

    setIsLoading(true); // установить состояние загрузки
  
    // Извлекаем значение из элемента с атрибутом name="lead[PRICE]"
    const priceElement = document.querySelector('input[name="lead[PRICE]"]');
    const priceValue = priceElement ? priceElement.value : null;
  
    // Формируем объект с данными
    const combinedData = {
      entities,
      fields: fieldValues,
      price: priceValue,
      dataReal: dataReal
    };
  
    if (allFieldsFilled) {
      const postData = async () => {
        const postDataDocs = DocsLabels[type].createDocs;
        await postDataDocs(combinedData);
        await fetchDataInfo();
      };
  
      await postData();
    }
    
    setIsLoading(false); // установить состояние загрузки
  };
  





  return (
    <Container>

      <ContainerHeader style={{ marginBottom: '15px' }}>
        <ContainerLeft style={{ fontWeight: 'bold', fontSize: '16px' }}>{name}</ContainerLeft>
        <ContainerRight>Sett.</ContainerRight>
      </ContainerHeader>

      <Container
        style={{ padding: '5px 10px 10px 10px', borderRadius: '6px' }}
        className={DocsLabels[type].files}
      >
        <FilesContainer dataDocs={dataDocs} />
      </Container>

      <CustomButton
        text={isLoading ? 'Загрузка...' : 'Сгенерировать договор'}
        padding={'4px'}
        color={allFieldsFilled ? 'green' : 'red'}
        onClick={handleGenerateContract}
        style={{
          width: '180px',
          margin: '15px 0 15px 0',
          opacity: isLoading ? 0.7 : 1, // уменьшить прозрачность кнопки во время загрузки
          cursor: isLoading ? 'progress' : 'pointer' // изменить курсор во время загрузки
        }}
        disabled={isLoading} // отключить кнопку во время загрузки
      />

      <Container style={{ padding: '5px 10px 10px 10px', borderRadius: '6px' }}>
        
        <div style={{ marginTop: '5px', marginBottom: '5px' }}>
        {customFields.map((field, index) => (
          <ContainerHeader key={index} style={{ color: Object.keys(entities[field.entity]).length > 0 ? 'green' : 'red' }}>
            <ContainerLeft style={{ flex: 4 }}>
              {field.name}
            </ContainerLeft>
            <ContainerRight style={{ flex: 7, justifyContent: 'flex-start', paddingLeft: '8px' }}>
              {Object.keys(entities[field.entity]).length > 0 ? entities[field.entity].name : 'данные отсутствуют'}
            </ContainerRight>
          </ContainerHeader>
        ))}
        </div>
        
        <div className="contract_fields__container">
          {fields.map(field => (
            <ContainerHeader key={field.id}>
              <CustomFields
                id={field.id}
                type={field.typeValue}
                name={field.name}
                nameId={field.nameId}
                onFieldChange={handleFieldChange}
              />
            </ContainerHeader>
          ))}
        </div>
      </Container>

    </Container>
  )
};

export default DocsContainer;
