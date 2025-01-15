
import React, { useEffect, useState, useRef } from 'react';

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
} from '../Contract/DocsContainer.style';

// components
import CustomFields from '../CustomFields/CustomFields';
import FilesContainer from '../FilesContainer/FilesContainer';
import CustomButton from '../../../../components/CustomButton/CustomButton'


const DocsLabels = {
  dogovor: {
    name: 'Договор',
    fields: [
      { nameId: 'tip_dostavki',   id: 133147, typeValue: 'select',    name: 'Тип доставки' }, 
      { nameId: 'vid_transporta', id: 133151, typeValue: 'select',    name: 'Вид транспорта' },
      { nameId: 'vid_oplati',     id: 133373, typeValue: 'select',    name: 'Форма оплаты' }, 
      { nameId: 'gde_oplata',     id: 179095, typeValue: 'select',    name: 'Оплата в' }, // форма оплаты
      
      { nameId: 'dostavka_do',    id: 133153, typeValue: 'select',    name: 'Адрес/дверь' },

      { nameId: 'otkuda',         id: 179029, typeValue: 'select',    name: 'Откуда' },
      { nameId: 'otkuda_tochno',  id: 1275901, typeValue: 'textarea',  name: 'Откуда точно' },
      
      { nameId: 'kuda',           id: 179035, typeValue: 'select',    name: 'Куда' },
      { nameId: 'kuda_tochno',    id: 179037, typeValue: 'textarea',  name: 'Куда точно' },

      { nameId: 'adress_dostavki',id: 1586685, typeValue: 'text',      name: 'Адрес доставки' },

      { nameId: 'harakter_gruza', id: 1584461, typeValue: 'select',    name: 'Характер груза' },
      { nameId: 'vid_upakovki',   id: 179501, typeValue: 'textarea',  name: 'Вид упаковки' },
      { nameId: 'kolvo_mest',     id: 179505, typeValue: 'number',    name: 'Кол-во мест' }, // максимум 28 может быть число (от 1 до 28)
    
      { nameId: 'ves_gruza',      id: 133421, typeValue: 'number',    name: 'Вес груза' },
      { nameId: 'obem_gruza',     id: 133433, typeValue: 'number',    name: 'Объём  груза' },
    ],
    typeDocs: 'dogovor',
    createDocs: DocsAPI.createDogovor,
    files: 'dogovor__list_docs'
  }
};

const customFields = [
  { name: 'Отправитель',  entity: 'sender'    },
  { name: 'Получатель',   entity: 'recipient' },
  { name: 'Плательщик',   entity: 'payer'     }
];


const DogovorContainer = ({ type }) => {
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [dataDocs, setDataDocs] = useState(null);
  const { name, fields } = DocsLabels[type];

  const [summTotal, setSummTotal] = useState(0);

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

    const contractListDocs = document.querySelector('.dogovor_fields__container');
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

  const fetchDataInfo = async () => {
    const fetchInfoDocs = DocsAPI.fetchDocsInfo;
    const dataInfoDocs = await fetchInfoDocs(DocsLabels[type].typeDocs);
    setDataDocs(dataInfoDocs);
    console.log('dataInfoDocs', dataInfoDocs);

    const latestDoc = dataInfoDocs.docs.reduce((latest, current) => {
      return current.timestamp > latest.timestamp ? current : latest;
    }, dataInfoDocs.docs[0]); // Добавим начальное значение для `reduce`, чтобы избежать ошибок, если массив пустой.
    
    const latestName = latestDoc ? latestDoc.name : undefined;

    if (latestName !== undefined) {
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
        updateInputValue('1447475', latestName);
    }
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

    const observer3 = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const element = document.querySelector('.services__total');
          if (element) {
            const number = parseInt(element.textContent.match(/\d+/)[0], 10);
            console.log(number);
            setSummTotal(number)
            break;
          }
        }
      }
    });

    observer1.observe(document.documentElement, { childList: true, subtree: true });
    observer3.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      observer1.disconnect(); // Очистка при размонтировании
      observer3.disconnect(); // Очистка при размонтировании
    };
  }, []);

  useEffect(() => {
    checkAllFieldsFilled(entities);
  }, [fieldValues, entities]);


  const handleGenerateDogovor = async () => {

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

    let dataName = null;

    const nameElement = document.querySelector(`input[name="CFV[1447475]"]`);
    if (nameElement) {
      let value = nameElement.value;
      if (!value) {
        dataName = 'ignore'; 
      } else {
        dataName = value;
      }
    }

    let otherText = null;

    const otherElement = document.querySelector(`input[name="CFV[1584463]"]`);
    if (otherElement) {
      let value = otherElement.value;
      if (!value) {
        otherText = 'ignore'; 
      } else {
        otherText = value;
      }
    }

    setIsLoading(true); // установить состояние загрузки
    const combinedData = {
      entities,
      fields: fieldValues,
      summTotal: summTotal,
      dataReal: dataReal,
      otherText: otherText,
      dataName: dataName
    };
    console.log(combinedData);
    

    if (allFieldsFilled) {
      const postData = async () => {
        const postDataDocs = DocsLabels[type].createDocs;
        await postDataDocs(combinedData);
        await fetchDataInfo();
      }
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
        onClick={handleGenerateDogovor}
        style={{
          width: '230px',
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
        
        <div className="dogovor_fields__container">
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

export default DogovorContainer;
