import React, { useState } from 'react';

const DAYS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // розклад з 8:00 до 22:00

function WeeklyScheduler() {
  // 1. Головний стан для збереження масиву всіх подій
  const [events, setEvents] = useState([]);

  // 2. Стани для полей форми нової події
  const [selectedDay, setSelectedDay] = useState('Понеділок');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startHour, setStartHour] = useState(9);
  const [duration, setDuration] = useState(1);

  // 3. Стан для повідомлення про конфлікт часу
  const [conflictMessage, setConflictMessage] = useState('');

  // Функція додавання нової події
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const endHour = startHour + parseInt(duration, 10);

    // Перевірка на конфлікт часу в межах одного дня
    const hasConflict = events.some(ev => {
      if (ev.day !== selectedDay) return false;
      const evEnd = ev.startHour + ev.duration;
      // Подія перетинається, якщо вона починається або закінчується всередині існуючої
      return (startHour >= ev.startHour && startHour < evEnd) || 
             (endHour > ev.startHour && endHour <= evEnd) ||
             (startHour <= ev.startHour && endHour >= evEnd);
    });

    if (hasConflict) {
      setConflictMessage(`⚠️ Конфлікт! На цей час у день (${selectedDay}) вже є запланована подія.`);
      return;
    }

    setConflictMessage('');

    const newEvent = {
      id: Date.now(),
      day: selectedDay,
      title,
      description,
      startHour,
      duration: parseInt(duration, 10)
    };

    // Імутабельне додавання в масив стану
    setEvents(prev => [...prev, newEvent]);
    setTitle('');
    setDescription('');
  };

  // Видалення події
  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Планувальник розкладу тижня</h2>

      {/* Форма додавання подій */}
      <form onSubmit={handleAddEvent} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#fff', marginBottom: '30px' }}>
        <h4>📅 Додати нову подію</h4>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div>
            <label>День: </label>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{ padding: '6px' }}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label>Початок (год): </label>
            <select value={startHour} onChange={(e) => setStartHour(parseInt(e.target.value))} style={{ padding: '6px' }}>
              {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </div>
          <div>
            <label>Тривалість (год): </label>
            <input type="number" min="1" max="5" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '50px', padding: '5px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <input type="text" placeholder="Назва події" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, padding: '8px', minWidth: '200px' }} />
          <input type="text" placeholder="Опис (необов'язково)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 2, padding: '8px', minWidth: '200px' }} />
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00bcd4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ➕ Запланувати
        </button>

        {conflictMessage && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold', fontSize: '14px' }}>{conflictMessage}</p>}
      </form>

      {/* Сітка розкладу тижня */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px', width: '100px' }}>Година</th>
              {DAYS.map(d => <th key={d} style={{ border: '1px solid #ddd', padding: '10px' }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(hour => (
              <tr key={hour}>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', backgroundColor: '#fafafa' }}>
                  {hour}:00
                </td>
                {DAYS.map(day => {
                  // Шукаємо подію, яка триває в цю годину цього дня
                  const currentEvent = events.find(ev => ev.day === day && hour >= ev.startHour && hour < (ev.startHour + ev.duration));

                  // Візуальне кодування: якщо це перша година події — рендеримо плашку події
                  if (currentEvent) {
                    if (hour === currentEvent.startHour) {
                      return (
                        <td 
                          key={day} 
                          rowSpan={currentEvent.duration} 
                          style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#e0f7fa', color: '#006064', verticalAlign: 'top', textAlign: 'center', position: 'relative' }}
                        >
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{currentEvent.title}</div>
                          <div style={{ fontSize: '11px', color: '#00838f' }}>{currentEvent.description}</div>
                          <button 
                            onClick={() => handleDeleteEvent(currentEvent.id)}
                            style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '11px', padding: '2px', marginTop: '4px', textDecoration: 'underline' }}
                          >
                            видалити
                          </button>
                        </td>
                      );
                    }
                    // Якщо це продовження події (rowSpan діє), пропускаємо рендер клітинки
                    return null;
                  }

                  // Порожня клітинка
                  return <td key={day} style={{ border: '1px solid #ddd', padding: '10px' }}></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeeklyScheduler;
