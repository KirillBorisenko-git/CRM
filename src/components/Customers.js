import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const CustomerModal = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState(customer || {
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {customer ? 'Редактировать клиента' : 'Добавить клиента'}
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имя</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Телефон</label>
            <input
              type="tel"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Адрес</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>

          <div className="actions" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {customer ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerDetailModal = ({ customer, orders, onClose }) => {
  const customerOrders = orders.filter(order => order.customerId === customer.id);

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{customer.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Основная информация */}
          <div>
            <h4 style={{ marginBottom: '15px' }}>Контактная информация</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#666" />
                <span>{customer.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#666" />
                <span>{customer.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', gridColumn: '1 / -1' }}>
                <MapPin size={16} color="#666" style={{ marginTop: '2px' }} />
                <span>{customer.address}</span>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div>
            <h4 style={{ marginBottom: '15px' }}>Статистика</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  {customer.totalOrders}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Заказов</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {customer.totalSpent.toLocaleString('ru-RU')} ₽
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Потрачено</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
                  {customer.status}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Статус</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
                  {format(new Date(customer.registrationDate), 'dd.MM.yyyy', { locale: ru })}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Регистрация</div>
              </div>
            </div>
          </div>

          {/* История заказов */}
          <div>
            <h4 style={{ marginBottom: '15px' }}>История заказов ({customerOrders.length})</h4>
            {customerOrders.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Дата</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{format(new Date(order.date), 'dd.MM.yyyy', { locale: ru })}</td>
                        <td>{order.total.toLocaleString('ru-RU')} ₽</td>
                        <td>
                          <span className={`status-badge status-${
                            order.status === 'Новый' ? 'new' :
                            order.status === 'В обработке' ? 'processing' :
                            order.status === 'Выполнен' ? 'completed' :
                            'cancelled'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                У клиента пока нет заказов
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerCard = ({ customer, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return '#6f42c1';
      case 'Постоянный': return '#007bff';
      case 'Новый': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{customer.name}</h3>
          <div style={{ 
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: getStatusColor(customer.status) + '20',
            color: getStatusColor(customer.status)
          }}>
            {customer.status}
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary" onClick={() => onView(customer)} style={{ padding: '6px' }}>
            <Eye size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => onEdit(customer)} style={{ padding: '6px' }}>
            <Edit size={16} />
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(customer.id)} style={{ padding: '6px' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
          <Mail size={14} />
          <span>{customer.email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
          <Phone size={14} />
          <span>{customer.phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#666' }}>
          <MapPin size={14} style={{ marginTop: '2px' }} />
          <span style={{ lineHeight: '1.4' }}>{customer.address}</span>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '10px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
            {customer.totalOrders}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>Заказов</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
            {Math.round(customer.totalSpent / 1000)}k ₽
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>Потрачено</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fd7e14' }}>
            {format(new Date(customer.registrationDate), 'dd.MM', { locale: ru })}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>Регистрация</div>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = [...new Set(customers.map(c => c.status))];

  const handleSave = (customerData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleView = (customer) => {
    setViewingCustomer(customer);
    setShowDetailModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Управление клиентами
          </h1>
          <p style={{ color: '#666' }}>
            Всего клиентов: {customers.length}
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Добавить клиента
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="grid grid-2">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по имени, email или телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} />
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
        </div>
      </div>

      {/* Список клиентов */}
      {filteredCustomers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={48} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Клиенты не найдены</h3>
          <p style={{ color: '#999' }}>
            {searchTerm || statusFilter 
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первого клиента в базу'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Модальные окна */}
      {showModal && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {showDetailModal && viewingCustomer && (
        <CustomerDetailModal
          customer={viewingCustomer}
          orders={orders}
          onClose={() => {
            setShowDetailModal(false);
            setViewingCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default Customers;