import React, { useCallback, useEffect } from 'react'

// styles
import {
  Table,
  Header,
  Content,
  TableTitle
} from './ServicesTableContainer.style'

// components
import ServicesRow from './rows/ServicesRow';

const ServicesTableContainer = ({ servicesData, onCheckboxChange, onFieldChange }) => {

  const config = {
    rows: [
      { title: 179485, count: 179487, price: 179489, summ: 185257 },
      { title: 184735, count: 184855, price: 185119, summ: 185307 },
      { title: 184737, count: 184867, price: 185187, summ: 185309 },
      { title: 184739, count: 184869, price: 185191, summ: 185311 },
      { title: 184741, count: 184871, price: 185193, summ: 185313 },
      { title: 184743, count: 184881, price: 185195, summ: 185363 },
      { title: 184797, count: 184887, price: 185199, summ: 185461 },
      { title: 184747, count: 184899, price: 185201, summ: 185463 },
      { title: 184799, count: 184967, price: 185203, summ: 185465 },
      { title: 184803, count: 185205, price: 185467, summ: 185467 }
    ]
  };

  // Функция для нахождения последнего заполненного сервиса
  const getLastFilledIndex = () => {
    if (!servicesData || servicesData.length === 0) return -1; // Если данных нет или они пустые

    for (let i = servicesData.length - 1; i >= 0; i--) {
      const service = servicesData[i];
      if (service.title || service.count || service.price) {
        return i; // Индекс последней заполненной строки
      }
    }
    return -1; // Если все строки пустые
  };

  // Функции для обновления значений
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

  const updateTextareaValue = (name, newValue) => {
    const element = document.querySelector(`[data-id="${name}"]`);
    if (element) {
      const textarea = element.querySelector('textarea');
      if (textarea) {
        textarea.value = newValue;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  useEffect(() => {

    const lastFilledIndex = getLastFilledIndex();

    if (lastFilledIndex !== -1) {
      for (let i = lastFilledIndex + 1; i < config.rows.length; i++) {
        const { title, count, price, summ } = config.rows[i];
        updateTextareaValue(title, '');   // Очищаем название
        updateInputValue(count, '');      // Очищаем количество
        updateInputValue(price, '');      // Очищаем цену
        updateInputValue(summ, '');      // Очищаем сумму
      }
    }
  }, [servicesData]);

  return (
    <Table>
      <Header>
        <TableTitle style={{ flex: 6 }}>Название</TableTitle>
        <TableTitle style={{ textAlign: 'center', flex: 1 }}>Кол-во</TableTitle>
        <TableTitle style={{ textAlign: 'center', flex: 2 }}>Цена</TableTitle>
      </Header>

      <Content>
        {servicesData && servicesData.map((service, index) => (
          <ServicesRow
            key={index}
            isSelected={service.isSelected}
            title={service.title}
            count={service.count}
            price={service.price}
            onCheckboxChange={onCheckboxChange}
            onFieldChange={onFieldChange}
            config={config.rows[index]}
          />
        ))}
      </Content>
    </Table>
  );
};

export default ServicesTableContainer;
