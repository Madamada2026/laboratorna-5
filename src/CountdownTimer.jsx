import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  // 1. Стан для початкового часу (що вводить користувач в інпут)
  const [initialTime, setInitialTime] = useState(60);
  // 2. Стан для поточного часу (який зменшується щосекунди)
  const [timeLeft, setTimeLeft] = useState(60);
  // 3. Стан роботи таймера (true - запущений, false - на паузі/стоїть)
  const [isActive, setIsActive] = useState(false);

  // Ефект useEffect для керування інтервалом (щосекундне зменшення)
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); // Зупиняємо таймер, коли нуль
    }

    // Очищення інтервалу при розмонтуванні або зміні залежностей
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Функція запуску / паузи
  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  // Функція скидання до початкового значення
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  // Обробник зміни значення в інпуті
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setInitialTime(value);
    if (!isActive) {
      setTimeLeft(value); // Якщо таймер не запущений, одразу оновлюємо екран
    }
  };

  return (
    <div style={{ padding: '30px', border: '2px solid #333', borderRadius: '12px', maxWidth: '350px', margin: '20px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2>Таймер зворотного відліку</h2>
      
      {/* Блок налаштування початкового часу */}
      <div style={{ marginBottom: '20px' }}>
        <label>Введіть час (сек): </label>
        <input 
          type="number" 
          value={initialTime} 
          onChange={handleInputChange}
          disabled={isActive} // Блокуємо інпут під час роботи таймера
          style={{ width: '60px', padding: '5px', marginLeft: '10px', fontSize: '16px' }}
        />
      </div>

      {/* Головне табло таймера */}
      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0', color: timeLeft === 0 ? 'red' : 'black' }}>
        {timeLeft > 0 ? `${timeLeft} сек` : '⏱️ Час вийшов!'}
      </div>

      {/* Кнопки керування */}
      <div>
        <button 
          onClick={handleStartPause} 
          disabled={timeLeft === 0}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: isActive ? '#ff9800' : '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
        >
          {isActive ? 'Пауза' : 'Старт'}
        </button>

        <button 
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Скинути
        </button>
      </div>
    </div>
  );
}

export default CountdownTimer;
