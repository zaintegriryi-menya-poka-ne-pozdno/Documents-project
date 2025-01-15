
import config from "./config";

const getDealIdFromUrl = (_urlId) => {
  const match = _urlId.match(/\/leads\/detail\/(\d+)/);
  return match ? match[1] : null;
};

const getUserAuthor = () => {
  const userElement = document.querySelector('input[name="lead[MAIN_USER]"]');
  const userParent = userElement ? userElement.parentNode : null;
  const userName = userParent ? userParent.querySelector('span').textContent : null;
  return userName;
};


const DocsAPI = {
  
  createContract: async (data) => {
    
    const dealId = getDealIdFromUrl(window.location.href);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const userAuthor = getUserAuthor();

    const requestData = {
      data,
      dealId,
      type: 'contract',
      userAuthor: userAuthor
    };

    console.log(requestData);

    try {
      console.log('Запрос:', requestData); // Вывод запроса
      const response = await fetch(config.url + `/docs_php/contract/generate_doc.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error('Error generate contract:', error);
    }
  },

  createEksped: async (data) => {
    
    const dealId = getDealIdFromUrl(window.location.href);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const userAuthor = getUserAuthor();

    const requestData = {
      data,
      dealId,
      type: 'eksped',
      userAuthor: userAuthor
    };

    console.log(requestData);

    try {
      const response = await fetch(config.url + `/docs_php/eksped/generate_doc.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error('Error generate contract:', error);
    }
  },

  createLabel: async (data) => {
    
    const dealId = getDealIdFromUrl(window.location.href);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const userAuthor = getUserAuthor();

    const requestData = {
      data,
      dealId,
      type: 'label',
      userAuthor: userAuthor
    };

    console.log(requestData);

    try {
      const response = await fetch(config.url + `/docs_php/label/generate_doc.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error('Error generate label:', error);
    }
  },

  createAct: async (data, typeDoc) => {
    
    const dealId = getDealIdFromUrl(window.location.href);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const userAuthor = getUserAuthor();

    const requestData = {
      data,
      dealId,
      type: typeDoc,
      userAuthor: userAuthor
    };

    console.log(requestData);

    try {
      const response = await fetch(config.url + `/docs_php/act/generate_doc.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error('Error generate act:', error);
    }
  },

  createInvoice: async (data, typeDoc) => {
    
    const dealId = getDealIdFromUrl(window.location.href);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const userAuthor = getUserAuthor();

    const requestData = {
      data,
      dealId,
      type: typeDoc,
      userAuthor: userAuthor
    };

    console.log(requestData);

    try {
      const response = await fetch(config.url + `/docs_php/invoice/generate_doc.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error('Error generate invoice:', error);
    }
  },

  createKo: async (data) => {
    
    const dealId = getDealIdFromUrl(window.location.href);
    if (!dealId) {
      console.error("Invalid deal URL");
      return;
    }

    const userAuthor = getUserAuthor();

    const requestData = {
      data,
      dealId,
      type: 'ko',
      userAuthor: userAuthor
    };

    console.log(requestData);

    try {
      const response = await fetch(config.url + `/docs_php/ko/generate_doc.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error('Error generate contract:', error);
    }
  },

  fetchDocsInfo: async (typeDoc) => {

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
      const response = await fetch(config.url + `/docs_php/get_docs_info.php?dealId=${dealId}&type=${typeDoc}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching docs info:', error);
      return [];
    }
  }
  
};

export default DocsAPI;

