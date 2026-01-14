import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingCart,
  Eye,
  Filter,
  Calendar,
  User,
  Package,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const OrderModal = ({ order, onSave, onClose }) => {
  const { customers, products } = useData();
  const [formData, setFormData] = useState(order || {
    customerId: '',
    products: [{ id: '', quantity: 1 }],
    status: 'Новый',
    paymentMethod: 'Карта',
    deliveryAddress: '',
    notes: ''
  });

  const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId));
  
  const calculateTotal = () => {
    return formData.products.reduce((sum, orderProduct) => {
      const product = products.find(p => p.id === parseInt(orderProduct.id));
      return sum + (product ? product.price * orderProduct.quantity : 0);
    }, 0);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { id: '', quantity: 1 }]
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: newProducts });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      customerId: parseInt(formData.customerId),
      customerName: selectedCustomer?.name || '',
      products: formData.products.map(p => {
        const product = products.find(prod => prod.id === parseInt(p.id));
        return {
          id: parseInt(p.id),
          name: product?.name || '',
          price: product?.price || 0,
          quantity: parseInt(p.quantity)
        };
      }).filter(p => p.id),
      total: calculateTotal()
    };

    onSave(orderData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {order ? 'Редактировать заказ' : 'Создать заказ'}
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Клиент</label>
              <select
                className="form-control"
                value={formData.customerId}
                onChange={(e) => {
                  const customer = customers.find(c => c.id === parseInt(e.target.value));
                  setFormData({
                    ...formData,
                    customerId: e.target.value,
                    deliveryAddress: customer?.address || formData.deliveryAddress
                  });
                }}
                required
              >
                <option value="">Выберите клиента</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Статус</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Новый">Новый</option>
                <option value="В обработке">В обработке</option>
                <option value="Доставляется">Доставляется</option>
                <option value="Выполнен">Выполнен</option>
                <option value="Отменен">Отменен</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Товары</label>
            {formData.products.map((orderProduct, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'flex-end',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div style={{ flex: 2 }}>
                  <select
                    className="form-control"
                    value={orderProduct.id}
                    onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                    required
                  >
                    <option value="">Выберите товар</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price.toLocaleString('ru-RU')} ₽
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Кол-во"
                    min="1"
                    value={orderProduct.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addProduct}
                    style={{ padding: '8px' }}
                  >
                    <Plus size={16} />
                  </button>
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeProduct(index)}
                      style={{ padding: '8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Способ оплаты</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="Карта">Банковская карта</option>
                <option value="Наличные">Наличные</option>
                <option value="Перевод">Банковский перевод</option>
                <option value="Онлайн">Онлайн оплата</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Общая сумма</label>
              <input
                type="text"
                className="form-control"
                value={`${calculateTotal().toLocaleString('ru-RU')} ₽`}
                readOnly
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Адрес доставки</label>
            <textarea
              className="form-control"
              rows="2"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Примечания</label>
            <textarea
              className="form-control"
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Дополнительная информация о заказе..."
            />
          </div>

          <div className="actions" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {order ? 'Сохранить' : 'Создать заказ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => (
  <div className="modal-overlay">
    <div className="modal" style={{ maxWidth: '600px' }}>
      <div className="modal-header">
        <h2 className="modal-title">Заказ #{order.id}</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Основная информация */}
        <div>
          <h4>Информация о заказе</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div><strong>Дата:</strong> {format(new Date(order.date), 'dd.MM.yyyy', { locale: ru })}</div>
            <div><strong>Статус:</strong> 
              <span className={`status-badge status-${
                order.status === 'Новый' ? 'new' :
                order.status === 'В обработке' ? 'processing' :
                order.status === 'Выполнен' ? 'completed' :
                'cancelled'
              }`} style={{ marginLeft: '8px' }}>
                {order.status}
              </span>
            </div>
            <div><strong>Клиент:</strong> {order.customerName}</div>
            <div><strong>Оплата:</strong> {order.paymentMethod}</div>
          </div>
        </div>
        
        {/* Товары */}
        <div>
          <h4>Товары</h4>
          <table className="table" style={{ marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Товар</th>
                <th>Цена</th>
                <th>Кол-во</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString('ru-RU')} ₽</td>
                  <td>{product.quantity}</td>
                  <td>{(product.price * product.quantity).toLocaleString('ru-RU')} ₽</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 'bold' }}>
                <td colSpan="3">Итого:</td>
                <td>{order.total.toLocaleString('ru-RU')} ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Доставка */}
        <div>
          <h4>Доставка</h4>
          <p style={{ marginTop: '10px' }}><strong>Адрес:</strong> {order.deliveryAddress}</p>
          {order.notes && (
            <p><strong>Примечания:</strong> {order.notes}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Orders = () => {
  const { orders, addOrder, updateOrder, deleteOrder } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date.startsWith(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const statuses = [...new Set(orders.map(o => o.status))];

  const handleSave = (orderData) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleView = (order) => {
    setViewingOrder(order);
    setShowDetailModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      deleteOrder(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Новый': return '#007bff';
      case 'В обработке': return '#ffc107';
      case 'Доставляется': return '#17a2b8';
      case 'Выполнен': return '#28a745';
      case 'Отменен': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Управление заказами
          </h1>
          <p style={{ color: '#666' }}>
            Всего заказов: {orders.length}
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Создать заказ
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="grid grid-3">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по номеру заказа или клиенту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} />
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все статусы</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} />
            <input
              type="month"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Список заказов */}
      {filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ShoppingCart size={48} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Заказы не найдены</h3>
          <p style={{ color: '#999' }}>
            {searchTerm || statusFilter || dateFilter
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первый заказ'
            }
          </p>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>№ Заказа</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Товары</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Оплата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 'bold' }}>#{order.id}</td>
                    <td>{format(new Date(order.date), 'dd.MM.yyyy', { locale: ru })}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} />
                        {order.customerName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Package size={14} />
                        {order.products.length} товар(ов)
                      </div>
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                      {order.total.toLocaleString('ru-RU')} ₽
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(order.status) + '20',
                          color: getStatusColor(order.status)
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CreditCard size={14} />
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleView(order)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleEdit(order)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(order.id)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Модальные окна */}
      {showModal && (
        <OrderModal
          order={editingOrder}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingOrder(null);
          }}
        />
      )}

      {showDetailModal && viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => {
            setShowDetailModal(false);
            setViewingOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Orders;