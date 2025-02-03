
import config from "./config";

const EntityAPI = {
  
  findContact: async (number) => {
    
    const cleanedNumber = number.replace(/[^\d]/g, '');
    let formattedNumber = cleanedNumber.replace(/^8/, '7');
    if (/^9\d{9}$/.test(formattedNumber)) {
      formattedNumber = '7' + formattedNumber;
    }

    try {
      const response = await fetch(config.url + `/findContact.php?phone=${formattedNumber}`);
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error('Error fetching contact details:', error);
    }
  },

  findCompany: async (inn) => {
    try {
      const response = await fetch(config.url + `/findCompany.php?query=${inn}`);
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error('Error fetching company details:', error);
    }
  },

  saveEntityData: async (entityData, role) => {

    console.log("entityData в api", entityData);

    const urlId = window.location.href;

    const getDealIdFromUrl = (_urlId) => {
      const match = _urlId.match(/\/leads\/detail\/(\d+)/);
      return match ? match[1] : null;
    };

    const dealId = getDealIdFromUrl(urlId);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    console.log(JSON.stringify({ dealId, role, entityData }));
  
    const response = await fetch(config.url + `/entities/saveEntityData.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dealId, role, entityData })
    });
  
    const result = await response.json();
    console.log(result);
  },

  fetchDataDetails: async (role) => {

    const urlId = window.location.href;

    const getDealIdFromUrl = (_urlId) => {
      const match = _urlId.match(/\/leads\/detail\/(\d+)/);
      return match ? match[1] : null;
    };
  
    const dealId = getDealIdFromUrl(urlId);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    try {
      const response = await fetch(config.url + `/entities/getEntityData.php?dealId=${dealId}&role=${role}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  fetchCompanyByINN: async (inn) => {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
    const token = "dc000f8082ea1ec24737ab0d6db8cd94b2901191";
    const query = inn;

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({ query })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log("result", JSON.parse(result));
      return result;
    } catch (error) {
      console.log("error", error);
    }
  },

  fetchBankDataByINN: async (inn) => {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/bank";
    const token = "dc000f8082ea1ec24737ab0d6db8cd94b2901191";
    const query = inn;

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({ query })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      return result;
    } catch (error) {
      console.log("error", error);
    }
  },

  saveEntity: async (dataForSave) => {
    try {
      const response = await fetch(config.url + '/saveContact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataForSave),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Entity saved successfully');
      } else {
        alert('Error saving entity: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  },

  editEntity: async (formData) => {
    try {
      const response = await fetch(config.url + '/editContact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Entity edited successfully');
      } else {
        alert('Error edited entity: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  
};

export default EntityAPI;

