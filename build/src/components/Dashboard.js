import React from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  DollarSign,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="card" style={{ 
    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
    border: `1px solid ${color}30`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{title}</p>
        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
          {typeof value === 'number' && title.includes('₽') 
            ? `${value.toLocaleString('ru-RU')} ₽`
            : value.toLocaleString('ru-RU')
          }
        </p>
        {trend && (
          <p style={{ 
            fontSize: '12px', 
            color: trend > 0 ? '#28a745' : '#dc3545',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <TrendingUp size={12} />
            {trend > 0 ? '+' : ''}{trend}% за месяц
          </p>
        )}
      </div>
      <div style={{ 
        padding: '12px', 
        borderRadius: '50%', 
        backgroundColor: color + '20',
        color: color
      }}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const RecentOrdersTable = ({ orders }) => (
  <div className="card">
    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ShoppingCart size={20} />
      Последние заказы
    </h3>
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>№ Заказа</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customerName}</td>
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
              <td>{format(new Date(order.date), 'dd.MM.yyyy', { locale: ru })}</td>
              <td>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                  <Eye size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TopProductsCard = ({ products }) => (
  <div className="card">
    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Package size={20} />
      Топ товары
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {products.map((product, index) => (
        <div key={product.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            <div>
              <p style={{ fontWeight: '500', marginBottom: '2px' }}>{product.name}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Продано: {product.soldQuantity} шт.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: '500' }}>{product.price.toLocaleString('ru-RU')} ₽</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Остаток: {product.stock} шт.
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const { analytics } = useData();

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          Панель управления
        </h1>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-2" style={{ marginBottom: '30px' }}>
        <div className="grid grid-2">
          <StatCard
            title="Общая выручка"
            value={analytics.totalRevenue}
            icon={DollarSign}
            color="#28a745"
            trend={12.5}
          />
          <StatCard
            title="Всего заказов"
            value={analytics.totalOrders}
            icon={ShoppingCart}
            color="#007bff"
            trend={8.2}
          />
          <StatCard
            title="Клиенты"
            value={analytics.totalCustomers}
            icon={Users}
            color="#6f42c1"
            trend={15.3}
          />
          <StatCard
            title="Товары"
            value={analytics.totalProducts}
            icon={Package}
            color="#fd7e14"
            trend={-2.1}
          />
        </div>
      </div>

      {/* Основной контент */}
      <div className="grid grid-2">
        <div>
          <RecentOrdersTable orders={analytics.recentOrders} />
        </div>
        <div>
          <TopProductsCard products={analytics.topProducts} />
          
          {/* Дополнительная статистика */}
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>Быстрая статистика</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Средний чек:</span>
                <strong>{Math.round(analytics.averageOrderValue).toLocaleString('ru-RU')} ₽</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Заказов в обработке:</span>
                <strong>{analytics.ordersByStatus['В обработке'] || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Выполненных заказов:</span>
                <strong>{analytics.ordersByStatus['Выполнен'] || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Товаров в наличии:</span>
                <strong>{analytics.totalProducts}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;