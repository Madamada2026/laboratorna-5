import React from 'react';
import CountdownTimer from './CountdownTimer';
import MultiplicationTable from './MultiplicationTable';
import UnitConverter from './UnitConverter';

function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <CountdownTimer />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <MultiplicationTable />
      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
      <UnitConverter />
    </div>
  );
}

export default App;
