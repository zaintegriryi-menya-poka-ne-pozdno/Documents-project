
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
  doverennost: {
    name: 'Доверенность',
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
    typeDocs: 'doverennost',
    createDocs: DocsAPI.createDoverennost,
    files: 'doverennost__list_docs'
  }
};

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

const customFields = [
  { name: 'Клиент',  entity: 'company'    },
  { name: 'Водитель',   entity: 'contact' }
];

const DoverennostContainer = ({ type }) => {
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [dataDocs, setDataDocs] = useState(null);
  const { name, fields } = DocsLabels[type];
  const [documents, setDocuments] = useState([])

  const [summTotal, setSummTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false); // новое состояние

  const [entities, setEntities] = useState({
    contact: {},
    company: {},
  });

  const extractEntities = () => {
    const newEntities = {
      contact: {},
      company: {},
    };

    document.querySelectorAll('.entity__company, .entity__contact').forEach(entity => {
      const entityClass = entity.classList.contains('entity__contact') ? 'contact' :
          entity.classList.contains('entity__company') ? 'company' : '';

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

    const contractListDocs = document.querySelector('.clientrequest_fields__container');
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
    }, dataInfoDocs.docs[0]);

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

  const loadDocuments = () => {
    const inputElement = document.querySelector(`input[name="CFV[1277037]"]`);
    if (inputElement) {
      const savedData = inputElement.value;
      setDocuments(savedData ? JSON.parse(savedData) : []);
    } else {
      setDocuments([]);
    }
  }

  useEffect(() => {
    fetchDataInfo()
    loadDocuments()

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


  const handleGenerateDoverennost  = async () => {
    const lead = document.querySelector('#lead_main_user-users_select_holder')
    const lead_name = lead.querySelector('span').textContent
    const managers = window.AMOCRM.constant("managers")
    const matchedManager = Object.values(managers).find(manager => manager.title === lead_name)

    const lead_id = document.querySelector('#add_tags')
    const id = Number(lead_id.querySelector('span').textContent.slice(1))

    const invoice = document.querySelector('#person_n').textContent

    const client = document.querySelector('input[name="CFV[1276573]"]')

    const rawValue = client.value;
    const parsedValue = JSON.parse(rawValue);

    const driver = document.querySelector('input[name="CFV[1276575]"]')

    const rawValueD = driver.value;
    const parsedValueD = JSON.parse(rawValueD);

    const requestBody = {
      doc_type: "client_request",
      filename: "Заявка_по_договору_с_клиентом_для.docx",
      amo_id: id,
      phone: matchedManager.phone,
      mail: matchedManager.login,
      number: invoice,
      dogovor_number: invoice,
      dogovor_date: fieldValues.dogovor_date,
      doroga: fieldValues.doroga,
      price: fieldValues.price,
      preprice: fieldValues.preprice,
      times_ways_to_pay: fieldValues.times_ways_to_pay,
      driver: parsedValueD.name,
      driver_passport: `${parsedValueD.series} ${parsedValueD.number}`,
      driver_number: parsedValueD.phone,
      truck_type: parsedValueD.TipTS,
      truck: parsedValueD.markaAvto,
      truck_gos_number: parsedValueD.gosNomer,
      pricep: parsedValueD.TipPricepa,
      pricep_gos_number: parsedValueD.pp,
      customer_company: parsedValue.name,
      customer_director_name: parsedValue.contactPerson,
      customer_inn: parsedValue.inn,
      customer_kpp: parsedValue.kpp,
      dop_info: fieldValues.dop_info,
      services_1,
      services_2,
      services_3
    };

    console.log(JSON.stringify(requestBody, null, 2))

    setIsLoading(true);

    try {
      const response = await fetch('https://24virteg.ru/api/generate-docx/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      await setDocuments(prev => Array.isArray(prev)
          ? [...prev, `https://24virteg.ru/api/get-docx/?document_id=${responseData.document_id}&amo_id=${responseData.amo_id}`]
          : [`https://24virteg.ru/api/get-docx/?document_id=${responseData.document_id}&amo_id=${responseData.amo_id}`]
      );

    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleUpdateDocuments();
  }, [documents]);

  const handleUpdateDocuments = () => {
    const inputElement = document.querySelector(`input[name="CFV[1277037]"]`)
    if (inputElement) {
      updateInputValue('1277037', JSON.stringify(documents || []));
    }
  }

  const getEntityName = (entityType) => {
    const targetInputName = entityType === 'contact' ? 'CFV[1276575]' : 'CFV[1276573]';
    const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
    if (targetInput && targetInput.value) {
      const entityData = JSON.parse(targetInput.value);
      return entityData.name || 'данные отсутствуют';
    }
    return 'данные отсутствуют';
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
        text={isLoading ? 'Загрузка...' : 'Сгенерировать экспед. расписку'}
        padding={'4px'}
        color={allFieldsFilled ? 'green' : 'red'}
        onClick={handleGenerateDoverennost}
        style={{
          width: '230px',
          margin: '15px 0 15px 0',
          opacity: isLoading ? 0.7 : 1, // уменьшить прозрачность кнопки во время загрузки
          cursor: isLoading ? 'progress' : 'pointer' // изменить курсор во время загрузки
        }}
        disabled={isLoading} // отключить кнопку во время загрузки
      />

      <Container style={{ padding: '5px 10px 10px 10px', borderRadius: '6px' }}>

        <div style={{marginTop: '5px', marginBottom: '5px'}}>
          {customFields.map((field, index) => (
              <ContainerHeader key={index}
                               style={{color: getEntityName(field.entity) !== 'данные отсутствуют' ? 'green' : 'red'}}>
                <ContainerLeft style={{flex: 4}}>
                  {field.name}
                </ContainerLeft>
                <ContainerRight style={{flex: 7, justifyContent: 'flex-start', paddingLeft: '8px'}}>
                  {getEntityName(field.entity)}
                </ContainerRight>
              </ContainerHeader>
          ))}
        </div>

        <div className="clientrequest_fields__container">
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

export default DoverennostContainer;
