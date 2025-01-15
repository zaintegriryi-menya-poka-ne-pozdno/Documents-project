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
import CustomButton from '../../../../components/CustomButton/CustomButton';

import {banks} from '../banks';

const DocsLabels = {
  check: {
    name: 'Счет на оплату',
    fields: [
      { nameId: 'bank',  id: 1276619, typeValue: 'select',  name: 'Банк' },
      
    ],
    typeDocs: 'check',
    createDocs: DocsAPI.createCheck,
    files: 'check__list_docs'
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

const CheckContainer = ({ type }) => {
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [dataDocs, setDataDocs] = useState(null);
  const { name, fields } = DocsLabels[type];
  const [documents, setDocuments] = useState([])

  const [summTotal, setSummTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [entities, setEntities] = useState({
    contact: {},
    company: {},
  });

  const [tableData, setTableData] = useState([]);

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

    const contractListDocs = document.querySelector('.check_fields__container');
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

  const loadTableData = () => {
    const inputElement = document.querySelector(`input[name="CFV[1276507]"]`);
    if (inputElement) {
      const savedData = inputElement.value;
      if (savedData) {
        setTableData(JSON.parse(savedData));
      }
    }
  };

  const loadDocuments = () => {
    const inputElement = document.querySelector(`input[name="CFV[1276965]"]`);
    if (inputElement) {
      const savedData = inputElement.value;
      setDocuments(savedData ? JSON.parse(savedData) : []);
    } else {
      setDocuments([]);
    }
  }

  useEffect(() => {
    fetchDataInfo();
    loadTableData();
    loadDocuments();

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

              observer1.disconnect();
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
            const numberMatch = element.textContent.match(/\d+/);
            if (numberMatch) {
              const number = parseInt(numberMatch[0], 10);
              console.log(number);
              setSummTotal(number);
            }
            break;
          }
        }
      }
    });

    observer1.observe(document.documentElement, { childList: true, subtree: true });
    observer3.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      observer1.disconnect();
      observer3.disconnect();
    };
  }, []);

  useEffect(() => {
    checkAllFieldsFilled(entities);
  }, [fieldValues, entities]);
// Генерация тела json для запроса
  const handleGenerateCheck = async () => {
    const lead = document.querySelector('#lead_main_user-users_select_holder')
    const lead_name = lead.querySelector('span').textContent
    const managers = window.AMOCRM.constant("managers")
    const matchedManager = Object.values(managers).find(manager => manager.title === lead_name)

    const lead_id = document.querySelector('#add_tags')
    const id = Number(lead_id.querySelector('span').textContent.slice(1))

    const invoice = document.querySelector('#person_n').textContent

    const selected_bank = banks.find(bank => bank.name === fieldValues.bank.trim())

    const services = tableData.map((item, index) => {
      return {
        number: (index + 1).toString(),
        accomodation: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price
      }
    })

    const client = document.querySelector('input[name="CFV[1276573]"]')

    const rawValue = client.value;
    const parsedValue = JSON.parse(rawValue);

    const requestBody = {
      doc_type: "bill",
      filename: "Счёт_на_оплату_для.docx",
      amo_id: id,
      phone: matchedManager.phone,
      mail: matchedManager.login,
      invoice_number: invoice,
      bank_adress: selected_bank.bank_adress,
      biq: selected_bank.biq,
      korr_bill: selected_bank.korr_bill,
      raschetny_bill: selected_bank.raschetny_bill,
      customer: parsedValue.name,
      inn: parsedValue.inn,
      kpp: parsedValue.kpp,
      postal_code: parsedValue.postalСode,
      city: parsedValue.city,
      street: parsedValue.street,
      building: parsedValue.building,
      office: parsedValue.office,
      services,
    };

    //console.log(JSON.stringify(requestBody, null, 2))

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

  const handleAddRow = () => {
    setTableData([...tableData, { name: '', quantity: '', unit: '', price: '', total: '' }]);
  };

  const handleRemoveRow = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const handleSaveTable = () => {
    const inputElement = document.querySelector(`input[name="CFV[1276507]"]`);
    if (inputElement) {
      updateInputValue('1276507', JSON.stringify(tableData));
    }
  };

  const handleUpdateDocuments = () => {
    const inputElement = document.querySelector(`input[name="CFV[1276965]"]`)
    if (inputElement) {
      updateInputValue('1276965', JSON.stringify(documents || []));
    }
  }

  const handleTableChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

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
          <FilesContainer dataDocs={documents} />
        </Container>

        <CustomButton
          text={isLoading ? 'Загрузка...' : 'Сгенерировать счет '}
          padding={'4px'}
          color={allFieldsFilled ? 'green' : 'red'}
          onClick={handleGenerateCheck}
          style={{
            width: '230px',
            margin: '15px 0 15px 0',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'progress' : 'pointer'
          }}
          disabled={isLoading}
        />

        <Container style={{ padding: '5px 10px 10px 10px', borderRadius: '6px' }}>
          
          <div style={{ marginTop: '5px', marginBottom: '5px' }}>
          {customFields.map((field, index) => (
            <ContainerHeader key={index} style={{ color: getEntityName(field.entity) !== 'данные отсутствуют' ? 'green' : 'red' }}>
              <ContainerLeft style={{ flex: 4 }}>
                {field.name}
              </ContainerLeft>
              <ContainerRight style={{ flex: 7, justifyContent: 'flex-start', paddingLeft: '8px' }}>
                {getEntityName(field.entity)}
              </ContainerRight>
            </ContainerHeader>
          ))}
          </div>

          
          <div className="check_fields__container">
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
      overflowX: 'hidden' 
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        textAlign: 'left', 
        maxWidth: '100%', 
        fontSize: '12px' 
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '10px' }}>№</th>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '120px' }}>Наименование работ, услуг</th>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '30px' }}>Кол-во</th>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '40px' }}>Ед. изм.</th>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Цена</th>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '50px' }}>Сумма</th>
            <th style={{ border: '1px solid #ddd', padding: '6px', minWidth: '20px' }}></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ddd', padding: '6px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleTableChange(index, 'name', e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                <input
                  type="text"
                  value={row.quantity}
                  onChange={(e) => handleTableChange(index, 'quantity', e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                <input
                  type="text"
                  value={row.unit}
                  onChange={(e) => handleTableChange(index, 'unit', e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                <input
                  type="text"
                  value={row.price}
                  onChange={(e) => handleTableChange(index, 'price', e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                <input
                  type="text"
                  value={row.total}
                  onChange={(e) => handleTableChange(index, 'total', e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', appearance: 'none', MozAppearance: 'textfield',WebkitAppearance: 'none' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                <div onClick={() => handleRemoveRow(index)} style={{ cursor: 'pointer' }}>✖</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <div onClick={handleAddRow} style={{ cursor: 'pointer', color: 'blue' }}>Добавить запись</div>
        {tableData.length > 0 && (
          <div onClick={handleSaveTable} style={{ cursor: 'pointer', color: 'green' }}>Сохранить</div>
        )}
      </div>
    </Container>
    </div>
  )
};

export default CheckContainer;
