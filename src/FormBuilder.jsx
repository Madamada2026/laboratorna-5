import React, { useState, useEffect } from 'react';

function FormBuilder() {
  // 1. Головні стани конструктора
  const [fields, setFields] = useState([]); // Схема полів форми
  const [formData, setFormData] = useState({}); // Значення заповнених полів
  const [errors, setErrors] = useState({}); // Помилки валідації в реальному часі

  // 2. Стани для створення нового поля
  const [fieldType, setFieldType] = useState('text');
  const [fieldLabel, setFieldLabel] = useState('');
  const [isRequired, setIsRequired] = useState(false);

  // Додавання нового поля до схеми
  const handleAddField = (e) => {
    e.preventDefault();
    if (!fieldLabel.trim()) return;

    const fieldId = `field_${Date.now()}`;
    const newField = {
      id: fieldId,
      type: fieldType,
      label: fieldLabel.trim(),
      required: isRequired
    };

    setFields(prev => [...prev, newField]);
    setFormData(prev => ({ ...prev, [fieldId]: '' }));
    setFieldLabel('');
    setIsRequired(false);
  };

  // Валідація конкретного поля в реальному часі
  const validateField = (id, value, fieldConfig) => {
    let errorMsg = '';
    if (fieldConfig.required && !value.trim()) {
      errorMsg = 'Це поле є обовʼязковим для заповнення';
    } else if (value.trim()) {
      if (fieldConfig.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        errorMsg = 'Некоректний формат Email адреси';
      }
      if (fieldConfig.type === 'number' && isNaN(Number(value))) {
        errorMsg = 'Значення повинно бути числом';
      }
    }
    setErrors(prev => ({ ...prev, [id]: errorMsg }));
  };

  // Обробник зміни значень у згенерованій формі
  const handleInputChange = (id, value, fieldConfig) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    validateField(id, value, fieldConfig);
  };

  // Видалення поля зі схеми конструктора
  const handleDeleteField = (id) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setFormData(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // Симуляція відправки даних
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Фінальна перевірка всіх полів перед відправкою
    const currentErrors = {};
    fields.forEach(f => {
      const val = formData[f.id] || '';
      if (f.required && !val.trim()) {
        currentErrors[f.id] = 'Це поле є обовʼязковим для заповнення';
      }
    });

    if (Object.values(currentErrors).some(msg => msg !== '')) {
      setErrors(currentErrors);
      alert('Будь ласка, виправте помилки у формі перед відправкою!');
      return;
    }

    alert(`🎉 Форму успішно відправлено!\nДані: ${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Динамічний конструктор форми</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* ЛІВА ПАНЕЛЬ: Створення схеми */}
        <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h4>⚙️ Налаштування нового поля</h4>
          <form onSubmit={handleAddField}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Тип поля:</label>
              <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="text">Текст (Текстове поле)</option>
                <option value="number">Число (Цифрове поле)</option>
                <option value="email">Email адреса</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Назва мітки (Label):</label>
              <input 
                type="text" 
                value={fieldLabel} 
                onChange={(e) => setFieldLabel(e.target.value)} 
                placeholder="Наприклад: Введіть ваше ім'я" 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} style={{ marginRight: '6px' }} />
                Обов'язкове поле (Валідація)
              </label>
            </div>

            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              ➕ Додати поле до форми
            </button>
          </form>

          {/* Візуалізація JSON схеми форми */}
          <div style={{ marginTop: '20px' }}>
            <h5>📄 Схема форми (JSON):</h5>
            <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', maxHeight: '150px' }}>
              {JSON.stringify(fields, null, 2)}
            </pre>
          </div>
        </div>

        {/* ПРАВА ПАНЕЛЬ: Генерація та рендеринг форми */}
        <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h4>📋 Згенерована динамічна форма</h4>
          
          {fields.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>Форма порожня. Додайте поля за допомогою лівої панелі конфігуратора.</p>
          ) : (
            <form onSubmit={handleSubmitForm}>
              {fields.map(field => (
                <div key={field.id} style={{ marginBottom: '15px', position: 'relative', borderBottom: '1px dashed #eee', paddingBottom: '10px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                  </label>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type={field.type === 'number' ? 'text' : field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                      style={{ flex: 1, padding: '8px', border: errors[field.id] ? '1px solid red' : '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleDeleteField(field.id)}
                      style={{ padding: '0 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      title="Видалити поле"
                    >
                      ❌
                    </button>
                  </div>

                  {errors[field.id] && (
                    <span style={{ color: 'red', fontSize: '12px', marginTop: '3px', display: 'block' }}>{errors[field.id]}</span>
                  )}
                </div>
              ))}

              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                🚀 Відправити заповнені дані
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default FormBuilder;
