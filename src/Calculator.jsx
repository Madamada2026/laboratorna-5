import React, { useState } from 'react';

function Calculator() {
  // 1. Стани для обчислень (поточне, попереднє значення та операція)
  const [currentValue, setCurrentValue] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  
  // 2. Стан для відстеження режиму введення (чи починаємо нове число)
  const [isNewInput, setIsNewInput] = useState(true);
  
  // 3. Стан для збереження історії обчислень (масив об'єктів)
  const [history, setHistory] = useState([]);

  // Введення цифр
  const handleNumber = (num) => {
    if (isNewInput || currentValue === '0') {
      setCurrentValue(num);
      setIsNewInput(false);
    } else {
      setCurrentValue(prev => prev + num);
    }
  };

  // Введення крапки для десяткових дробів
  const handleDot = () => {
    if (isNewInput) {
      setCurrentValue('0.');
      setIsNewInput(false);
      return;
    }
    if (!currentValue.includes('.')) {
      setCurrentValue(prev => prev + '.');
    }
  };

  // Вибір арифметичної операції (+, -, *, /)
  const handleOperation = (op) => {
    const localPrev = prevValue !== null ? parseFloat(prevValue) : null;
    const localCurrent = parseFloat(currentValue);

    // Якщо це ланцюгове обчислення (вже є попередня операція)
    if (operation && prevValue !== null && !isNewInput) {
      const result = executeCalculation(localPrev, localCurrent, operation);
      setPrevValue(result.toString());
      setCurrentValue(result.toString());
      
      const record = {
        id: Date.now(),
        text: `${prevValue} ${operation} ${currentValue} = ${result}`,
        value: result
      };
      setHistory(prev => [record, ...prev]);
    } else {
      setPrevValue(currentValue);
    }
    
    setOperation(op);
    setIsNewInput(true);
  };

  // Внутрішня функція розрахунку
  const executeCalculation = (p, c, op) => {
    switch (op) {
      case '+': return p + c;
      case '-': return p - c;
      case '*': return p * c;
      case '/': return c === 0 ? 'Помилка: ділення на 0' : p / c;
      default: return c;
    }
  };

  // Натискання кнопки дорівнює (=)
  const handleEqual = () => {
    if (!operation || prevValue === null) return;

    const p = parseFloat(prevValue);
    const c = parseFloat(currentValue);
    
    if (isNaN(p) || isNaN(c)) return;

    const result = executeCalculation(p, c, operation);
    
    const record = {
      id: Date.now(),
      text: `${prevValue} ${operation} ${currentValue} = ${result}`,
      value: result
    };

    // Імутабельне додавання в історію
    if (result !== 'Помилка: ділення на 0') {
      setHistory(prev => [record, ...prev]);
    }

    setCurrentValue(result.toString());
    setPrevValue(null);
    setOperation(null);
    setIsNewInput(true);
  };

  // Очищення поточного введення (C)
  const handleClear = () => {
    setCurrentValue('0');
    setPrevValue(null);
    setOperation(null);
    setIsNewInput(true);
  };

  // Повторне використання результату з історії
  const handleUseHistoryValue = (val) => {
    if (val === 'Помилка: ділення на 0') return;
    setCurrentValue(val.toString());
    setIsNewInput(true);
  };

  // Видалення конкретного запису з історії
  const handleDeleteHistoryItem = (id, e) => {
    e.stopPropagation(); // щоб не спрацьовував клік по всьому рядку
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Калькулятор з історією</h2>
      
      {/* Корпус калькулятора */}
      <div style={{ border: '2px solid #333', borderRadius: '10px', padding: '15px', backgroundColor: '#222' }}>
        {/* Дисплей */}
        <div style={{ backgroundColor: '#a7c0a3', padding: '15px', borderRadius: '5px', textDirection: 'ltr', textAlign: 'right', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '15px', overflowX: 'auto', minHeight: '34px' }}>
          {currentValue}
        </div>

        {/* Сітка кнопок */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <button onClick={handleClear} style={{ gridColumn: 'span 2', padding: '15px', fontSize: '18px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>C</button>
          <button onClick={() => handleOperation('/')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>/</button>
          <button onClick={() => handleOperation('*')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>*</button>

          {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumber(n.toString())} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{n}</button>)}
          <button onClick={() => handleOperation('-')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>-</button>

          {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumber(n.toString())} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{n}</button>)}
          <button onClick={() => handleOperation('+')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+</button>

          {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumber(n.toString())} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{n}</button>)}
          <button onClick={handleEqual} style={{ gridRow: 'span 2', padding: '15px', fontSize: '18px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>=</button>

          <button onClick={() => handleNumber('0')} style={{ gridColumn: 'span 2', padding: '15px', fontSize: '18px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>0</button>
          <button onClick={handleDot} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>.</button>
        </div>
      </div>

      {/* Блок історії під калькулятором */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fafafa' }}>
        <h4>📜 Історія обчислень (клік для використання):</h4>
        {history.length === 0 ? <p style={{ color: '#888', fontSize: '14px' }}>Історія порожня</p> : (
          <ul style={{ paddingLeft: '20px', fontSize: '14px', margin: 0 }}>
            {history.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleUseHistoryValue(item.value)}
                style={{ marginBottom: '8px', cursor: 'pointer', color: '#007bff', textDecoration: 'underline', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{item.text}</span>
                <button 
                  onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                  style={{ marginLeft: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                >
                  [видалити]
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Calculator;
