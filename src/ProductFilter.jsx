import React, { useState } from 'react';

// Початковий масив продуктів
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Ноутбук Pro 15', category: 'Електроніка', price: 35000, rating: 4.8 },
  { id: 2, name: 'Смартфон X', category: 'Електроніка', price: 18000, rating: 4.5 },
  { id: 3, name: 'Бездротові навушники', category: 'Електроніка', price: 4500, rating: 4.2 },
  { id: 4, name: 'Кавомашина автоматична', category: 'Побутова техніка', price: 12000, rating: 4.7 },
  { id: 5, name: 'Пилосос робот', category: 'Побутова техніка', price: 8500, rating: 4.4 },
  { id: 6, name: 'Кросівки для бігу', category: 'Взуття', price: 3200, rating: 4.6 },
  { id: 7, name: 'Спортивна куртка', category: 'Одяг', price: 2800, rating: 4.1 },
  { id: 8, name: 'Шкіряний рюкзак', category: 'Одяг', price: 1900, rating: 4.3 }
];

// Налаштування фільтрів за замовчуванням
const DEFAULT_FILTERS = {
  search: '',
  category: 'Всі',
  minPrice: '',
  maxPrice: '',
  sortBy: 'name', // name, price, rating
  sortOrder: 'asc' // asc, desc
};

function ProductFilter() {
  // 1. Стан для продуктів та активних налаштувань фільтрації
  const [products] = useState(INITIAL_PRODUCTS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Функція оновлення конкретного фільтра
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Функція скидання всіх фільтрів
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Розрахунок кількості активних фільтрів (які відрізняються від дефолтних)
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search !== '') count++;
    if (filters.category !== 'Всі') count++;
    if (filters.minPrice !== '') count++;
    if (filters.maxPrice !== '') count++;
    return count;
  };

  // Декларативне обчислення відфільтрованого та відсортованого списку
  const filteredProducts = products
    .filter(product => {
      // 1. Пошук за назвою
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
      
      // 2. Фільтр за категорією
      const matchesCategory = filters.category === 'Всі' || product.category === filters.category;
      
      // 3. Фільтр за мінімальною ціною
      const min = parseFloat(filters.minPrice);
      const matchesMinPrice = isNaN(min) || product.price >= min;
      
      // 4. Фільтр за максимальною ціною
      const max = parseFloat(filters.maxPrice);
      const matchesMaxPrice = isNaN(max) || product.price <= max;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      // Сортування
      let fieldA = a[filters.sortBy];
      let fieldB = b[filters.sortBy];

      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) return filters.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Система фільтрації та сортування продуктів</h2>

      {/* Панель керування фільтрами */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#fff', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            🔥 Активних фільтрів: <span style={{ color: '#2196f3' }}>{getActiveFiltersCount()}</span>
          </span>
          <button 
            onClick={handleReset}
            style={{ padding: '6px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Скинути все
          </button>
        </div>

        {/* Рядок пошуку та категорій */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="🔍 Пошук продукту..." 
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ flex: 2, padding: '8px', minWidth: '200px' }}
          />
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{ flex: 1, padding: '8px', minWidth: '150px' }}
          >
            <option value="Всі">Усі категорії</option>
            <option value="Електроніка">Електроніка</option>
            <option value="Побутова техніка">Побутова techніка</option>
            <option value="Одяг">Одяг</option>
            <option value="Взуття">Взуття</option>
          </select>
        </div>

        {/* Ціновий діапазон та сортування */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label>Ціна від: </label>
            <input 
              type="number" 
              placeholder="Мін" 
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              style={{ width: '80px', padding: '6px' }}
            />
            <label> до: </label>
            <input 
              type="number" 
              placeholder="Макс" 
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              style={{ width: '80px', padding: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}>
            <label>Сортувати за: </label>
            <select 
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{ padding: '6px' }}
            >
              <option value="name">Назвою</option>
              <option value="price">Ціною</option>
              <option value="rating">Рейтингом</option>
            </select>
            <select 
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              style={{ padding: '6px' }}
            >
              <option value="asc">Зростанням (А-Я)</option>
              <option value="desc">Спаданням (Я-А)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список продуктів */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', fontWeight: 'bold' }}>{product.category}</span>
              <h4 style={{ margin: '5px 0 10px 0', color: '#333' }}>{product.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>{product.price} грн</span>
                <span style={{ fontSize: '14px', color: '#ff9800' }}>⭐ {product.rating}</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', marginTop: '20px' }}>Нічого не знайдено за вказаними фільтрами</p>
        )}
      </div>
    </div>
  );
}

export default ProductFilter;
