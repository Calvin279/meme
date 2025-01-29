class UserTimeTracker {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.initializeEventListeners();
        this.renderTable();
    }

    initializeEventListeners() {
        document.getElementById('addUser').addEventListener('click', () => this.addUser());
        document.getElementById('searchInput').addEventListener('input', () => this.filterUsers());
        document.getElementById('discordLink').addEventListener('click', () => this.linkToDiscord());
    }

    addUser() {
        const usernameEl = document.getElementById('username');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        const username = usernameEl.value.trim();
        const hours = parseInt(hoursEl.value) || 0;
        const minutes = parseInt(minutesEl.value) || 0;
        const seconds = parseInt(secondsEl.value) || 0;

        if (!username) {
            alert('Por favor, ingrese un nombre de usuario');
            return;
        }

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const formattedTime = this.formatTime(hours, minutes, seconds);

        const newUser = {
            id: Date.now(),
            username,
            totalSeconds,
            formattedTime
        };

        this.users.push(newUser);
        this.saveUsers();
        this.renderTable();

        // Limpiar inputs
        usernameEl.value = '';
        hoursEl.value = '';
        minutesEl.value = '';
        secondsEl.value = '';
    }

    formatTime(hours, minutes, seconds) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    renderTable() {
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        // Encontrar el usuario con más tiempo
        const maxTimeUser = this.users.reduce((max, user) => 
            (max ? (user.totalSeconds > max.totalSeconds ? user : max) : user), null);

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username} ${maxTimeUser && maxTimeUser.id === user.id ? '⭐' : ''}</td>
                <td>${user.formattedTime}</td>
                <td>${this.checkUserCompletion(user) ? '✔️' : '❌'}</td>
                <td>
                    <button onclick="app.deleteUser(${user.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        this.saveUsers();
    }

    checkUserCompletion(user) {
        // Define aquí tu lógica de cumplimiento. Por ejemplo:
        return user.totalSeconds >= 3600; // Cumple si tiene más de una hora
    }

    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id);
        this.saveUsers();
        this.renderTable();
    }

    filterUsers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredUsers = this.users.filter(user => 
            user.username.toLowerCase().includes(searchTerm)
        );

        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        const maxTimeUser = filteredUsers.reduce((max, user) => 
            (max ? (user.totalSeconds > max.totalSeconds ? user : max) : user), null);

        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username} ${maxTimeUser && maxTimeUser.id === user.id ? '⭐' : ''}</td>
                <td>${user.formattedTime}</td>
                <td>${this.checkUserCompletion(user) ? '✔️' : '❌'}</td>
                <td>
                    <button onclick="app.deleteUser(${user.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    linkToDiscord() {
        // Placeholder for Discord linking functionality
        alert('Funcionalidad de vinculación con Discord próximamente');
    }
}

// Crear una instancia global para acceder desde HTML
window.app = new UserTimeTracker();