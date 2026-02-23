// Консоль для отладки
const Console = {
    element: document.getElementById("Console"),
    
    init() {
        if (!this.element) {
            console.warn('Элемент #Console не найден');
            return;
        }
        
        // Очищаем элемент
        this.element.innerHTML = '';
        
        // Добавляем заголовок
        const header = document.createElement('div');
        header.className = 'console-header';
        header.innerHTML = `
            <span>Консоль отладки</span>
            <span class="console-close" onclick="Console.toggle()">✕</span>
        `;
        this.element.appendChild(header);
        
        // Добавляем контейнер для логов
        this.logContainer = document.createElement('div');
        this.logContainer.className = 'console-logs';
        this.element.appendChild(this.logContainer);
        
        // Добавляем панель управления
        const controls = document.createElement('div');
        controls.className = 'console-controls';
        controls.innerHTML = `
            <button onclick="Console.clear()" title="Очистить">🗑️</button>
            <button onclick="Console.copyLogs()" title="Копировать">📋</button>
            <button onclick="Console.toggle()" title="Закрыть">✕</button>
        `;
        this.element.appendChild(controls);
        
        // Добавляем кнопку для показа/скрытия
        if (!document.getElementById('console-toggle-btn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'console-toggle-btn';
            toggleBtn.className = 'console-toggle-btn';
            toggleBtn.innerHTML = '📋';
            toggleBtn.onclick = () => this.toggle();
            document.body.appendChild(toggleBtn);
            this.toggleBtn = toggleBtn;
        }
        
        // Добавляем обработчик для перетаскивания
        this.makeDraggable();
    },
    
    makeDraggable() {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = this.element.querySelector('.console-header');
        
        header.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                this.element.style.top = (this.element.offsetTop - pos2) + 'px';
                this.element.style.left = (this.element.offsetLeft - pos1) + 'px';
            };
        };
    },
    
    log(type, ...args) {
        if (!this.logContainer) return;
        
        const timestamp = new Date().toLocaleTimeString('ru-RU', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });
        
        const message = args.map(arg => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
        
        const logEntry = document.createElement('div');
        logEntry.className = `console-entry console-${type}`;
        
        // Форматирование стектрейса для ошибок
        if (type === 'error' && args[0] instanceof Error) {
            logEntry.innerHTML = `
                <span class="console-time">[${timestamp}]</span>
                <span class="console-error-name">${args[0].name}:</span>
                <span class="console-error-message">${args[0].message}</span>
                <div class="console-stack">${args[0].stack || ''}</div>
            `;
        } else {
            logEntry.innerHTML = `<span class="console-time">[${timestamp}]</span> ${message}`;
        }
        
        this.logContainer.appendChild(logEntry);
        this.element.scrollTop = this.element.scrollHeight;
        
        // Ограничиваем количество логов
        while (this.logContainer.children.length > 200) {
            this.logContainer.removeChild(this.logContainer.firstChild);
        }
    },
    
    toggle() {
        if (this.element.style.display === 'none' || getComputedStyle(this.element).display === 'none') {
            this.element.style.display = 'flex';
            this.toggleBtn.style.display = 'none';
        } else {
            this.element.style.display = 'none';
            this.toggleBtn.style.display = 'flex';
        }
    },
    
    clear() {
        if (this.logContainer) {
            this.logContainer.innerHTML = '';
        }
    },
    
    copyLogs() {
        let logs = '';
        const entries = this.logContainer.children;
        for (let entry of entries) {
            logs += entry.textContent + '\n';
        }
        navigator.clipboard.writeText(logs).then(() => {
            this.log('info', 'Логи скопированы в буфер обмена');
        });
    }
};

// Перехватываем стандартные методы console
const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug
};

console.log = function(...args) {
    originalConsole.log.apply(console, args);
    Console.log('log', ...args);
};

console.info = function(...args) {
    originalConsole.info.apply(console, args);
    Console.log('info', ...args);
};

console.warn = function(...args) {
    originalConsole.warn.apply(console, args);
    Console.log('warn', ...args);
};

console.error = function(...args) {
    originalConsole.error.apply(console, args);
    Console.log('error', ...args);
};

console.debug = function(...args) {
    originalConsole.debug.apply(console, args);
    Console.log('debug', ...args);
};

console.clear = function() {
    originalConsole.clear.apply(console);
    Console.clear();
};

// Инициализируем консоль
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Console.init(), 100);
});

// Горячие клавиши (Ctrl+Shift+C)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        Console.toggle();
    }
});
