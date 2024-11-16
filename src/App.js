import React from 'react';
import SelectCard from './components/SelectCard';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <SelectCard modelName="Helmet mercedes" />
      <SelectCard modelName="Helmet redbull" />
    </div>
  );
}

export default App;