import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Начальные данные
const initialProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    price: 89990,
    stock: 25,
    category: 'Смартфоны',
    description: 'Новейший iPhone с процессором A17 Pro',
    image: '/api/placeholder/200/200',
    specifications: {
      display: '6.1" Super Retina XDR',
      processor: 'A17 Pro',
      memory: '128GB',
      camera: '48MP + 12MP + 12MP',
      battery: '3274 mAh'
    }
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    model: 'Galaxy S24',
    price: 79990,
    stock: 18,
    category: 'Смартфоны',
    description: 'Флагманский смартфон Samsung с AI функциями',
    image: '/api/placeholder/200/200',
    specifications: {
      display: '6.2" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      memory: '256GB',
      camera: '50MP + 12MP + 10MP',
      battery: '4000 mAh'
    }
  },
  {
    id: 3,
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    model: '14',
    price: 54990,
    stock: 32,
    category: 'Смартфоны',
    description: 'Мощный смартфон с отличным соотношением цена/качество',
    image: '/api/placeholder/200/200',
    specifications: {
      display: '6.36" AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      memory: '256GB',
      camera: '50MP + 50MP + 50MP',
      battery: '4610 mAh'
    }
  }
];

const initialCustomers = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan.petrov@email.com',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Тверская, д. 10',
    registrationDate: '2024-01-15',
    totalOrders: 3,
    totalSpent: 245970,
    status: 'VIP'
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    email: 'maria.sidorova@email.com',
    phone: '+7 (999) 234-56-78',
    address: 'г. Санкт-Петербург, Невский пр., д. 25',
    registrationDate: '2024-02-20',
    totalOrders: 1,
    totalSpent: 79990,
    status: 'Обычный'
  },
  {
    id: 3,
    name: 'Алексей Козлов',
    email: 'alexey.kozlov@email.com',
    phone: '+7 (999) 345-67-89',
    address: 'г. Екатеринбург, ул. Ленина, д. 50',
    registrationDate: '2024-03-10',
    totalOrders: 2,
    totalSpent: 134980,
    status: 'Постоянный'
  }
];

const initialOrders = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Иван Петров',
    products: [
      { id: 1, name: 'iPhone 15 Pro', price: 89990, quantity: 1 }
    ],
    total: 89990,
    status: 'Выполнен',
    date: '2024-01-20',
    paymentMethod: 'Карта',
    deliveryAddress: 'г. Москва, ул. Тверская, д. 10',
    notes: 'Доставка до двери'
  },
  {
    id: 2,
    customerId: 2,
    customerName: 'Мария Сидорова',
    products: [
      { id: 2, name: 'Samsung Galaxy S24', price: 79990, quantity: 1 }
    ],
    total: 79990,
    status: 'В обработке',
    date: '2024-01-22',
    paymentMethod: 'Наличные',
    deliveryAddress: 'г. Санкт-Петербург, Невский пр., д. 25',
    notes: 'Звонить за час до доставки'
  },
  {
    id: 3,
    customerId: 1,
    customerName: 'Иван Петров',
    products: [
      { id: 3, name: 'Xiaomi 14', price: 54990, quantity: 2 }
    ],
    total: 109980,
    status: 'Доставляется',
    date: '2024-01-25',
    paymentMethod: 'Карта',
    deliveryAddress: 'г. Москва, ул. Тверская, д. 10',
    notes: 'Подарочная упаковка'
  }
];

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('crm-products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('crm-customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('crm-orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Сохранение в localStorage при изменении данных
  useEffect(() => {
    localStorage.setItem('crm-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('crm-customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('crm-orders', JSON.stringify(orders));
  }, [orders]);

  // Функции для работы с товарами
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Функции для работы с клиентами
  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: Math.max(...customers.map(c => c.id), 0) + 1,
      registrationDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      status: 'Новый'
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id, updatedCustomer) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updatedCustomer } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Функции для работы с заказами
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, newOrder]);

    // Обновляем статистику клиента
    const customer = customers.find(c => c.id === order.customerId);
    if (customer) {
      updateCustomer(customer.id, {
        totalOrders: customer.totalOrders + 1,
        totalSpent: customer.totalSpent + order.total
      });
    }
  };

  const updateOrder = (id, updatedOrder) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  // Вычисляемые значения для аналитики
  const analytics = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
    topProducts: products
      .map(product => ({
        ...product,
        soldQuantity: orders.reduce((sum, order) => {
          const orderProduct = order.products.find(p => p.id === product.id);
          return sum + (orderProduct ? orderProduct.quantity : 0);
        }, 0)
      }))
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5),
    recentOrders: orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10),
    ordersByStatus: orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}),
    monthlyRevenue: orders.reduce((acc, order) => {
      const month = order.date.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + order.total;
      return acc;
    }, {})
  };

  const value = {
    // Данные
    products,
    customers,
    orders,
    analytics,
    
    // Функции для товаров
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Функции для клиентов
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Функции для заказов
    addOrder,
    updateOrder,
    deleteOrder
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};