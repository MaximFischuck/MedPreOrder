// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let cart = [];
const CART_STORAGE_KEY = 'cart';

// products теперь импортируется из data.js

// ==================== ВАЛИДАЦИЯ ====================

function validateFullName(fullName) {
    // ФИО должно содержать только буквы, пробелы, дефисы и апострофы
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/u;
    if (!fullName.trim()) {
        return { isValid: false, message: 'ФИО обязательно для заполнения' };
    }
    
    if (!nameRegex.test(fullName)) {
        return { isValid: false, message: 'ФИО может содержать только буквы, пробелы и дефисы' };
    }
    
    // Проверяем, что есть как минимум 2 слова (имя и фамилия)
    const words = fullName.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 2) {
        return { isValid: false, message: 'Введите имя и фамилию' };
    }
    
    // Проверяем длину каждого слова
    for (const word of words) {
        if (word.length < 2) {
            return { isValid: false, message: 'Каждое слово должно содержать минимум 2 буквы' };
        }
    }
    
    return { isValid: true, message: '' };
}

function validatePhone(phone) {
    // Российский телефон: +7 xxx xxx xx xx или 8 xxx xxx xx xx или другие форматы
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    
    if (!phone.trim()) {
        return { isValid: false, message: 'Телефон обязателен для заполнения' };
    }
    
    // Убираем все пробелы и дефисы для проверки
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(phone)) {
        return { isValid: false, message: 'Введите корректный номер телефона' };
    }
    
    // Проверяем длину номера (должно быть 10-11 цифр без кода страны)
    let digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.startsWith('7') || digitsOnly.startsWith('8')) {
        digitsOnly = digitsOnly.substring(1);
    }
    
    if (digitsOnly.length !== 10) {
        return { isValid: false, message: 'Номер телефона должен содержать 10 цифр' };
    }
    
    return { isValid: true, message: '' };
}

function validateEmail(email) {
    if (!email.trim()) {
        return { isValid: false, message: 'Email обязателен для заполнения' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Введите корректный email адрес' };
    }
    
    // Проверяем длину доменной части
    const parts = email.split('@');
    if (parts[1].split('.')[0].length < 2) {
        return { isValid: false, message: 'Некорректный email адрес' };
    }
    
    return { isValid: true, message: '' };
}

// Функция для форматирования телефона в красивый вид
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
        formatted = '+7 (' + cleaned.substring(1, 4) + ') ' + cleaned.substring(4, 7) + '-' + cleaned.substring(7, 9) + '-' + cleaned.substring(9, 11);
    } else if (cleaned.length === 10) {
        formatted = '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6, 8) + '-' + cleaned.substring(8, 10);
    }
    
    return formatted;
}

// Функция для отображения ошибок валидации
function showValidationError(inputId, message, isValid) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`) || createErrorElement(inputId);
    
    if (!isValid) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        input.classList.remove('error');
        errorElement.style.display = 'none';
    }
    
    return isValid;
}

function createErrorElement(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.createElement('div');
    errorElement.id = `${inputId}-error`;
    errorElement.className = 'validation-error';
    errorElement.style.color = '#f44336';
    errorElement.style.fontSize = '14px';
    errorElement.style.marginTop = '5px';
    errorElement.style.display = 'none';
    
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    return errorElement;
}

// Функция для проверки всей формы
function validateOrderForm() {
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    const fullNameValidation = validateFullName(fullName);
    const phoneValidation = validatePhone(phone);
    const emailValidation = validateEmail(email);
    
    const isFullNameValid = showValidationError('fullName', fullNameValidation.message, fullNameValidation.isValid);
    const isPhoneValid = showValidationError('phone', phoneValidation.message, phoneValidation.isValid);
    const isEmailValid = showValidationError('email', emailValidation.message, emailValidation.isValid);
    
    return isFullNameValid && isPhoneValid && isEmailValid;
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ КОРЗИНЫ ====================

function loadCartFromStorage() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
            cart = JSON.parse(cartData);
            console.log('Корзина загружена из localStorage:', cart);
        } else {
            cart = [];
            console.log('Корзина пуста в localStorage');
        }
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        cart = [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        console.log('Корзина сохранена в localStorage:', cart);
    } catch (error) {
        console.error('Ошибка сохранения корзины:', error);
    }
}

function getProductById(productId) {
    return products.find(p => p.id === productId);
}

function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Товар не найден:', productId);
        return false;
    }
    
    if (product.prescription) {
        if (!confirm('Это рецептурный препарат. У вас есть рецепт?')) {
            return false;
        }
    }
    
    if (!product.inStock) {
        showNotification('Товар отсутствует в наличии', 'error');
        return false;
    }
    
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showNotification(`${product.name} добавлен в корзину`, 'success');
    return true;
}

function removeFromCart(productId) {
    const product = getProductById(productId);
    cart = cart.filter(item => item.productId !== productId);
    saveCartToStorage();
    updateCartUI();
    if (product) {
        showNotification(`${product.name} удален из корзины`, 'info');
    }
    return true;
}

function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        return removeFromCart(productId);
    }
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartUI();
        return true;
    }
    return false;
}

function clearCart() {
    if (confirm('Очистить всю корзину?')) {
        cart = [];
        localStorage.removeItem(CART_STORAGE_KEY);
        updateCartUI();
        showNotification('Корзина очищена', 'info');
        return true;
    }
    return false;
}

function getTotalItemsCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotalPrice() {
    return cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

// ==================== ФУНКЦИИ UI ====================

function updateCartUI() {
    console.log('Обновление UI корзины, количество товаров:', getTotalItemsCount());
    
    // Обновляем счетчик корзины
    document.querySelectorAll('#cart-count').forEach(element => {
        const count = getTotalItemsCount();
        element.textContent = count;
        element.style.display = count > 0 ? 'inline-flex' : 'none';
    });
    
    // Обновляем страницу корзины
    const cartItemsElement = document.getElementById('cart-items');
    if (cartItemsElement) {
        console.log('Найдена страница корзины, товаров:', cart.length);
        
        if (cart.length === 0) {
            document.getElementById('empty-cart-message').style.display = 'block';
            document.getElementById('cart-summary').style.display = 'none';
            cartItemsElement.innerHTML = '';
        } else {
            document.getElementById('empty-cart-message').style.display = 'none';
            document.getElementById('cart-summary').style.display = 'block';
            
            cartItemsElement.innerHTML = cart.map(item => {
                const product = getProductById(item.productId);
                if (!product) return '';
                
                return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${product.image}" alt="${product.name}" width="80" height="80">
                    </div>
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${product.name}</h3>
                        <p class="cart-item-description">${product.description}</p>
                        <div class="cart-item-meta">
                            <span class="cart-item-category">${product.category}</span>
                            ${product.prescription ? '<span class="prescription-badge">Рецептурный</span>' : ''}
                        </div>
                    </div>
                    <div class="cart-item-price-info">
                        <span class="price-per-item">${product.price} ₽ × ${item.quantity}</span>
                        <span class="item-total">${product.price * item.quantity} ₽</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" onclick="window.updateCartItemQuantity(${product.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="window.updateCartItemQuantity(${product.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="window.removeFromCart(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                `;
            }).join('');
            
            document.getElementById('cart-total').textContent = getCartTotalPrice() + ' ₽';
            document.getElementById('items-count').textContent = getTotalItemsCount();
        }
    }
    
    // Обновляем каталог товаров, если он есть на странице
    updateProductCatalog();
    
    // Если мы на странице оформления заказа, обновляем и её
    updateOrderPage();
}

function updateProductCatalog() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Определяем активный фильтр
    let activeFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            const match = btn.onclick?.toString().match(/filterProducts\('([^']+)'\)/);
            if (match) activeFilter = match[1];
        }
    });
    
    // Фильтруем товары
    let filteredProducts = products;
    if (activeFilter !== 'all') {
        filteredProducts = products.filter(p => p.category === activeFilter);
    }
    
    // Отображаем товары
    productsGrid.innerHTML = filteredProducts.map(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        const inCartCount = cartItem ? cartItem.quantity : 0;
        
        return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${!product.inStock ? '<span class="out-of-stock">Нет в наличии</span>' : ''}
                ${product.prescription ? '<span class="prescription">Рецептурный</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-category">${product.category}</span>
                    <span class="product-form">${product.form}, ${product.quantity}</span>
                </div>
                <div class="product-price">${product.price} ₽</div>
            </div>
            <div class="product-actions">
                ${inCartCount > 0 ? `
                    <div class="quantity-controls">
                        <button class="qty-btn minus" onclick="window.updateCartItemQuantity(${product.id}, ${inCartCount - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-display">${inCartCount} в корзине</span>
                        <button class="qty-btn plus" onclick="window.updateCartItemQuantity(${product.id}, ${inCartCount + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                ` : `
                    <button class="add-to-cart-btn" onclick="window.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        ${!product.inStock ? 'Нет в наличии' : 'В корзину'}
                    </button>
                `}
                <button class="view-details-btn" onclick="window.showProductDetails(${product.id})">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function filterProducts(category) {
    // Обновляем активную кнопку
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ищем кнопку, которая вызвала функцию
    let targetBtn = event?.target;
    if (targetBtn?.tagName === 'I') {
        targetBtn = targetBtn.parentElement;
    }
    if (targetBtn) targetBtn.classList.add('active');
    
    // Обновляем каталог
    updateProductCatalog();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// ==================== ФУНКЦИЯ ДЛЯ КАРТОЧКИ ПРЕПАРАТА ====================

function showProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <div class="modal-left">
                    <div class="modal-product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="image-badges">
                            ${product.prescription ? '<span class="prescription-badge">Рецептурный</span>' : ''}
                            ${product.inStock ? '<span class="in-stock-badge">В наличии</span>' : '<span class="out-of-stock-badge">Нет в наличии</span>'}
                        </div>
                    </div>
                    
                    <div class="modal-price-section">
                        <div class="modal-price">${product.price} ₽</div>
                        <div class="product-form-info">
                            <span class="form-type">${product.form}</span>
                            <span class="quantity-info">${product.quantity}</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-add-to-cart" onclick="window.addToCart(${product.id}, 1)" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                            ${!product.inStock ? 'Нет в наличии' : 'Добавить в корзину'}
                        </button>
                        <button class="modal-prescription-btn" onclick="window.showPrescriptionInfo(${product.id})" ${product.prescription ? '' : 'style="display: none"'}>
                            <i class="fas fa-prescription"></i>
                            Информация о рецепте
                        </button>
                    </div>
                </div>
                
                <div class="modal-right">
                    <div class="modal-header">
                        <h2>${product.name}</h2>
                        <div class="product-meta">
                            <span class="product-category">${product.category}</span>
                            <span class="active-substance">Действующее вещество: ${product.activeSubstance}</span>
                        </div>
                    </div>
                    
                    <div class="modal-sections">
                        <div class="modal-section">
                            <h3><i class="fas fa-info-circle"></i> Описание</h3>
                            <p>${product.detailedDescription}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-capsules"></i> Состав</h3>
                            <p>${product.composition}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-syringe"></i> Способ применения и дозы</h3>
                            <p>${product.dosage}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-ban"></i> Противопоказания</h3>
                            <p>${product.contraindications}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-exclamation-triangle"></i> Побочные действия</h3>
                            <p>${product.sideEffects}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-industry"></i> Производитель</h3>
                            <p>${product.manufacturer}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-archive"></i> Условия хранения</h3>
                            <p>${product.storageConditions}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-calendar-alt"></i> Срок годности</h3>
                            <p>${product.shelfLife}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-barcode"></i> Код АТХ</h3>
                            <p>${product.atcCode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие модального окна
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    // Добавляем табы для мобильной версии
    if (window.innerWidth <= 768) {
        addMobileTabs(modal, product);
    }
}

function addMobileTabs(modal, product) {
    const sections = modal.querySelectorAll('.modal-section');
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'mobile-tabs';
    
    const sectionsData = [
        { icon: 'fa-info-circle', title: 'Описание', content: product.detailedDescription },
        { icon: 'fa-capsules', title: 'Состав', content: product.composition },
        { icon: 'fa-syringe', title: 'Дозировка', content: product.dosage },
        { icon: 'fa-ban', title: 'Противопоказания', content: product.contraindications },
        { icon: 'fa-exclamation-triangle', title: 'Побочные эффекты', content: product.sideEffects },
        { icon: 'fa-industry', title: 'Производитель', content: product.manufacturer },
        { icon: 'fa-archive', title: 'Хранение', content: product.storageConditions },
        { icon: 'fa-calendar-alt', title: 'Срок годности', content: product.shelfLife },
        { icon: 'fa-barcode', title: 'Код АТХ', content: product.atcCode }
    ];
    
    // Скрываем все секции
    sections.forEach(section => section.style.display = 'none');
    
    // Создаем табы
    tabsContainer.innerHTML = `
        <div class="tabs-header">
            ${sectionsData.map((section, index) => `
                <button class="tab-btn ${index === 0 ? 'active' : ''}" data-tab="${index}">
                    <i class="fas ${section.icon}"></i>
                    <span>${section.title}</span>
                </button>
            `).join('')}
        </div>
        <div class="tab-content">
            ${sectionsData.map((section, index) => `
                <div class="tab-pane ${index === 0 ? 'active' : ''}" data-tab="${index}">
                    <h4>${section.title}</h4>
                    <p>${section.content}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    // Вставляем табы перед секциями
    const sectionsContainer = modal.querySelector('.modal-sections');
    sectionsContainer.parentNode.insertBefore(tabsContainer, sectionsContainer);
    sectionsContainer.style.display = 'none';
    
    // Настраиваем переключение табов
    modal.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
            
            // Скрываем все содержимое табов
            modal.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            // Показываем выбранное содержимое
            const tabIndex = btn.getAttribute('data-tab');
            modal.querySelector(`.tab-pane[data-tab="${tabIndex}"]`).classList.add('active');
        });
    });
}

function showPrescriptionInfo(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    alert(`Информация о рецепте для ${product.name}:\n\n` +
          `Этот препарат отпускается только по рецепту врача.\n` +
          `Для покупки необходим оригинал рецепта с печатью врача.\n` +
          `Рецепт должен быть выписан на официальном бланке.\n` +
          `Срок действия рецепта: 30 дней с даты выписки.\n` +
          `Действующее вещество: ${product.activeSubstance}\n` +
          `Код АТХ: ${product.atcCode}`);
}

// ==================== ФУНКЦИИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ====================

function loadPopularProducts() {
    const popularProductsContainer = document.getElementById('popular-products');
    if (popularProductsContainer && products) {
        console.log('Загрузка популярных товаров...');
        // Берем первые 4 товара как популярные
        const popularProducts = products.slice(0, 4);
        
        popularProductsContainer.innerHTML = popularProducts.map(product => {
            const cartItem = cart.find(item => item.productId === product.id);
            const inCartCount = cartItem ? cartItem.quantity : 0;
            
            return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.prescription ? '<span class="prescription">Рецептурный</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-price">${product.price} ₽</div>
                </div>
                <div class="product-actions">
                    ${inCartCount > 0 ? `
                        <div class="quantity-controls">
                            <button class="qty-btn minus" onclick="window.updateCartItemQuantity(${product.id}, ${inCartCount - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qty-display">${inCartCount} в корзине</span>
                            <button class="qty-btn plus" onclick="window.updateCartItemQuantity(${product.id}, ${inCartCount + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    ` : `
                        <button class="add-to-cart-btn" onclick="window.addToCart(${product.id}, 1)" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                            ${!product.inStock ? 'Нет в наличии' : 'В корзину'}
                        </button>
                    `}
                    <button class="view-details-btn" onclick="window.showProductDetails(${product.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }
}

// ==================== ФУНКЦИИ ДЛЯ СТРАНИЦЫ ОФОРМЛЕНИЯ ЗАКАЗА ====================

function updateOrderPage() {
    // Проверяем, находимся ли мы на странице оформления заказа
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;
    
    // Проверяем корзину
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>Корзина пуста</h3>
                <a href="catalog.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    Перейти в каталог
                </a>
            </div>
        `;
        return;
    }
    
    // Обновляем список товаров в заказе
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-name">${product.name}</div>
                        <div class="order-item-quantity">Количество: ${item.quantity} шт.</div>
                    </div>
                    <div class="order-item-price">${itemTotal} ₽</div>
                </div>
            `;
        }
    });
    
    orderItemsContainer.innerHTML = itemsHTML;
    
    // Считаем стоимость доставки
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    let deliveryCost = 0;
    
    if (deliveryMethod) {
        if (deliveryMethod.value === 'delivery') {
            // Бесплатная доставка от 3000 рублей
            deliveryCost = total >= 3000 ? 0 : 300;
        }
    }
    
    // Обновляем отображение сумм
    document.getElementById('itemsTotal').textContent = total + ' ₽';
    document.getElementById('deliveryCost').textContent = deliveryCost + ' ₽';
    document.getElementById('totalAmount').textContent = (total + deliveryCost) + ' ₽';
}

function setupValidationListeners() {
    // Валидация при вводе для ФИО
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
        fullNameInput.addEventListener('input', function() {
            const validation = validateFullName(this.value);
            showValidationError('fullName', validation.message, validation.isValid);
        });
        
        // Форматирование при потери фокуса - убираем лишние пробелы
        fullNameInput.addEventListener('blur', function() {
            this.value = this.value.trim().replace(/\s+/g, ' ');
        });
    }
    
    // Валидация для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Форматируем телефон в реальном времени
            let value = this.value.replace(/\D/g, '');
            
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
                if (value.length > 0) {
                    formatted += ' (' + value.substring(0, Math.min(3, value.length));
                }
                if (value.length > 3) {
                    formatted += ') ' + value.substring(3, Math.min(6, value.length));
                }
                if (value.length > 6) {
                    formatted += '-' + value.substring(6, Math.min(8, value.length));
                }
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, Math.min(10, value.length));
                }
            }
            
            this.value = formatted;
            
            // Проверяем валидность
            const validation = validatePhone(this.value);
            showValidationError('phone', validation.message, validation.isValid);
        });
        
        // Валидация при потери фокуса
        phoneInput.addEventListener('blur', function() {
            const validation = validatePhone(this.value);
            showValidationError('phone', validation.message, validation.isValid);
        });
    }
    
    // Валидация для email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const validation = validateEmail(this.value);
            showValidationError('email', validation.message, validation.isValid);
        });
        
        // При потери фокуса убираем пробелы
        emailInput.addEventListener('blur', function() {
            this.value = this.value.trim().toLowerCase();
            const validation = validateEmail(this.value);
            showValidationError('email', validation.message, validation.isValid);
        });
    }
}

function initializeOrderPage() {
    console.log('Инициализация страницы оформления заказа...');
    
    // Инициализируем страницу заказа
    updateOrderPage();
    
    // Настраиваем обработчики валидации
    setupValidationListeners();
    
    // Обработчик изменения способа доставки
    document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
        radio.addEventListener('change', updateOrderPage);
    });
    
    // Обработчик отправки формы
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация всех полей
            if (!validateOrderForm()) {
                showNotification('Исправьте ошибки в форме', 'error');
                return;
            }
            
            // Получаем данные формы
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            
            // В реальном приложении здесь будет отправка данных на сервер
            showNotification('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Создаем объект с данными заказа для сохранения
            const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
            const orderData = {
                fullName: fullName,
                phone: phone,
                email: email,
                deliveryMethod: deliveryMethod ? deliveryMethod.value : 'pickup',
                pharmacy: document.getElementById('pharmacy') ? document.getElementById('pharmacy').value : '',
                comment: document.getElementById('comment') ? document.getElementById('comment').value : '',
                cart: [...cart], // Копируем корзину
                total: getCartTotalPrice(),
                deliveryCost: document.getElementById('deliveryCost').textContent,
                orderDate: new Date().toISOString(),
                orderId: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
            };
            
            // Сохраняем заказ в localStorage для истории
            try {
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(orderData);
                localStorage.setItem('orders', JSON.stringify(orders));
                console.log('Заказ сохранен в историю:', orderData);
            } catch (error) {
                console.error('Ошибка сохранения заказа:', error);
            }
            
            // Очищаем корзину и перенаправляем на главную
            setTimeout(() => {
                clearCart();
                window.location.href = 'index.html';
            }, 2000);
        });
    }
}

// ==================== ГЛОБАЛЬНЫЙ ЭКСПОРТ ====================

window.cart = cart;
window.products = products;
window.loadCartFromStorage = loadCartFromStorage;
window.saveCartToStorage = saveCartToStorage;
window.getProductById = getProductById;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCart = clearCart;
window.getTotalItemsCount = getTotalItemsCount;
window.getCartTotalPrice = getCartTotalPrice;
window.updateCartUI = updateCartUI;
window.updateProductCatalog = updateProductCatalog;
window.filterProducts = filterProducts;
window.showNotification = showNotification;
window.showProductDetails = showProductDetails;
window.showPrescriptionInfo = showPrescriptionInfo;
window.loadPopularProducts = loadPopularProducts;
window.initializeOrderPage = initializeOrderPage;
window.updateOrderPage = updateOrderPage;
window.validateFullName = validateFullName;
window.validatePhone = validatePhone;
window.validateEmail = validateEmail;
window.validateOrderForm = validateOrderForm;

// ==================== ЗАГРУЗКА СТРАНИЦЫ ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, текущая страница:', window.location.pathname);
    
    // Всегда загружаем корзину
    loadCartFromStorage();
    updateCartUI();
    
    // Для главной страницы - показываем популярные товары
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname.endsWith('/') ||
        window.location.href.includes('index.html')) {
        console.log('Инициализация главной страницы...');
        loadPopularProducts();
    }
    
    // Для страниц с каталогом
    if (document.getElementById('products-grid')) {
        console.log('Инициализация каталога...');
        updateProductCatalog();
        
        // Устанавливаем активную кнопку "Все"
        const allBtn = document.querySelector('.filter-btn[onclick*="all"]');
        if (allBtn) allBtn.classList.add('active');
    }
    
    // Для страницы корзины
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        console.log('Инициализация страницы корзины...');
        
        // Настраиваем кнопки на странице корзины
        const clearBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCart);
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Корзина пуста!', 'error');
                    return;
                }
                window.location.href = 'order.html';
            });
        }
    }
    
    // Для страницы оформления заказа
    if (window.location.pathname.includes('order.html')) {
        console.log('Инициализация страницы оформления заказа...');
        initializeOrderPage();
    }

function fixAboutSectionForMobile() {
    // Проверяем, что мы на мобильном устройстве
    if (window.innerWidth <= 768) {
        console.log('Применяем фикс для секции "О нас" на мобильном устройстве');
        
        // Находим контейнер секции "О нас"
        const aboutSection = document.querySelector('#about .catalog-section');
        if (!aboutSection) {
            console.log('Секция "О нас" не найдена');
            return;
        }
        
        // Ищем div с grid-разметкой (встроенные стили)
        const gridContainer = aboutSection.querySelector('div[style*="grid"]');
        if (gridContainer) {
            console.log('Найден grid-контейнер, исправляем...');
            
            // Полностью переопределяем стили
            gridContainer.style.cssText = `
                display: flex !important;
                flex-direction: column !important;
                gap: 25px !important;
                width: 100% !important;
            `;
            
            // Находим дочерние блоки
            const children = gridContainer.querySelectorAll('div');
            children.forEach((child, index) => {
                child.style.cssText = `
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0 !important;
                `;
                
                // Первый блок (текст) - order: 1
                // Второй блок (плашка) - order: 2
                child.style.order = (index + 1).toString();
            });
            
            // Находим фиолетовую плашку и даем ей дополнительные отступы
            const purpleBox = gridContainer.querySelector('div[style*="background: linear-gradient"]');
            if (purpleBox) {
                purpleBox.style.marginTop = '20px !important';
                purpleBox.style.padding = '25px 20px !important';
                purpleBox.style.boxSizing = 'border-box !important';
            }
            
            console.log('Фикс применен успешно');
        } else {
            console.log('Grid-контейнер не найден, ищем по другому...');
            
            // Альтернативный поиск - все div внутри секции
            const allDivs = aboutSection.querySelectorAll('div');
            let foundGrid = false;
            
            allDivs.forEach(div => {
                const style = div.getAttribute('style') || '';
                if (style.includes('grid') || style.includes('display:') || 
                    (div.children.length >= 2 && div.offsetWidth > 300)) {
                    
                    console.log('Найден возможный контейнер:', div);
                    div.style.cssText = `
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 25px !important;
                        width: 100% !important;
                    `;
                    foundGrid = true;
                }
            });
            
            if (!foundGrid) {
                console.log('Не удалось найти контейнер, применяем глобальный фикс');
                // Применяем фикс ко всей секции
                aboutSection.style.cssText = `
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 25px !important;
                    width: 100% !important;
                `;
                
                // Делаем все прямые div-дети на всю ширину
                const directDivs = aboutSection.querySelectorAll('div');
                directDivs.forEach(div => {
                    if (div.parentElement === aboutSection || 
                        div.parentElement.parentElement === aboutSection) {
                        div.style.cssText = `
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        `;
                    }
                });
            }
        }
    }
}

// Запускаем фикс при загрузке и при изменении размера
document.addEventListener('DOMContentLoaded', function() {
    fixAboutSectionForMobile();
    
    // Также запускаем с небольшой задержкой на случай динамической загрузки
    setTimeout(fixAboutSectionForMobile, 500);
});

window.addEventListener('resize', fixAboutSectionForMobile);