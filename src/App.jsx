import React from 'react';
import CountdownTimer from './CountdownTimer';
import MultiplicationTable from './MultiplicationTable';
import Calculator from './Calculator';
import ProductFilter from './ProductFilter';
import FormBuilder from './FormBuilder'; // Наш останній обов'язковий файл
import UnitConverter from './UnitConverter';
import WeeklyScheduler from './WeeklyScheduler';

function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Основні обов'язкові завдання */}
      <CountdownTimer />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <MultiplicationTable />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <Calculator />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <ProductFilter />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <FormBuilder />
      
      {/* Додаткова / Індивідуальна частина вашого проєкту */}
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #007bff', borderWidth: '3px' }} />
      <h3 style={{ textAlign: 'center', color: '#007bff' }}>Додатково виконані індивідуальні завдання:</h3>
      <UnitConverter />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <WeeklyScheduler />
    </div>
  );
}

export default App;
