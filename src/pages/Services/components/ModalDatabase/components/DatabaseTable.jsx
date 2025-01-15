
import React, { useState } from 'react'

// utils

// styles
import {
  Table,
  Header,
  Content,
  TableTitle,
  InputCount
} from './DatabaseTable.style';

// components
import DatabaseRow from './DatabaseRow';


const DatabaseTable = ({ servicesBase, setServicesBase, onCheckboxChange, onFieldChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredServices = servicesBase 
  ? servicesBase.filter(service => 
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  return (
    <div>
      <Table>

        <Header>
          <TableTitle style={{ flex: 4 }}>
            Название
            <InputCount 
              type="text" 
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Поиск..."
              style={{ marginLeft: '10px', paddingLeft: '5px' }}
            />
            </TableTitle>
          <TableTitle style={{ textAlign: 'center', flex: 1 }}>Цена, руб.</TableTitle>
        </Header>

        <Content>
          {filteredServices.map((service, index) => (
            <DatabaseRow
              key={service.id}
              isSelected={service.isSelected}
              id={service.id}
              title={service.title}
              price={service.price}
              onCheckboxChange={onCheckboxChange}
              onFieldChange={onFieldChange}
            />
          ))}
        </Content>

      </Table>
    </div>
  )
};

export default DatabaseTable;