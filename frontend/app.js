const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    loadSpaces();
    loadBookings();
});

// Переключение вкладок
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.currentTarget.classList.add('active');

    if (tabName === 'bookings') loadBookings();
    if (tabName === 'admin') loadAdminSpaces();
}

async function loadSpaces(searchQuery = '') {
    try {
        let url = `${API_URL}/spaces`;
        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        const spaces = await response.json();
        
        const spacesGrid = document.getElementById('spaces-grid');
        const spaceSelect = document.getElementById('booking-space-select');
        
        spacesGrid.innerHTML = '';
        spaceSelect.innerHTML = '<option value="">Выберите пространство...</option>';

        if (spaces.length === 0) {
            spacesGrid.innerHTML = '<p>Ничего не найдено.</p>';
            return;
        }

        spaces.forEach(space => {
            // Рисуем карточку
            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `
                <div>
                    <strong>${space.name}</strong><br>
                    <small>${space.description}</small><br>
                    <span>Цена: <b>$${space.pricePerHour}/час</b> | Мест: ${space.capacity}</span>
                </div>
            `;
            spacesGrid.appendChild(div);

            // Добавляем в выпадающий список бронирования
            const option = document.createElement('option');
            option.value = space.id;
            option.textContent = `${space.name} ($${space.pricePerHour}/hr)`;
            spaceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка загрузки пространств:', error);
    }
}

// Обработчик ввода в поле поиска
let searchTimeout;
function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = document.getElementById('search-input').value;
        loadSpaces(query); // Передаем текст в функцию загрузки
    }, 300); // Задержка, чтобы не слать запросы на каждый символ мгновенно
}

// Загрузка бронирований
async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings`);
        const bookings = await response.json();
        
        const bookingsList = document.getElementById('bookings-list');
        bookingsList.innerHTML = '';

        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>Активных бронирований пока нет.</p>';
            return;
        }

        bookings.forEach(b => {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `
                <div>
                    <strong>Пользователь: ${b.userId}</strong><br>
                    <span>Пространство: ${b.space ? b.space.name : 'Удалено'}</span><br>
                    <small>С: ${new Date(b.startTime).toLocaleString()} по ${new Date(b.endTime).toLocaleString()}</small>
                </div>
                <button class="btn-danger" onclick="deleteBooking('${b.id}')">Отменить</button>
            `;
            bookingsList.appendChild(div);
        });
    } catch (error) {
        console.error('Ошибка загрузки броней:', error);
    }
}

// Управление пространствами (Админка)
async function loadAdminSpaces() {
    try {
        const response = await fetch(`${API_URL}/spaces`);
        const spaces = await response.json();
        
        const adminList = document.getElementById('admin-spaces-list');
        adminList.innerHTML = '';

        if (spaces.length === 0) {
            adminList.innerHTML = '<p>Список пуст.</p>';
            return;
        }

        spaces.forEach(space => {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `
                <div>
                    <strong>${space.name}</strong> ($${space.pricePerHour}/hr)
                </div>
                <button class="btn-danger" onclick="deleteSpace('${space.id}')">Удалить</button>
            `;
            adminList.appendChild(div);
        });
    } catch (error) {
        console.error('Ошибка админ-панели:', error);
    }
}

// Создание пространства
document.getElementById('space-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newSpace = {
        name: document.getElementById('space-name').value,
        description: document.getElementById('space-description').value,
        pricePerHour: parseFloat(document.getElementById('space-price').value),
        capacity: parseInt(document.getElementById('space-capacity').value),
    };

    const res = await fetch(`${API_URL}/spaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpace)
    });

    if (res.ok) {
        document.getElementById('space-form').reset();
        loadSpaces();
        loadAdminSpaces();
        alert('Пространство успешно добавлено!');
    }
});

// Создание брони
document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newBooking = {
        spaceId: document.getElementById('booking-space-select').value,
        userId: document.getElementById('booking-user').value,
        startTime: new Date(document.getElementById('booking-start').value).toISOString(),
        endTime: new Date(document.getElementById('booking-end').value).toISOString(),
    };

    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
    });

    if (res.ok) {
        document.getElementById('booking-form').reset();
        alert('Успешно забронировано!');
        loadBookings();
    }
});

// Удаление пространства
async function deleteSpace(id) {
    if (!confirm('Точно удалить это пространство?')) return;
    await fetch(`${API_URL}/spaces/${id}`, { method: 'DELETE' });
    loadSpaces();
    loadAdminSpaces();
}

// Удаление брони
async function deleteBooking(id) {
    if (!confirm('Отменить это бронирование?')) return;
    await fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
}