
import config from "./config";

const ServicesAPI = {

  fetchServicesData: async () => {
    try {
      const response = await fetch(config.url + '/getServices.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("error", error);
    }
  },

  addService: async (newService) => {
    try {
      const response = await fetch(config.url + '/addService.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newService)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("error", error);
    }
  },

  deleteSelectedServices: async (selectedItems) => {
    try {
      const response = await fetch(config.url + '/deleteServices.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedItems: selectedItems })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting selected services:', error);
    }
  },

  saveUpdatedService: async (data) => {
    try {
      const response = await fetch(config.url + '/saveUpdatedServices.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  },

  addSelectedServicesToDeal: async (selectedItems) => {

    const getDealIdFromUrl = (_urlId) => {
      const match = _urlId.match(/\/leads\/detail\/(\d+)/);
      return match ? match[1] : null;
    };

    const urlId = window.location.href;
    const dealId = getDealIdFromUrl(urlId);
  
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }
  
    const requestData = {
      dealId: dealId,
      selectedItems: selectedItems
    };
  
    try {
      const response = await fetch(config.url + '/addSelectedServicesToDeal.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
    }
  },

  fetchServicesToDeal: async () => {

    const getDealIdFromUrl = (_urlId) => {
      const match = _urlId.match(/\/leads\/detail\/(\d+)/);
      return match ? match[1] : null;
    };

    const urlId = window.location.href;
    const dealId = getDealIdFromUrl(urlId);
  
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    try {
      const response = await fetch(config.url + `/getServicesToDeal.php?dealId=${dealId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
    }
  },

  saveUpdatedServiceToDeal: async (changedItems) => {

    const getDealIdFromUrl = (_urlId) => {
      const match = _urlId.match(/\/leads\/detail\/(\d+)/);
      return match ? match[1] : null;
    };

    const urlId = window.location.href;
    const dealId = getDealIdFromUrl(urlId);
  
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const requestData = {
      dealId: dealId,
      changedItems: changedItems
    };

    try {
      const response = await fetch(config.url + '/saveUpdatedServicesToDeal.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  },

  deleteSelectedServicesToDeal: async (selectedItems) => {

    const getDealIdFromUrl = (_urlId) => {
      const match = _urlId.match(/\/leads\/detail\/(\d+)/);
      return match ? match[1] : null;
    };

    const urlId = window.location.href;
    const dealId = getDealIdFromUrl(urlId);
  
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const requestData = {
      dealId: dealId,
      selectedItems: selectedItems
    };

    try {
      const response = await fetch(config.url + '/deleteServicesToDeal.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting selected services:', error);
    }
  }
  
};

export default ServicesAPI;

