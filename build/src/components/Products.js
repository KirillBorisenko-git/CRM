import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Eye,
  Filter
} from 'lucide-react';

const ProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    brand: '',
    model: '',
    price: '',
    stock: '',
    category: 'Смартфоны',
    description: '',
    specifications: {
      display: '',
      processor: '',
      memory: '',
      camera: '',
      battery: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
  };

  const handleSpecificationChange = (key, value) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [key]: value
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Бренд</label>
              <input
                type="text"
                className="form-control"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Модель</label>
              <input
                type="text"
                className="form-control"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Категория</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Смартфоны">Смартфоны</option>
                <option value="Планшеты">Планшеты</option>
                <option value="Аксессуары">Аксессуары</option>
                <option value="Наушники">Наушники</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Цена (₽)</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Количество</label>
              <input
                type="number"
                className="form-control"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <h4 style={{ marginTop: '20px', marginBottom: '15px' }}>Характеристики</h4>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Дисплей</label>
              <input
                type="text"
                className="form-control"
                value={formData.specifications.display}
                onChange={(e) => handleSpecificationChange('display', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Процессор</label>
              <input
                type="text"
                className="form-control"
                value={formData.specifications.processor}
                onChange={(e) => handleSpecificationChange('processor', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Память</label>
              <input
                type="text"
                className="form-control"
                value={formData.specifications.memory}
                onChange={(e) => handleSpecificationChange('memory', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Камера</label>
              <input
                type="text"
                className="form-control"
                value={formData.specifications.camera}
                onChange={(e) => handleSpecificationChange('camera', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Батарея</label>
            <input
              type="text"
              className="form-control"
              value={formData.specifications.battery}
              onChange={(e) => handleSpecificationChange('battery', e.target.value)}
            />
          </div>

          <div className="actions" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onEdit, onDelete, onView }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
      <div>
        <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{product.name}</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>{product.brand} • {product.category}</p>
      </div>
      <div className="actions">
        <button className="btn btn-secondary" onClick={() => onView(product)} style={{ padding: '6px' }}>
          <Eye size={16} />
        </button>
        <button className="btn btn-primary" onClick={() => onEdit(product)} style={{ padding: '6px' }}>
          <Edit size={16} />
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(product.id)} style={{ padding: '6px' }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    
    <div style={{ marginBottom: '15px' }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
        {product.price.toLocaleString('ru-RU')} ₽
      </p>
      <p style={{ fontSize: '14px', color: product.stock > 10 ? '#28a745' : product.stock > 0 ? '#ffc107' : '#dc3545' }}>
        В наличии: {product.stock} шт.
      </p>
    </div>
    
    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
      {product.description}
    </p>
    
    {product.specifications && (
      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <p style={{ fontSize: '12px', color: '#666' }}>
          {product.specifications.display && `${product.specifications.display} • `}
          {product.specifications.processor && `${product.specifications.processor} • `}
          {product.specifications.memory && product.specifications.memory}
        </p>
      </div>
    )}
  </div>
);

const ProductDetailModal = ({ product, onClose }) => (
  <div className="modal-overlay">
    <div className="modal" style={{ maxWidth: '600px' }}>
      <div className="modal-header">
        <h2 className="modal-title">{product.name}</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4>Основная информация</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div><strong>Бренд:</strong> {product.brand}</div>
            <div><strong>Модель:</strong> {product.model}</div>
            <div><strong>Категория:</strong> {product.category}</div>
            <div><strong>Цена:</strong> {product.price.toLocaleString('ru-RU')} ₽</div>
            <div><strong>В наличии:</strong> {product.stock} шт.</div>
          </div>
        </div>
        
        {product.description && (
          <div>
            <h4>Описание</h4>
            <p>{product.description}</p>
          </div>
        )}
        
        {product.specifications && (
          <div>
            <h4>Характеристики</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              {Object.entries(product.specifications).map(([key, value]) => (
                value && (
                  <div key={key}>
                    <strong>{key === 'display' ? 'Дисплей' : 
                            key === 'processor' ? 'Процессор' :
                            key === 'memory' ? 'Память' :
                            key === 'camera' ? 'Камера' :
                            key === 'battery' ? 'Батарея' : key}:</strong> {value}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const handleSave = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setShowDetailModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Управление товарами
          </h1>
          <p style={{ color: '#666' }}>
            Всего товаров: {products.length}
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Добавить товар
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="grid grid-2">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по названию, бренду или модели..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} />
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Список товаров */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Package size={48} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Товары не найдены</h3>
          <p style={{ color: '#999' }}>
            {searchTerm || categoryFilter 
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первый товар в каталог'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Модальные окна */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showDetailModal && viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => {
            setShowDetailModal(false);
            setViewingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;