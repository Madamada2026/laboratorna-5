import React, { useState } from 'react';

// Дані про категорії та коефіцієнти конвертації відносно базової одиниці
const CATEGORIES = {
  length: {
    label: '📏 Довжина',
    units: { m: 'Метри (м)', km: 'Кілометри (км)', cm: 'Сантиметри (см)', mm: 'Міліметри (мм)' },
    rates: { m: 1, km: 1000, cm: 0.01, mm: 0.001 } // базова одиниця: метр
  },
  weight: {
    label: '⚖️ Вага',
    units: { kg: 'Кілограми (кг)', g: 'Грами (г)', t: 'Тонни (т)', lb: 'Фунти (lb)' },
    rates: { kg: 1, g: 0.001, t: 1000, lb: 0.453592 } // базова одиниця: кг
  },
  temperature: {
    label: '🌡️ Температура',
    units: { C: 'Цельсій (°C)', F: 'Фаренгейт (°F)', K: 'Кельвін (K)' }
    // Температура потребує окремої логіки формул, її пропишемо окремо нижче
  },
  currency: {
    label: '💰 Валюта',
    units: { UAH: 'Гривня (UAH)', USD: 'Долар (USD)', EUR: 'Євро (EUR)' },
    rates: { UAH: 1, USD: 41.5, EUR: 44.2 } // базова одиниця: гривня
  }
};

function UnitConverter() {
  // 1. Стани для процесу конвертації
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('1');

  // 2. Стани для історії та улюблених пар
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Очищення вибору одиниць при зміні категорії
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const availableUnits = Object.keys(CATEGORIES[cat].units);
    setFromUnit(availableUnits[0]);
    setToUnit(availableUnits[1] || availableUnits[0]);
  };

  // Логіка математичного розрахунку
  const calculateResult = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0';

    if (category === 'temperature') {
      if (fromUnit === toUnit) return val;
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * 5 / 9;
      if (fromUnit === 'K') celsius = val - 273.15;

      if (toUnit === 'C') return celsius.toFixed(2);
      if (toUnit === 'F') return (celsius * 9 / 5 + 32).toFixed(2);
      if (toUnit === 'K') return (celsius + 273.15).toFixed(2);
    } else {
      const currentCat = CATEGORIES[category];
      const baseValue = val * currentCat.rates[fromUnit];
      const finalResult = baseValue / currentCat.rates[toUnit];
      return finalResult.toLocaleString('uk-UA', { maximumFractionDigits: 4 });
    }
  };

  const result = calculateResult();

  // Збереження операції в історію
  const handleSaveToHistory = () => {
    if (!inputValue || isNaN(parseFloat(inputValue))) return;
    const newRecord = {
      id: Date.now(),
      text: `${inputValue} ${fromUnit} = ${result} ${toUnit} (${CATEGORIES[category].label})`
    };
    setHistory((prev) => [newRecord, ...prev].slice(0, 5)); // Зберігаємо останні 5 записів
  };

  // Додавання поточної пари одиниць до обраного
  const handleToggleFavorite = () => {
    const pairText = `${CATEGORIES[category].units[fromUnit]} ➡️ ${CATEGORIES[category].units[toUnit]}`;
    if (favorites.includes(pairText)) {
      setFavorites((prev) => prev.filter((item) => item !== pairText));
    } else {
      setFavorites((prev) => [...prev, pairText]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '650px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Універсальний конвертер одиниць</h2>

      {/* Перемикач категорій */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: '10px 15px',
              fontSize: '15px',
              backgroundColor: category === cat ? '#2196f3' : '#e0e0e0',
              color: category === cat ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      {/* Інтерфейс калькулятора */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          
          {/* Блок "ЗВІДКИ" */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box', marginBottom: '10px' }}
              placeholder="Значення"
            />
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              {Object.entries(CATEGORIES[category].units).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>➡️</div>

          {/* Блок "КУДИ" */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <div style={{ width: '100%', padding: '10px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#eef5f9', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px', minHeight: '43px' }}>
              {result}
            </div>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              {Object.entries(CATEGORIES[category].units).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Кнопки збереження */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleSaveToHistory} style={{ flex: 1, padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            💾 Записати в історію
          </button>
          <button onClick={handleToggleFavorite} style={{ padding: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {favorites.includes(`${CATEGORIES[category].units[fromUnit]} ➡️ ${CATEGORIES[category].units[toUnit]}`) ? '⭐ В улюблених' : '☆ Додати в улюблені'}
          </button>
        </div>
      </div>

      {/* Панелі списків (Історія та Обране) */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        
        {/* Блок Історії */}
        <div style={{ flex: 1, minWidth: '250px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
          <h4>🕒 Останні конвертації</h4>
          {history.length === 0 ? <p style={{ color: '#888', fontSize: '14px' }}>Історія порожня</p> : (
            <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
              {history.map((item) => (
                <li key={item.id} style={{ marginBottom: '5px' }}>{item.text}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Блок Улюблених пар */}
        <div style={{ flex: 1, minWidth: '250px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
          <h4>⭐ Обрані пари одиниць</h4>
          {favorites.length === 0 ? <p style={{ color: '#888', fontSize: '14px' }}>Немає збережеких пар</p> : (
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#e65100' }}>
              {favorites.map((fav, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{fav}</li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default UnitConverter;
