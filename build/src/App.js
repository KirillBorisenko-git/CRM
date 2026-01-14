import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Phone,
  Menu,
  X
} from 'lucide-react';

// Импорт компонентов
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Analytics from './components/Analytics';
import SettingsPage from './components/Settings';

// Контекст для данных
import { DataProvider } from './context/DataContext';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/products', icon: Package, label: 'Товары' },
    { path: '/customers', icon: Users, label: 'Клиенты' },
    { path: '/orders', icon: ShoppingCart, label: 'Заказы' },
    { path: '/analytics', icon: BarChart3, label: 'Аналитика' },
    { path: '/settings', icon: Settings, label: 'Настройки' }
  ];

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Phone size={24} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Phone Store</span>
        </div>

        {/* Desktop Menu */}
        <div style={{ 
          display: 'flex', 
          gap: '20px',
          '@media (max-width: 768px)': { display: 'none' }
        }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: location.pathname === path ? '#3498db' : 'white',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            '@media (max-width: 768px)': { display: 'block' }
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          backgroundColor: '#2c3e50',
          borderTop: '1px solid #34495e',
          padding: '10px 0'
        }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: location.pathname === path ? '#3498db' : 'white',
                textDecoration: 'none',
                padding: '12px 20px',
                borderBottom: '1px solid #34495e'
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;