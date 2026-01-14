import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="card">
    <h3 style={{ 
      marginBottom: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      paddingBottom: '10px',
      borderBottom: '1px solid #eee'
    }}>
      <Icon size={20} />
      {title}
    </h3>
    {children}
  </div>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    // Профиль пользователя
    profile: {
      name: 'Администратор',
      email: 'admin@phonestore.com',
      phone: '+7 (999) 123-45-67',
      role: 'Администратор'
    },
    
    // Настройки уведомлений
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      lowStockAlerts: true,
      customerRegistration: false,
      dailyReports: true
    },
    
    // Настройки системы
    system: {
      currency: 'RUB',
      timezone: 'Europe/Moscow',
      language: 'ru',
      dateFormat: 'dd.MM.yyyy',
      lowStockThreshold: 5
    }
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileChange = (field, value) => {
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value }
    });
  };

  const handleNotificationChange = (field, value) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
  };

  const handleSystemChange = (field, value) => {
    setSettings({
      ...settings,
      system: { ...settings.system, [field]: value }
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('crm-settings', JSON.stringify(settings));
    alert('Настройки сохранены!');
  };

  const handleExportData = () => {
    const data = {
      products: JSON.parse(localStorage.getItem('crm-products') || '[]'),
      customers: JSON.parse(localStorage.getItem('crm-customers') || '[]'),
      orders: JSON.parse(localStorage.getItem('crm-orders') || '[]'),
      settings: settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phone-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.products) localStorage.setItem('crm-products', JSON.stringify(data.products));
          if (data.customers) localStorage.setItem('crm-customers', JSON.stringify(data.customers));
          if (data.orders) localStorage.setItem('crm-orders', JSON.stringify(data.orders));
          if (data.settings) setSettings(data.settings);
          alert('Данные успешно импортированы! Перезагрузите страницу для применения изменений.');
        } catch (error) {
          alert('Ошибка при импорте данных. Проверьте формат файла.');
        }
      };
      reader.readAsText(file);
    }
  };

 

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'system', label: 'Система', icon: SettingsIcon },
    
  ];

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          Настройки системы
        </h1>
        <p style={{ color: '#666' }}>
          Управление настройками CRM системы
        </p>
      </div>

      {/* Табы */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '10px 16px'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Содержимое табов */}
      {activeTab === 'profile' && (
        <SettingsSection title="Профиль пользователя" icon={User}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Имя</label>
              <input
                type="text"
                className="form-control"
                value={settings.profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={settings.profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input
                type="tel"
                className="form-control"
                value={settings.profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Роль</label>
              <select
                className="form-control"
                value={settings.profile.role}
                onChange={(e) => handleProfileChange('role', e.target.value)}
              >
                <option value="Администратор">Администратор</option>
                <option value="Менеджер">Менеджер</option>
                <option value="Оператор">Оператор</option>
              </select>
            </div>
          </div>
        </SettingsSection>
      )}

      {activeTab === 'notifications' && (
        <SettingsSection title="Настройки уведомлений" icon={Bell}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Email уведомления</strong>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
                  Получать уведомления на электронную почту
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Включено</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Уведомления о заказах</strong>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
                  Уведомления о новых заказах и изменении статуса
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.orderNotifications}
                  onChange={(e) => handleNotificationChange('orderNotifications', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Включено</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Предупреждения о низких остатках</strong>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
                  Уведомления когда товар заканчивается на складе
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.lowStockAlerts}
                  onChange={(e) => handleNotificationChange('lowStockAlerts', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Включено</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Регистрация новых клиентов</strong>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
                  Уведомления о регистрации новых клиентов
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.customerRegistration}
                  onChange={(e) => handleNotificationChange('customerRegistration', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Включено</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Ежедневные отчеты</strong>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
                  Получать ежедневные отчеты о продажах
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.dailyReports}
                  onChange={(e) => handleNotificationChange('dailyReports', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Включено</span>
              </label>
            </div>
          </div>
        </SettingsSection>
      )}

      {activeTab === 'system' && (
        <SettingsSection title="Системные настройки" icon={SettingsIcon}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Валюта</label>
              <select
                className="form-control"
                value={settings.system.currency}
                onChange={(e) => handleSystemChange('currency', e.target.value)}
              >
                <option value="RUB">Российский рубль (₽)</option>
                <option value="USD">Доллар США ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Часовой пояс</label>
              <select
                className="form-control"
                value={settings.system.timezone}
                onChange={(e) => handleSystemChange('timezone', e.target.value)}
              >
                <option value="Europe/Moscow">Москва (UTC+3)</option>
                <option value="Europe/Ekaterinburg">Екатеринбург (UTC+5)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Язык интерфейса</label>
              <select
                className="form-control"
                value={settings.system.language}
                onChange={(e) => handleSystemChange('language', e.target.value)}
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Формат даты</label>
              <select
                className="form-control"
                value={settings.system.dateFormat}
                onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
              >
                <option value="dd.MM.yyyy">ДД.ММ.ГГГГ</option>
                <option value="MM/dd/yyyy">ММ/ДД/ГГГГ</option>
                <option value="yyyy-MM-dd">ГГГГ-ММ-ДД</option>
              </select>
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Порог низких остатков</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="100"
                value={settings.system.lowStockThreshold}
                onChange={(e) => handleSystemChange('lowStockThreshold', parseInt(e.target.value))}
                style={{ maxWidth: '200px' }}
              />
              <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                Количество товара, при котором система будет предупреждать о низких остатках
              </p>
            </div>
          </div>
        </SettingsSection>
      )}

      

      {/* Кнопка сохранения */}
      <div style={{ 
        position: 'sticky', 
        bottom: '20px', 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginTop: '30px'
      }}>
        <button 
          className="btn btn-success"
          onClick={handleSaveSettings}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px 24px',
            fontSize: '16px'
          }}
        >
          <Save size={18} />
          Сохранить настройки
        </button>
      </div>
    </div>
  );
};

export default Settings;