import React, { useState } from 'react';

function MultiplicationTable() {
  // 1. Стани для розмірності таблиці (рядки та стовпці)
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  
  // 2. Стан для збереження координати вибраної комірки (об'єкт або null)
  const [selectedCell, setSelectedCell] = useState(null);
  
  // 3. Стан для режиму підсвічування парних чисел (true/false)
  const [highlightEven, setHighlightEven] = useState(false);

  // Створення структури таблиці (генерація матриці)
  const tableData = [];
  for (let i = 1; i <= rows; i++) {
    const row = [];
    for (let j = 1; j <= cols; j++) {
      row.push(i * j);
    }
    tableData.push(row);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Динамічна таблиця множення</h2>

      {/* Панель налаштувань */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label>Рядків: </label>
          <input 
            type="number" 
            min="1" max="15" 
            value={rows} 
            onChange={(e) => { setRows(parseInt(e.target.value) || 1); setSelectedCell(null); }}
            style={{ width: '50px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Стовпців: </label>
          <input 
            type="number" 
            min="1" max="15" 
            value={cols} 
            onChange={(e) => { setCols(parseInt(e.target.value) || 1); setSelectedCell(null); }}
            style={{ width: '50px', padding: '5px' }}
          />
        </div>
        <button 
          onClick={() => setHighlightEven(!highlightEven)}
          style={{ padding: '5px 10px', backgroundColor: highlightEven ? '#4caf50' : '#ccc', color: highlightEven ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {highlightEven ? 'Парні виділено' : 'Виділити парні'}
        </button>
      </div>

      {/* Сама таблиця */}
      <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((val, colIndex) => {
                  const rNum = rowIndex + 1;
                  const cNum = colIndex + 1;
                  const isSelected = selectedCell && selectedCell.r === rNum && selectedCell.c === cNum;
                  const isEven = val % 2 === 0;

                  // Визначаємо колір фону комірки
                  let bgColor = 'white';
                  if (isSelected) bgColor = '#ffeb3b'; // жовтий для вибраної
                  else if (highlightEven && isEven) bgColor = '#e8f5e9'; // світло-зелений для парних

                  return (
                    <td
                      key={colIndex}
                      onClick={() => setSelectedCell({ r: rNum, c: cNum, value: val })}
                      style={{
                        border: '1px solid #999',
                        padding: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: bgColor,
                        fontWeight: isSelected ? 'bold' : 'normal',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Панель деталей під таблицею */}
      <div style={{ marginTop: '25px', padding: '15px', border: '1px dashed #666', borderRadius: '6px', textAlign: 'center', minHeight: '50px', backgroundColor: '#fafafa' }}>
        {selectedCell ? (
          <p style={{ margin: 0, fontSize: '18px' }}>
            Деталі: <strong>{selectedCell.r}</strong> × <strong>{selectedCell.c}</strong> = <span style={{ color: '#2196f3', fontSize: '22px' }}>{selectedCell.value}</span>
          </p>
        ) : (
          <p style={{ margin: 0, color: '#777' }}>Клікніть на будь-яку комірку, щоб побачити деталі множення</p>
        )}
      </div>
    </div>
  );
}

export default MultiplicationTable;
