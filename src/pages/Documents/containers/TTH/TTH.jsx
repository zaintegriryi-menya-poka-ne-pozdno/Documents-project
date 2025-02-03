
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
  tth: {
    name: 'ТТН',
    fields: [
      { nameId: 'exemp_number',id: 1277157, typeValue: 'text',      name: 'Экземпляр' },
      { nameId: 'is_expedit',   id: 1277159, typeValue: 'select',    name: 'Является экспедитором' },
      { nameId: 'delivery_adress',id: 1279395, typeValue: 'text',      name: 'Адрес доставки' },
      { nameId: 'cargo_info',id: 1277163, typeValue: 'text',      name: 'Груз' },
      { nameId: 'cargo_mass',id: 1277165, typeValue: 'text',      name: 'Масса груза' },
      { nameId: 'delivery_route_time',id: 1277167, typeValue: 'text',      name: 'Маршрут доставки' },
      { nameId: 'deliver_reqs',id: 1277169, typeValue: 'text',      name: 'Перевозчик (организация инн адрес тел)' },
      { nameId: 'load_place',id: 1277171, typeValue: 'text',      name: 'Адрес места погрузки' },
      { nameId: 'unload_data_time',id: 1277173, typeValue: 'text',      name: 'Заявленные дата и время подачи ТТН' },
      { nameId: 'cargo_extraction',id: 1277175, typeValue: 'text',      name: 'Адрес места выгрузки' },
      { nameId: 'cargo_extraction_data_time',id: 1277177, typeValue: 'text',      name: 'Заявленные дата и время выгрузки ТТН' },
    ],
    typeDocs: 'tth',
    createDocs: DocsAPI.createTTH,
    files: 'tth__list_docs'
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

const TTHContainer = ({ type }) => {
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
    const inputElement = document.querySelector(`input[name="CFV[1277137]"]`);
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


  const handleGenerateTTH  = async () => {
    const lead_id = document.querySelector('#add_tags')
    const id = Number(lead_id.querySelector('span').textContent.slice(1))

    const invoice = document.querySelector('input[name="CFV[1279355]"]')

    const lead = document.querySelector('#lead_main_user-users_select_holder')
    const lead_name = lead.querySelector('span').textContent
    const managers = window.AMOCRM.constant("managers")
    const matchedManager = Object.values(managers).find(manager => manager.title === lead_name)

    const client = document.querySelector('input[name="CFV[1276573]"]')

    const rawValue = client.value;
    const parsedValue = JSON.parse(rawValue);

    const driver = document.querySelector('input[name="CFV[1276575]"]')

    const rawValueD = driver.value;
    const parsedValueD = JSON.parse(rawValueD);

    const requestBody = {
      doc_type: "thh",
      filename: "ТНН_разраб_для.docx",
      amo_id: id,
      number: invoice.value,
      number_nakl: invoice.value,
      customer_reqs: `${parsedValue.name}, ${parsedValue.inn}, ${parsedValue.city} ${parsedValue.street} ${parsedValue.building} ${parsedValue.office}, ${parsedValue.company_phone}`,
      driver_reqs: `${parsedValueD.name}, ${parsedValue.inn}`,
      truck_info: parsedValueD.markaAvto,
      truck_number: parsedValueD.gosNomer,
      driver_signature: parsedValueD.name,
      economic_driver_reqs: `${parsedValue.name}, ${parsedValue.inn}`,
      economic_shipper_reqs: parsedValue.inn,
      exemp_number: fieldValues.exemp_number,
      is_expedit: fieldValues.is_expedit,
      delivery_adress: fieldValues.delivery_adress,
      cargo_info: fieldValues.cargo_info,
      cargo_mass: fieldValues.cargo_mass,
      delivery_route_time: fieldValues.delivery_route_time,
      deliver_reqs: fieldValues.deliver_reqs,
      load_place: fieldValues.load_place,
      unload_data_time: fieldValues.unload_data_time,
      mass_brutto: fieldValues.cargo_mass,
      cargo_different_mass: fieldValues.cargo_mass,
      cargo_extraction: fieldValues.cargo_extraction,
      cargo_extraction_data_time: fieldValues.cargo_extraction_data_time,
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
    const inputElement = document.querySelector(`input[name="CFV[1277137]"]`)
    if (inputElement) {
      updateInputValue('1277137', JSON.stringify(documents || []));
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
        <FilesContainer dataDocs={documents} name={'ТНН_разраб_для.docx'} />
      </Container>

      <CustomButton
        text={isLoading ? 'Загрузка...' : 'Сгенерировать ТНН'}
        padding={'4px'}
        color={allFieldsFilled ? 'green' : 'red'}
        onClick={handleGenerateTTH}
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

export default TTHContainer;
