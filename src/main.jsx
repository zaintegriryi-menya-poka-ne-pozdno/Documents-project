import React from "react";
import ReactDOM from "react-dom/client";
import App from './app/App.jsx';

const Widget = {
	render(self) {

    // тут создание нового элемента

    const FormPayment_div = document.querySelector('.react-app-nortecdocs_12345');
    if (FormPayment_div)  { FormPayment_div.remove() }
    
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.setAttribute('class', 'react-app-nortecdocs_12345');

    ReactDOM.createRoot(
      div,
    ).render(
      <React.StrictMode>
        <App widget={self}/>
      </React.StrictMode>,
    );
    

		return true;
	},
	init() {

		return true;
	},
	bind_actions() {
		return true;
	},
	settings() {
		return true;
	},
	onSave() {
    return true;
  },
	destroy() {
    return true;
  },
};



export default Widget;