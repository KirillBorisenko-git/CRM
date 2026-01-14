import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

const StatCard = ({ title, value, icon: Icon, color, change, changeType = 'percentage' }) => (
  <div className="card" style={{ 
    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
    border: `1px solid ${color}20`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{title}</p>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          {typeof value === 'number' && title.includes('₽') 
            ? `${value.toLocaleString('ru-RU')} ₽`
            : value.toLocaleString('ru-RU')
          }
        </p>
        {change !== undefined && (
          <p style={{ 
            fontSize: '14px', 
            color: change > 0 ? '#28a745' : change < 0 ? '#dc3545' : '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <TrendingUp size={14} style={{ 
              transform: change < 0 ? 'rotate(180deg)' : 'none' 
            }} />
            {change > 0 ? '+' : ''}{change}
            {changeType === 'percentage' ? '%' : ''} за месяц
          </p>
        )}
      </div>
      <div style={{ 
        padding: '16px', 
        borderRadius: '50%', 
        backgroundColor: color + '20',
        color: color
      }}>
        <Icon size={28} />
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="card">
    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <BarChart3 size={20} />
      {title}
    </h3>
    {children}
  </div>
);

const SimpleBarChart = ({ data, color = '#007bff' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '200px', padding: '20px 0' }}>
      {data.map((item, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flex: 1
        }}>
          <div style={{
            width: '100%',
            height: `${(item.value / maxValue) * 150}px`,
            backgroundColor: color,
            borderRadius: '4px 4px 0 0',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '4px'
          }}>
            {item.value > 0 && item.value.toLocaleString('ru-RU')}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            textAlign: 'center',
            transform: 'rotate(-45deg)',
            whiteSpace: 'nowrap'
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const TopProductsList = ({ products }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {products.map((product, index) => (
      <div key={product.id} style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: index === 0 ? '2px solid #ffd700' : '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: index === 0 ? '#ffd700' : '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {index === 0 ? <Award size={16} /> : index + 1}
          </div>
          <div>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>{product.name}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Продано: {product.soldQuantity} шт. • Выручка: {(product.soldQuantity * product.price).toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: '600', color: '#28a745' }}>
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
          <p style={{ fontSize: '12px', color: product.stock > 10 ? '#28a745' : '#ffc107' }}>
            Остаток: {product.stock}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const OrderStatusChart = ({ ordersByStatus }) => {
  const statusColors = {
    'Новый': '#007bff',
    'В обработке': '#ffc107',
    'Доставляется': '#17a2b8',
    'Выполнен': '#28a745',
    'Отменен': '#dc3545'
  };

  const total = Object.values(ordersByStatus).reduce((sum, count) => sum + count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Object.entries(ordersByStatus).map(([status, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: '100px', fontSize: '14px' }}>{status}</div>
            <div style={{ 
              flex: 1, 
              height: '20px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: statusColors[status] || '#6c757d',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              minWidth: '60px', 
              textAlign: 'right',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {count} ({Math.round(percentage)}%)
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Analytics = () => {
  const { analytics, orders, customers, products } = useData();
  const [timeRange, setTimeRange] = useState('6months');

  // Подготовка данных для графика выручки по месяцам
  const getMonthlyRevenueData = () => {
    const months = timeRange === '6months' ? 6 : 12;
    const endDate = new Date();
    const startDate = subMonths(endDate, months - 1);
    
    const monthsArray = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return monthsArray.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      const revenue = analytics.monthlyRevenue[monthKey] || 0;
      return {
        label: format(month, 'MMM yyyy', { locale: ru }),
        value: revenue
      };
    });
  };

  // Расчет изменений за месяц (примерные данные)
  const calculateMonthlyChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const monthlyRevenueData = getMonthlyRevenueData();
  const currentMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 1]?.value || 0;
  const previousMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 2]?.value || 0;

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Аналитика и отчеты
            </h1>
            <p style={{ color: '#666' }}>
              Детальная статистика работы магазина
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} />
            <select
              className="form-control"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="6months">Последние 6 месяцев</option>
              <option value="12months">Последние 12 месяцев</option>
            </select>
          </div>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-2" style={{ marginBottom: '30px' }}>
        <div className="grid grid-2">
          <StatCard
            title="Общая выручка"
            value={analytics.totalRevenue}
            icon={DollarSign}
            color="#28a745"
            change={calculateMonthlyChange(currentMonthRevenue, previousMonthRevenue)}
          />
          <StatCard
            title="Всего заказов"
            value={analytics.totalOrders}
            icon={ShoppingCart}
            color="#007bff"
            change={8}
          />
          <StatCard
            title="Активные клиенты"
            value={analytics.totalCustomers}
            icon={Users}
            color="#6f42c1"
            change={15}
          />
          <StatCard
            title="Товары в каталоге"
            value={analytics.totalProducts}
            icon={Package}
            color="#fd7e14"
            change={-2}
          />
        </div>
      </div>

      {/* Дополнительные метрики */}
      <div className="grid grid-2" style={{ marginBottom: '30px' }}>
        <div className="grid grid-2">
          <StatCard
            title="Средний чек"
            value={Math.round(analytics.averageOrderValue)}
            icon={Target}
            color="#17a2b8"
            change={5}
          />
          <StatCard
            title="Конверсия"
            value={`${Math.round((analytics.totalOrders / analytics.totalCustomers) * 100)}%`}
            icon={Activity}
            color="#e83e8c"
            change={3}
          />
        </div>
      </div>

      {/* Графики и детальная аналитика */}
      <div className="grid grid-2">
        <div>
          {/* График выручки */}
          <ChartCard title="Выручка по месяцам">
            <SimpleBarChart 
              data={monthlyRevenueData} 
              color="#28a745"
            />
          </ChartCard>

          {/* Статус заказов */}
          <ChartCard title="Распределение заказов по статусам">
            <OrderStatusChart ordersByStatus={analytics.ordersByStatus} />
          </ChartCard>
        </div>

        <div>
          {/* Топ товары */}
          <ChartCard title="Топ-5 товаров по продажам">
            <TopProductsList products={analytics.topProducts} />
          </ChartCard>

          {/* Быстрая статистика */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Ключевые показатели</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} color="#28a745" />
                  Выручка за текущий месяц:
                </span>
                <strong style={{ color: '#28a745' }}>
                  {currentMonthRevenue.toLocaleString('ru-RU')} ₽
                </strong>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={16} color="#007bff" />
                  Заказов в обработке:
                </span>
                <strong style={{ color: '#007bff' }}>
                  {analytics.ordersByStatus['В обработке'] || 0}
                </strong>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} color="#fd7e14" />
                  Товаров заканчивается:
                </span>
                <strong style={{ color: '#fd7e14' }}>
                  {products.filter(p => p.stock <= 5).length}
                </strong>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#6f42c1" />
                  VIP клиентов:
                </span>
                <strong style={{ color: '#6f42c1' }}>
                  {customers.filter(c => c.status === 'VIP').length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;