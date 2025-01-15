
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
  clientrequest: {
    name: 'Заявка с клиентом',
    fields: [
      { nameId: 'dogovor_date',  id: 1277055, typeValue: 'text',  name: 'Дата договора' },
      { nameId: 'doroga',  id: 1277047, typeValue: 'text',  name: 'Дорога' },
      { nameId: 'price',  id: 1277049, typeValue: 'text',  name: 'Цена' },
      { nameId: 'preprice',  id: 1277051, typeValue: 'text',  name: 'Предоплата' },
      { nameId: 'times_ways_to_pay',  id: 1277053, typeValue: 'text',  name: 'Сроки и условия оплаты' },
      { nameId: 'dop_info',  id: 1277059, typeValue: 'text',  name: 'Дополнительная информация' },
    ],
    typeDocs: 'clientrequest',
    createDocs: DocsAPI.createClientRequest,
    files: 'clientrequest__list_docs'
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


const ClientRequestContainer = ({ type }) => {
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

  const [services_1, setServices_1] = useState([]);
  const [services_2, setServices_2] = useState([]);
  const [services_3, setServices_3] = useState([]);

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

  const loadServices_1 = () => {
    const inputElement = document.querySelector(`input[name="CFV[1276961]"]`);
    if (inputElement) {
      const savedData = inputElement.value;
      if (savedData) {
        setServices_1(JSON.parse(savedData));
      }
    }
  };

  const loadServices_2 = () => {
    const inputElement = document.querySelector(`input[name="CFV[1277033]"]`);
    if (inputElement) {
      const savedData = inputElement.value;
      if (savedData) {
        setServices_2(JSON.parse(savedData));
      }
    }
  };

  const loadServices_3 = () => {
    const inputElement = document.querySelector(`input[name="CFV[1277035]"]`);
    if (inputElement) {
      const savedData = inputElement.value;
      if (savedData) {
        setServices_3(JSON.parse(savedData));
      }
    }
  };

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
    loadServices_1()
    loadServices_2()
    loadServices_3()
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


  const handleGenerateClientRequest  = async () => {
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

  const handleAddRowServices_1 = () => {
    setServices_1([...services_1, { sender_time: '', cargo_sender_get: '', address_get: '', contact_get: '', smth_else_get: '' }]);
  };

  const handleRemoveRowServices_1 = (index) => {
    const newData = services_1.filter((_, i) => i !== index);
    setServices_1(newData);
  };

  const handleSaveTableServices_1 = () => {
    const inputElement = document.querySelector(`input[name="CFV[1276961]"]`);
    if (inputElement) {
      updateInputValue('1276961', JSON.stringify(services_1));
    }
  };

  const handleAddRowServices_2 = () => {
    setServices_2([...services_2, { getter_time: '', cargo_sender_give: '', address_give: '', contact_give: '', smth_else_give: '' }]);
  };

  const handleRemoveRowServices_2 = (index) => {
    const newData = services_2.filter((_, i) => i !== index);
    setServices_2(newData);
  };

  const handleSaveTableServices_2 = () => {
    const inputElement = document.querySelector(`input[name="CFV[1277033]"]`);
    if (inputElement) {
      updateInputValue('1277033', JSON.stringify(services_2));
    }
  };

  const handleAddRowServices_3 = () => {
    setServices_3([...services_3, { cargo_name: '', cargo_mass: '', cargo_objom: '', cargo_gabarits: '', cargo_places: '', cargo_ways: '' }]);
  };

  const handleRemoveRowServices_3 = (index) => {
    const newData = services_3.filter((_, i) => i !== index);
    setServices_3(newData);
  };

  const handleSaveTableServices_3 = () => {
    const inputElement = document.querySelector(`input[name="CFV[1277035]"]`);
    if (inputElement) {
      updateInputValue('1277035', JSON.stringify(services_3));
    }
  };

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

  const handleTableChangeServices_1 = (index, field, value) => {
    const newData = [...services_1];
    newData[index][field] = value;
    setServices_1(newData);
  };

  const handleTableChangeServices_2 = (index, field, value) => {
    const newData = [...services_2];
    newData[index][field] = value;
    setServices_2(newData);
  };

  const handleTableChangeServices_3 = (index, field, value) => {
    const newData = [...services_3];
    newData[index][field] = value;
    setServices_3(newData);
  };

  return (
      <div>
        <Container>
          <ContainerHeader style={{ marginBottom: '15px' }}>
            <ContainerLeft style={{ fontWeight: 'bold', fontSize: '16px' }}>{name}</ContainerLeft>
            <ContainerRight>Sett.</ContainerRight>
          </ContainerHeader>

          <Container
              style={{ padding: '5px 10px 10px 10px', borderRadius: '6px' }}
              className={DocsLabels[type].files}
          >
            <FilesContainer dataDocs={documents} name={'Заявка_по_договору_с_клиентом_для.docx'} />
          </Container>

          <CustomButton
              text={isLoading ? 'Загрузка...' : 'Сгенерировать заявку'}
              padding={'4px'}
              color={allFieldsFilled ? 'green' : 'red'}
              onClick={handleGenerateClientRequest}
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

        <Container style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '17px',
          borderRadius: '11px',
          border: '1px solid #ABABAB',
          overflowX: 'hidden',
          marginTop: '10px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            maxWidth: '100%',
            fontSize: '12px',
            overflowX: 'auto'
          }}>
            <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '10px' }}>№</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '120px' }}>Время отгрузки</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '30px' }}>Отправитель</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '40px' }}>Адрес отгрузки</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Телефон</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Примечание</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '20px' }}></th>
            </tr>
            </thead>
            <tbody>
            {services_1.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '6px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    <input
                        type="text"
                        value={row.sender_time}
                        onChange={(e) => handleTableChangeServices_1(index, 'sender_time', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_sender_get}
                        onChange={(e) => handleTableChangeServices_1(index, 'cargo_sender_get', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.address_get}
                        onChange={(e) => handleTableChangeServices_1(index, 'address_get', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.contact_get}
                        onChange={(e) => handleTableChangeServices_1(index, 'contact_get', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.smth_else_get}
                        onChange={(e) => handleTableChangeServices_1(index, 'smth_else_get', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                    <div onClick={() => handleRemoveRowServices_1(index)} style={{ cursor: 'pointer' }}>✖</div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div onClick={handleAddRowServices_1} style={{ cursor: 'pointer', color: 'blue' }}>Добавить запись</div>
            {services_1.length > 0 && (
                <div onClick={handleSaveTableServices_1} style={{ cursor: 'pointer', color: 'green' }}>Сохранить</div>
            )}
          </div>
        </Container>

        <Container style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '17px',
          borderRadius: '11px',
          border: '1px solid #ABABAB',
          overflowX: 'hidden',
          marginTop: '10px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            maxWidth: '100%',
            fontSize: '12px',
            overflowX: 'auto'
          }}>
            <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '10px' }}>№</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '120px' }}>Время разгрузки</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '30px' }}>Получатель</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '40px' }}>Адрес разгрузки</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Телефон</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Примечание</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '20px' }}></th>
            </tr>
            </thead>
            <tbody>
            {services_2.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '6px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    <input
                        type="text"
                        value={row.getter_time}
                        onChange={(e) => handleTableChangeServices_2(index, 'getter_time', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_sender_give}
                        onChange={(e) => handleTableChangeServices_2(index, 'cargo_sender_give', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.address_give}
                        onChange={(e) => handleTableChangeServices_2(index, 'address_give', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.contact_give}
                        onChange={(e) => handleTableChangeServices_2(index, 'contact_give', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.smth_else_give}
                        onChange={(e) => handleTableChangeServices_2(index, 'smth_else_give', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                    <div onClick={() => handleRemoveRowServices_2(index)} style={{ cursor: 'pointer' }}>✖</div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div onClick={handleAddRowServices_2} style={{ cursor: 'pointer', color: 'blue' }}>Добавить запись</div>
            {services_2.length > 0 && (
                <div onClick={handleSaveTableServices_2} style={{ cursor: 'pointer', color: 'green' }}>Сохранить</div>
            )}
          </div>
        </Container>

        <Container style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '17px',
          borderRadius: '11px',
          border: '1px solid #ABABAB',
          overflowX: 'hidden',
          marginTop: '10px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            maxWidth: '100%',
            fontSize: '12px',
            overflowX: 'auto'
          }}>
            <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '10px' }}>№</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '120px' }}>Название товара</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '30px' }}>Масса</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '40px' }}>Обджорм</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Габариты</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Места</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>способ разгрузки/выгрузки</th>
              <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '20px' }}></th>
            </tr>
            </thead>
            <tbody>
            {services_3.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '6px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    <input
                        type="text"
                        value={row.cargo_name}
                        onChange={(e) => handleTableChangeServices_3(index, 'cargo_name', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_mass}
                        onChange={(e) => handleTableChangeServices_3(index, 'cargo_mass', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_objom}
                        onChange={(e) => handleTableChangeServices_3(index, 'cargo_objom', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_gabarits}
                        onChange={(e) => handleTableChangeServices_3(index, 'cargo_gabarits', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_places}
                        onChange={(e) => handleTableChangeServices_3(index, 'cargo_places', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                    <input
                        type="text"
                        value={row.cargo_ways}
                        onChange={(e) => handleTableChangeServices_3(index, 'cargo_ways', e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                    <div onClick={() => handleRemoveRowServices_3(index)} style={{ cursor: 'pointer' }}>✖</div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div onClick={handleAddRowServices_3} style={{ cursor: 'pointer', color: 'blue' }}>Добавить запись</div>
            {services_3.length > 0 && (
                <div onClick={handleSaveTableServices_3} style={{ cursor: 'pointer', color: 'green' }}>Сохранить</div>
            )}
          </div>
        </Container>
      </div>
  )
};

export default ClientRequestContainer;
