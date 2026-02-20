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

let lastTimeLast;
var TTS_LOADING = false;
var TTS_LOADED = false;

class VisualPanelClass {
    constructor() {
        console.log('Инициализация VisualPanelClass');
        setTimeout(this.StartPanelText, 500)
        this.Translate = document.getElementById("TranslateRusPanel")
        this.ReadRu = document.getElementById("ReadRusPanel")
        this.ReadEng = document.getElementById("ReadEngPanel")
        this.textPanelEN = document.getElementById("textPanelEN")
        this.textPanelRU = document.getElementById("textPanelRU")
        this.HideRusPanel = document.getElementById("HideRusPanel")
        this.HideEngPanel = document.getElementById("HideEngPanel")
        this.readYourself = document.getElementById("readYourself")

        this.ocenka_n = document.getElementById("ocenka_n")
        this.text_ru = document.getElementById("text_ru")
        this.text_en = document.getElementById("text_en")
        this.voiceRusSelect = document.getElementById("voiceRusSelect")
        this.voiceEngSelect = document.getElementById("voiceEngSelect")

        this.lang_0 = document.getElementById("lang_0")
        this.lang_1 = document.getElementById("lang_1")
        
        this.rateRusRange = document.getElementById("rateRusRange")
        this.rateRusOut = document.querySelector('output[for="rateRusOut"]')
        this.rateEngRange = document.getElementById("rateEngRange")
        this.rateEngOut = document.querySelector('output[for="rateEngOut"]')

        this.NumberLinesBookSlider = document.getElementById("file_nommax")
        this.NumberLinesBook0 = document.getElementById("file_nom0")
        this.NumberLinesBook = document.getElementById("file_nom1")
        this.PercenLinesBook = document.getElementById("readedPercent") 
        this.StatisticOutElement = document.getElementById("StatisticOut") 
        this.FirstLang = document.getElementById("FirstLang") 
        this.HeadNameOut = document.getElementById("HeadNameOut") 
        this.descriptionOut = document.getElementById("descriptionOut") 
        

        this.rateRusRange.addEventListener('change', this.updateOutputs);
        this.rateEngRange.addEventListener("change", this.updateOutputs)
        
        setTimeout(function() {
            this.voiceRusSelect.addEventListener("change", CookiesUp.updateVoice)
            this.voiceEngSelect.addEventListener("change", CookiesUp.updateVoice)
        }, 5000)
        
        this.NumberLinesBook0.addEventListener("change", function (event) {
            Book.num = Number(Panel.NumberLinesBook0.value)
            Panel.NumberLinesBook.value = Panel.NumberLinesBook0.value
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
            Panel.text_en.textContent = Book.book_mass_eng[Book.num]
            CookiesUp.setCookieMy(Book.name_file, Book.num)
            if(Book.num != 0)
               Panel.PercenLinesBook.value = (Book.num / Book.numMax * 100).toFixed(1) + "%";
            else
               Panel.PercenLinesBook.value = 0 
            numNext = Book.num + 1
        })

        this.HideRusPanel.addEventListener("change", function (event) {
            if (Panel.HideRusPanel.checked == true) { Panel.textPanelRU.style.display = 'none' }
            else if (Panel.HideRusPanel.checked == false) Panel.textPanelRU.style.display = ''
        })
        
        this.HideEngPanel.addEventListener("change", function (event) {
            if (Panel.HideEngPanel.checked == true) { Panel.textPanelEN.style.display = 'none' }
            else if (Panel.HideEngPanel.checked == false) Panel.textPanelEN.style.display = ''
        })

        document.addEventListener("keydown", this.KeyDown)

        this.lang_0.addEventListener("change", this.updatelang)
        this.lang_1.addEventListener("change", this.updatelang)

        this.Translate.addEventListener('change', function () {
            CookiesUp.setCookieMy("ChekTranslate", Panel.Translate.checked)
            if (Panel.Translate.checked == true) {
                if (Book.book_mass_eng[Book.num] == undefined || Book.book_mass_eng[Book.num].length == 0) {
                    Speeker.updateReadList();
                    TranslateBook.TranslateNum(Book.num);
                }
            }
        });
        
        // Добавляем обработчики ошибок для select элементов
        this.voiceRusSelect.addEventListener('error', () => {
            console.log('Ошибка загрузки голосов');
            setTimeout(() => Speeker.retryTTS(), 2000);
        });
        
        this.voiceEngSelect.addEventListener('error', () => {
            console.log('Ошибка загрузки голосов');
            setTimeout(() => Speeker.retryTTS(), 2000);
        });
    }

    updatelang() { 
        TranslateBook.lang0 = Panel.lang_0.value; 
        TranslateBook.lang1 = Panel.lang_1.value; 
    }

    HideView(id) {
        if(document.getElementById(id).classList[1] == 'hide'){
            document.getElementById(id).classList.remove("hide")
            document.getElementById(id).classList.toggle("show")
        } else {
            document.getElementById(id).classList.remove("show")
            document.getElementById(id).classList.toggle("hide")
        }
    }

    Back() {
        console.log('Переход на предыдущую страницу');
        Book.num = Book.num - 1
        text_ru.textContent = Book.book_mass_rus[Book.num]
        Panel.NumberLinesBook.value = Book.num
        if(Book.num != 0)
            Panel.PercenLinesBook.value = (Book.num / Book.numMax * 100).toFixed(1) + "%";
        else
            Panel.PercenLinesBook.value = 0 
        if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { 
            Panel.text_en.textContent = Book.book_mass_eng[Book.num]; 
        } else { 
            Panel.text_en.textContent = '' 
        }
        numNext = Book.num + 1
        if(Book.num % 5 == 0) Statistic.keeptime(ISUPDATE)
    }
    
    Forward() {
        console.log('Переход на следующую страницу');
        Book.num = Book.num + 1
        Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
        Panel.NumberLinesBook.value = Book.num
        if(Book.num != 0)
            Panel.PercenLinesBook.value = (Book.num / Book.numMax * 100).toFixed(1) + "%";
        else
            Panel.PercenLinesBook.value = 0 
        if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { 
            Panel.text_en.textContent = Book.book_mass_eng[Book.num]; 
        } else { 
            Panel.text_en.textContent = '' 
        }
        numNext = Book.num + 1
        if(this.readYourself.checked == true) {
            Statistic.keeptime(isReadYourSelf);
            Book.ScanTransReadList();
        } else {
            if(Book.num % 5 == 0) Statistic.keeptime(ISUPDATE)
        }
        Speeker.updateReadList()
    }

    FirstVoiceRatePlus() {
        Panel.rateRusRange.value = Number(Panel.rateRusRange.value) + 0.1
        Panel.rateRusOut.value = Panel.rateRusRange.value;
        Panel.updateRateCookes();
    }

    FirstVoiceRateMinus() {
        Panel.rateRusRange.value = Number(Panel.rateRusRange.value) - 0.1
        Panel.rateRusOut.value = Panel.rateRusRange.value;
        Panel.updateRateCookes();
    }

    SecondVoiceRatePlus() {
        Panel.rateEngRange.value = Number(Panel.rateEngRange.value) + 0.1
        Panel.rateEngOut.value = Panel.rateEngRange.value;
        Panel.updateRate0Cookes();
    }

    SecondVoiceRateMinus() {
        Panel.rateEngRange.value = Number(Panel.rateEngRange.value) - 0.1
        Panel.rateEngOut.value = Panel.rateEngRange.value;
        Panel.updateRate0Cookes();
    }

    StartPanelText = function () {
        if (this.HideRusPanel.checked == true) { this.textPanelRU.style.display = 'none' }
        else if (this.HideRusPanel.checked == false) this.textPanelRU.style.display = ''
        if (this.HideEngPanel.checked == true) { this.textPanelEN.style.display = 'none' }
        else if (this.HideEngPanel.checked == false) this.textPanelEN.style.display = ''
    }

    updateRateCookes() { 
        CookiesUp.setCookieMy("rate", Panel.rateRusRange.value) 
    }

    updateRate0Cookes() { 
        CookiesUp.setCookieMy("rate0", Panel.rateEngRange.value) 
    }

    updateOutputs() {
        CookiesUp.setCookieMy("rate", Panel.rateRusRange.value)
        Panel.rateRusOut.textContent = Panel.rateRusRange.value
        CookiesUp.setCookieMy("rate0", Panel.rateEngRange.value)
        Panel.rateEngOut.textContent = Panel.rateEngRange.value
    }



}

class CookiesClass {
    constructor() {
        console.log('Инициализация CookiesClass');
        this.updateCookieState()
        this.checkboxes = ['TranslateRusPanel', 'ReadRusPanel', 'ReadEngPanel', 'HideEngPanel', 'HideRusPanel','FirstLang','readYourself'];
        this.restoreCheckboxState()
    }
    
    updateCookieState() {
        document.getElementById('TranslateRusPanel').onchange = function () { 
            CookiesUp.setCookieMy('TranslateRusPanel', document.getElementById('TranslateRusPanel').checked.toString()); 
        }
        document.getElementById('ReadRusPanel').onchange = function () { 
            CookiesUp.setCookieMy('ReadRusPanel', document.getElementById('ReadRusPanel').checked.toString()); 
        }
        document.getElementById('ReadEngPanel').onchange = function () { 
            CookiesUp.setCookieMy('ReadEngPanel', document.getElementById('ReadEngPanel').checked.toString()); 
        }
        document.getElementById('HideEngPanel').onchange = function () { 
            CookiesUp.setCookieMy('HideEngPanel', document.getElementById('HideEngPanel').checked.toString()); 
        }
        document.getElementById('HideRusPanel').onchange = function () { 
            CookiesUp.setCookieMy('HideRusPanel', document.getElementById('HideRusPanel').checked.toString()); 
        }
        document.getElementById('FirstLang').onchange = function () { 
            CookiesUp.setCookieMy('FirstLang', document.getElementById('FirstLang').checked.toString()); 
        }
        document.getElementById('readYourself').onchange = function () { 
            CookiesUp.setCookieMy('readYourself', document.getElementById('readYourself').checked.toString()); 
        }
    }

    restoreCheckboxState() {
        this.checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            const checkedValue = getCookie(id) === 'true';
            if (checkbox && typeof checkedValue !== 'undefined') { 
                checkbox.checked = checkedValue; 
            }
        });
    }
    
    start_cookie() {
        console.log('Загрузка cookie настроек');
        Panel.voiceEngSelect.selectedIndex = getCookie('voice0_num');
        Panel.rateEngRange.value = getCookie("rate0")
        Panel.rateEngOut.textContent = Panel.rateEngRange.value
        Panel.voiceRusSelect.selectedIndex = getCookie('voice_num');
        Panel.rateRusRange.value = getCookie("rate")
        Panel.rateRusOut.textContent = Panel.rateRusRange.value
    }

    updateVoice() {
        CookiesUp.setCookieMy("voice0_num", Panel.voiceEngSelect.value)
        CookiesUp.setCookieMy("voice_num", Panel.voiceRusSelect.value)
    }

    setCookieMy(name, data) {
        setCookie(name, data, {
            expires: new Date(Date.now() + 86400 * 1000 * 30 * 12),
            path: '/'
        })
    }
}

class MainBookClass {
    constructor() {
        console.log('Инициализация MainBookClass');
        this.book_id = getCookie("book_id")
        this.book_mass_rus = []
        this.book_mass_eng = []
        this.num
        this.numMax
        this.name_file
        this.images=[]
        this.bookhead = {}
        this.platform = (window.cordova && window.cordova.platformId) 
        ? window.cordova.platformId 
        : 'browser';
        this.map = { 
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
            'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 
            'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B', 
            'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 
            'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 
            'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 
            'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '', 
            'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', '[': '_', ']': '_', '-': '_', '.': '_', 
            ' ': '_', '	': '_' 
        };
    }

    changeBook(id){
        console.log('Смена книги на ID:', id);
        CookiesUp.setCookieMy('book_id', id); 
        location.reload();
    }

    get_book() {
        if (this.book_id == 0) return;
        $.ajaxSetup({ timeout: 120000})
        $("#PleaseWait").show()
        console.log('Загрузка книги ID:', this.book_id);
        readTextFromFile(this.book_id + '.fb2').then(result => {
            if (result.text.length < 100) throw new Error('Полученный файл слишком мал для книги.');
            Book.mass_to_text(result.text)  
            if (this.book_mass_rus.length < 100) throw new Error('Книга слишком мала < 100 строк.');
            Panel.NumberLinesBookSlider.value = this.book_mass_rus.length
            Book.numMax = this.book_mass_rus.length
            this.name_file = this.book_id
            Book.num = parseInt(getCookie(Book.name_file)) || 0
            Panel.NumberLinesBook.value = this.num
            if(Book.num != 0)
               Panel.PercenLinesBook.value = (Book.num / Book.numMax * 100).toFixed(1) + "%";
            else
               Panel.PercenLinesBook.value = 0
            Panel.text_ru.textContent = this.book_mass_rus[this.num]
            numNext = this.num + 1
            Speeker.updateReadList()
            $("#PleaseWait").hide()
            console.log('Книга успешно загружена, строк:', this.book_mass_rus.length);
        })
        .catch(error => {
            console.error('Ошибка загрузки книги из файла:', error);
            this.loadFromNetwork();
        });

        CookiesUp.setCookieMy('book_id', Book.book_id)
    }

    loadFromNetwork(){
        const self = this;
        console.log('Загрузка книги из сети');
        $.get("https://api.allfilmbook.ru/book/file/", {
            id: this.book_id,
            unzip: 1,
            type: 'fb2'
        }).success(function (data) {
            Book.name_file = Book.book_id
            if (data.error) {
                console.error('Ошибка API:', data.error, data.message);
                alert(data.error + ': ' + data.message);
                $("#PleaseWait").hide()
                const shouldRetry = confirm("Загрузить повторно?");
                if (shouldRetry) {
                    $("#PleaseWait").show();
                    self.loadFromNetwork();
                } else {
                    $("#PleaseWait").hide();
                }
                return;
            }
            WriteBook(Book.book_id, data);
            Book.mass_to_text(data)
            Panel.NumberLinesBookSlider.value = Book.book_mass_rus.length
            Book.numMax = Book.book_mass_rus.length
            Book.num = parseInt(getCookie(Book.name_file)) || 0
            Panel.NumberLinesBook.value = Book.num
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
            if(Book.num != 0)
                Panel.PercenLinesBook.value = (Book.num / Book.numMax * 100).toFixed(1) + "%";
            else
                Panel.PercenLinesBook.value = 0
            numNext = Book.num + 1
            $("#PleaseWait").hide()
            Speeker.updateReadList();
            console.log('Книга успешно загружена из сети');
        }).catch(error => {
            console.error('Ошибка сетевой загрузки:', error);
            const shouldRetry = confirm("Ошибка загрузки. Загрузить повторно?");
            if (shouldRetry) {
                $("#PleaseWait").show();
                self.loadFromNetwork();
            } else {
                $("#PleaseWait").hide();
            }
        });
    }

    openFile() {
        let input = event.target
        let val = ""
        this.name_file = event.target.files[0].name
        console.log('Открытие локального файла:', this.name_file);
        for (var i = 0; i < this.name_file.length; i++)
            if (this.map[this.name_file[i]])
                val += this.map[this.name_file[i]]
            else
                val += this.name_file[i]
        this.name_file = val

        var reader = new FileReader()
        reader.onload = function () {
            var json = reader.result
            this.mass_to_text(json)
            Panel.NumberLinesBookSlider.value = this.book_mass_rus.length
            Book.numMax = this.book_mass_rus.length
            if (Number(getCookie(this.name_file)) > 0) {
                this.num = Number(getCookie(this.name_file))
                Panel.NumberLinesBookSlider.value = this.num
                Panel.NumberLinesBook.value = this.num
                Panel.text_ru.textContent = this.book_mass_rus[this.num]
                if (typeof Panel.text_ru.innerText !== this.book_mass_rus[this.num]) {
                    Panel.text_ru.innerText = this.book_mass_rus[this.num]
                } else {
                    Panel.text_ru.textContent = this.book_mass_rus[this.num]
                }
            } else {
                this.num = 0
                Panel.NumberLinesBookSlider.value = this.num
                Panel.NumberLinesBook.value = this.num
                Panel.text_ru.textContent = this.book_mass_rus[this.num]
            }
        }
        reader.readAsText(input.files[0])
        numNext = this.num + 1
        start_cookie();
    }

    ScanTransReadList() {
        var i = 0;
        Speeker.ReadList.forEach((data) => {
            if (data.statusEng == 0 && Book.book_mass_eng.length == 0) {
                TranslateBook.TranslateNum(data.id);
                return 0;
            }
        });
    }

    mass_to_text(json) {
        const bodyStart = json.indexOf("<body>");
        const bodyEnd = json.indexOf("</body>");
        
        if (bodyStart === -1 || bodyEnd === -1 || bodyEnd <= bodyStart) {
            console.error('Не найден тег body в FB2 файле');
            $("#PleaseWait").hide();
            return;
        }
        
        const fullBody = json.substring(bodyStart, bodyEnd + 7);
        let cleanText = fullBody.replace(/<[^>]*>?/gm, '');
        cleanText = cleanText.replace(/['"]+/g, ' ');
        
        const lines = cleanText.split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        this.bookhead.book = this.splitArray(lines);
        
        try {
            const xmlData = parseXml(json);
            this.extractMetadata(xmlData);
        } catch (error) {
            console.warn("Ошибка при парсинге метаданных FB2:", error);
        }
        
        this.book_mass_rus = this.bookhead.book.filter(Boolean);
        this.putDescription();
    }
    
    extractMetadata(xmlData) {
        try {
            const fictionBook = xmlData.FictionBook;
            this.bookhead.title = this.getSafeText(fictionBook, 
                ['description', 'title-info', 'book-title']);
            this.extractAuthors(fictionBook);
            this.extractCover(fictionBook);
            this.extractAdditionalInfo(fictionBook);
        } catch (error) {
            console.warn("Ошибка извлечения метаданных:", error);
        }
    }
    
    extractAuthors(fictionBook) {
        try {
            const titleInfo = fictionBook?.description?.['title-info'];
            if (!titleInfo?.author) return;
            
            const author = titleInfo.author;
            this.bookhead.description = this.bookhead.description || {};
            this.bookhead.description.author = author;
        } catch (error) {
            console.warn("Ошибка извлечения авторов:", error);
        }
    }
    
    extractCover(fictionBook) {
        let img
        try {
            if (fictionBook.binary) {
                img = fictionBook.binary;
                        if (fictionBook.binary) {
                            let imageData = [];
                            
                            if (Array.isArray(img)) {
                                img.forEach(pic => {
                                    if (pic && pic['content-type'] && pic['#text']) {
                                        let imgObj = {
                                            contentType: pic['content-type'],
                                            data: pic['#text'],
                                            html: '<img src="data:' + pic['content-type'] + ';base64,' + 
                                                pic['#text'] + '" class="imgDescription" />'
                                        };
                                        imageData.push(imgObj);
                                    }
                                });
                            } else if (img['content-type'] && img['#text']) {
                                let imgObj = {
                                    contentType: img['content-type'],
                                    data: img['#text'],
                                    html: '<img src="data:' + img['content-type'] + 
                                        ';base64,' + img['#text'] + 
                                        '" class="imgDescription" />'
                                };
                                imageData.push(imgObj);
                            }
                            
                            // Добавляем изображения в объект книги
                            if (!this.images) {
                                this.images = [];
                            }
                            this.images = this.images.concat(imageData);

                        }
            }
        } catch (error) {
            console.warn("Ошибка извлечения обложки:", error);
        }
    }
    
    extractAdditionalInfo(fictionBook) {
        try {
            const titleInfo = fictionBook?.description?.['title-info'];
            if (!titleInfo) return;
            
            this.bookhead.description = {
                ...this.bookhead.description,
                sequence: titleInfo.sequence,
                genre: titleInfo.genre,
                annotation: titleInfo.annotation,
                date: titleInfo.date,
                lang: titleInfo.lang
            };
        } catch (error) {
            console.warn("Ошибка извлечения доп. информации:", error);
        }
    }
    
    getSafeText(obj, pathArray) {
        return pathArray.reduce((current, key) => 
            current && current[key] ? current[key] : null, obj
        )?.['#text'] || null;
    }
    
    splitArray(bookArray) {
        const MAX_LENGTH = 150;
        const MIN_LENGTH = 50;
        const result = [];
        
        for (const text of bookArray) {
            if (!text || text.trim() === '') continue;
            
            if (text.length > MAX_LENGTH) {
                const sentences = text.split(/(?<=[.!?])\s+/);
                result.push(...sentences.filter(s => s && s.trim() !== ''));
            } else {
                result.push(text);
            }
        }
        
        const finalResult = [];
        let buffer = '';
        
        for (const sentence of result) {
            if (!sentence || sentence.trim() === '') continue;
            
            const trimmedSentence = sentence.trim();
            
            if (buffer === '') {
                buffer = trimmedSentence;
            } else if (buffer.length + trimmedSentence.length + 1 <= MAX_LENGTH) {
                buffer += ' ' + trimmedSentence;
            } else {
                finalResult.push(buffer);
                buffer = trimmedSentence;
            }
            
            if (buffer.length >= MIN_LENGTH && buffer.length <= MAX_LENGTH) {
                finalResult.push(buffer);
                buffer = '';
            }
        }
        
        if (buffer) {
            if (buffer.length < MIN_LENGTH && finalResult.length > 0) {
                const lastIndex = finalResult.length - 1;
                if (finalResult[lastIndex].length + buffer.length + 1 <= MAX_LENGTH) {
                    finalResult[lastIndex] += ' ' + buffer;
                } else {
                    finalResult.push(buffer);
                }
            } else {
                finalResult.push(buffer);
            }
        }
        
        return finalResult;
    }

    putDescription() { 
        if (typeof this.bookhead == "undefined") return 0;
        
        var descriptionOut = document.getElementById("descriptionOut")
        var tmp = '';
        
        if (this.bookhead['title']) {
              Panel.HeadNameOut.innerText=this.bookhead['title'] 
        }
        // Загружаем в слайдер изображения
          const slider = new ImageSlider('imageOut', this.images);
        
        try {
            if (this.bookhead['description'] && this.bookhead['description']['author']) {
                const author = this.bookhead['description']['author'];
                if (Array.isArray(author)) {
                    tmp += 'Авторы: <br>';
                    author.forEach((text) => {
                        if (text) {
                            tmp += (text['first-name'] ? text['first-name']['#text'] + ' ' : '');
                            tmp += (text['middle-name'] ? text['middle-name']['#text'] + ' ' : '');
                            tmp += (text['last-name'] ? text['last-name']['#text'] + ' ' : '');
                            tmp += '<br>';
                        }
                    });
                } else if (author) {
                    tmp += 'Автор: ';
                    tmp += (author['first-name'] ? author['first-name']['#text'] + ' ' : '');
                    tmp += (author['middle-name'] ? author['middle-name']['#text'] + ' ' : '');
                    tmp += (author['last-name'] ? author['last-name']['#text'] + ' ' : '');
                    tmp += '<br>';
                }
            }
        } catch (error) {
            console.log("Ошибка загрузки авторов:", error);
        }
        
        try {
            if (this.bookhead['description'] && 
                this.bookhead['description']['sequence'] && 
                this.bookhead['description']['sequence']['name']) {
                tmp += 'Серия: ' + this.bookhead['description']['sequence']['name'];
                if (this.bookhead['description']['sequence']['number']) {
                    tmp += ", №" + this.bookhead['description']['sequence']['number'];
                }
                tmp += '<br>';
            }
        } catch (error) {
            console.log("Ошибка загрузки серии:", error);
        }
        
        try {
            if (this.bookhead['description'] && this.bookhead['description']['genre']) {
                tmp += '<hr>Жанр: ';
                const genre = this.bookhead['description']['genre'];
                if (Array.isArray(genre)) {
                    genre.forEach((text) => {
                        if (text && text['#text']) {
                            tmp += text['#text'] + ' ';
                        }
                    });
                } else if (genre && genre['#text']) {
                    tmp += genre['#text'] + ' ';
                }
                tmp += '<br>';
            }
        } catch (error) {
            console.log("Ошибка загрузки жанров:", error);
        }
        
        try {
            if (this.bookhead['description'] && this.bookhead['description']['annotation']) {
                tmp += '<hr>Аннотация: <br>';
                const annotation = this.bookhead['description']['annotation'];
                
                if (annotation['p']) {
                    if (Array.isArray(annotation['p'])) {
                        annotation['p'].forEach((text) => {
                            if (text && text['#text']) {
                                tmp += text['#text'] + ' <br>';
                            }
                        });
                    } else if (annotation['p']['#text']) {
                        tmp += annotation['p']['#text'] + ' <br>';
                    }
                }
            }
        } catch (error) {
            console.log("Ошибка загрузки аннотации:", error);
        }
        
        try {
            if (this.bookhead['description'] && 
                this.bookhead['description']['date'] && 
                this.bookhead['description']['date']['value']) {
                tmp += '<hr>Дата создания: ' + 
                       this.bookhead['description']['date']['value'] + '<br>';
            }
        } catch (error) {
            console.log("Ошибка загрузки даты:", error);
        }
        
        try {
            if (this.bookhead['description'] && this.bookhead['description']['lang']) {
                tmp += 'Язык: ' + this.bookhead.description['lang']['#text'] + '<br>';
            }
        } catch (error) {}
        
        if (tmp === '<h2></h2>') {
            tmp = '<p>Информация о книге недоступна</p>';
        } else if (tmp === '') {
            tmp = '<p>Описание книги не загружено</p>';
        }
        
        descriptionOut.innerHTML = tmp;
    }
    
    buffer_add() {
        cordova.plugins.clipboard.paste(function (text) {
            this.book_mass_rus = [];
            this.mass_to_text(text)
            Panel.NumberLinesBookSlider.value = this.book_mass_rus.length
            Book.numMax = this.book_mass_rus.length
            this.book_id = 0
            this.num = 0
            Panel.NumberLinesBookSlider.value = this.num
            Panel.NumberLinesthis.value = this.num
            Panel.text_ru.textContent = this.book_mass_rus[this.num]
            numNext = this.num + 1
        })
    }
}

class TranslateBookClass {
    constructor() {
        console.log('Инициализация TranslateBookClass');
        this.lang0 = "ru"
        this.lang1 = "en"
    }
    
    TranslateNum(num0) {
        if(Book.book_mass_eng[num0] == undefined) {

            console.log('Запрос перевода для строки:', num0);
            Speeker.ReadList.find(element => element.id === num0).statusEng = 1; 
            $.get("https://api.allfilmbook.ru/translate/", {
                from: this.lang0,
                to: this.lang1,
                text: TrimText(Book.book_mass_rus[num0]),
            }).success(function(data) {
                var json = JSON.parse(data);
                Book.book_mass_eng[num0] = json.response;
                Speeker.ReadList.find(element => element.id == num0).textEng = json.response; 
                Speeker.ReadList.find(element => element.id == num0).statusEng = 3; 
                if(num0 == Book.num) Panel.text_en.textContent = json.response;
                console.log('Перевод получен для строки:', num0);
            }).error(function(xhr, textStatus, errorThrown) {
                console.error('Ошибка перевода для строки', num0, ':', textStatus);
                Speeker.ReadList.find(element => element.id === num0).statusEng = 0; 
            })

        }
    }
}

class SpeakClass {
    constructor() {
        console.log('Инициализация SpeakClass');
        this.book_id
        this.ReadList = new Array();
        this.ReadListCout = 10;
        this.ruVoiceFirst = 0;
        this.enVoiceFirst = 1;
        this.langFirstRead = this.ruVoiceFirst;
        this.ttsRetryCount = 0;
        this.maxTtsRetries = 5;
        // Новые свойства для мониторинга
        this.ttsActive = false;
        this.ttsLastActivity = Date.now();
        this.ttsMonitorInterval = null;
        this.ttsCurrentPromise = null;
        this.ttsTimeoutId = null;
        this.isScreenOff = false;
        this.keepAliveTimer = null;
        this.ttsWatchdogTimer = null;

        setTimeout(() => this.ttsList(), 3000);
        this.startTTSMonitor();
        //Имитатор синтеза речи.
        this.speakQueue = [];
        this.isProcessing = false;
    }

    updateReadList() {
    i = 0;
    Speeker.ReadList = [];
    
        while (i < Speeker.ReadListCout) {
            var tmp;
            var tmp1 = 0;
            if (Book.book_mass_eng[Book.num + i] == undefined) {
                tmp = '';
            } else {
                tmp = Book.book_mass_eng[Book.num + i];
                tmp1 = 3;
            }
            Speeker.ReadList.push({ 
                id: Book.num + i, 
                text: TrimText(Book.book_mass_rus[Book.num + i]), 
                textEng: tmp, 
                status: 0, 
                statusEng: tmp1 
            });
            i++;
        }
    }



    // Новый метод: запуск мониторинга TTS
    startTTSMonitor() {
        if (this.ttsMonitorInterval) {
            clearInterval(this.ttsMonitorInterval);
        }
        
        this.ttsMonitorInterval = setInterval(() => {
            this.checkTTSStatus();
        }, 15000); // Проверка каждые 15 секунд
    }

    // Новый метод: проверка статуса TTS
    checkTTSStatus() {
        const timeSinceLastActivity = Date.now() - this.ttsLastActivity;
        
        // Если TTS должен работать, но нет активности более 60 секунд
        if (this.ttsActive && timeSinceLastActivity > 60000) {
            console.warn('TTS не отвечает, перезапуск...');
            this.restartTTS();
        }
    }

    // Новый метод: обновление времени активности
    updateTTSTimestamp() {
        this.ttsActive=true;
        this.ttsLastActivity = Date.now();
    }

    // Новый метод: перезапуск TTS
    restartTTS() {
        console.log('Перезапуск TTS...');
        this.ttsActive = false;
        TTS.stop();
    }

    Speak = function() {
        const STATUS = {
            NOT_READY: 0,           // Не использовалось / не готово
            READY_FROM_TRANSLATE: 3,   // Отправлено на перевод
            COMPLETED: 10               // Выполнено
        };
        
        let not_speek=false
        
        let processedCount = 0;
            const translateEnabled = Panel.Translate.checked;
            const readRuEnabled = Panel.ReadRu.checked;
            const readEngEnabled = Panel.ReadEng.checked;
        if (Book.book_mass_rus[Book.num] != undefined) {
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
            Panel.text_en.textContent = Book.book_mass_eng[Book.num];
            for (const [index, data] of Speeker.ReadList.entries()) {
                // if(item.status == STATUS.COMPLETED) continue;
                if (processedCount > 2) break;

                const item = Speeker.ReadList[index];
                // Проверка на отправку в переводчик
                if (translateEnabled && item.statusEng === STATUS.NOT_READY) {
                    not_speek=true;
                    TranslateBook.TranslateNum(data.id);
                    processedCount++;
                    continue;
                }

                // Определяем режим чтения
                if (readRuEnabled && !readEngEnabled && !not_speek) {
                    // Только русский
                    if (item.status === STATUS.NOT_READY) {
                        item.status = STATUS.COMPLETED;
                        if (Book.platform === 'android') {
                            this.speakTextRu(item.id);
                        } else {
                            this.speakTextRuBrowser(item.id);
                        }
                        processedCount++;
                    } else {
                        processedCount++;
                    }
                } 
                else if (!readRuEnabled && readEngEnabled && !not_speek) {
                    // Только английский
                    if (item.statusEng === STATUS.READY_FROM_TRANSLATE) {
                        item.statusEng = STATUS.COMPLETED;
                        this.speakTextEn(item.id);
                        processedCount++;
                    } else {
                        not_speek=true;
                        processedCount++;
                    }
                } 
                else if (readRuEnabled && readEngEnabled) {
                    // Оба языка
                    if (item.status === STATUS.NOT_READY && item.statusEng === STATUS.READY_FROM_TRANSLATE && !not_speek) {
                        if (Panel.FirstLang.checked) {
                            this.speakTextRu(item.id);
                            this.speakTextEn(item.id);
                        } else {
                            this.speakTextEn(item.id);
                            this.speakTextRu(item.id);
                        }
                        item.statusEng = STATUS.COMPLETED;
                        item.status = STATUS.COMPLETED;
                        processedCount++;
                    } else {
                        processedCount++;
                    }
                }
            }
        }
        else {
            this.speak_pause()
        }


        
/*
        if (Book.book_mass_rus[Book.num] != undefined) {
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
            Panel.text_en.textContent = Book.book_mass_eng[Book.num];
            var out = 0;
            Speeker.ReadList.forEach((data, index) => {  
                if (out == 0) {
                    if(Panel.Translate.checked == true) { 
                        if(Speeker.ReadList[index].statusEng == 0){
                            TranslateBook.TranslateNum(data.id);
                        }
                    }
                    if(Panel.ReadRu.checked == true && Panel.ReadEng.checked == false){
                        if(Speeker.ReadList[index].status == 0) {
                            Speeker.ReadList[index].status = 10;
                            if(Book.platform=='android') 
                                this.speakTextRu(Speeker.ReadList[index].id);
                            else 
                                this.speakTextRuBrowser(Speeker.ReadList[index].id);
                        } else {
                            out = out + 1;
                        }
                    }
                    if(Panel.ReadRu.checked == false && Panel.ReadEng.checked == true){
                        if(Speeker.ReadList[index].statusEng == 3){
                            Speeker.ReadList[index].statusEng = 10;
                            this.speakTextEn(Speeker.ReadList[index].id)
                        } else {
                            out = out + 1;
                        }
                    }
                    if(Panel.ReadRu.checked == true && Panel.ReadEng.checked == true){
                        if(Speeker.ReadList[index].status == 0 && Speeker.ReadList[index].statusEng == 3) {
                            if(Panel.FirstLang.checked) {
                                this.speakTextRu(Speeker.ReadList[index].id);
                                this.speakTextEn(Speeker.ReadList[index].id);
                            } else {
                                this.speakTextEn(Speeker.ReadList[index].id);
                                this.speakTextRu(Speeker.ReadList[index].id);
                            }
                            Speeker.ReadList[index].statusEng = 10;
                            Speeker.ReadList[index].status = 10;
                        } else {
                            out = out + 1;
                        }
                    }
                }

            });
        }
        else {
            this.speak_pause()
        }
*/
        Statistic.keeptime(ISSTART);
        if (document.visibilityState === 'visible' && noSleep.enabled == false) { 
            try { noSleep.enable(); } catch (error) { } 
        }
        noSleepx = ISSTART
        CookiesUp.setCookieMy(Book.name_file, Book.num) 
        Panel.NumberLinesBook.value = Book.num
        if(Book.num != 0)
            Panel.PercenLinesBook.value = (Book.num / Book.numMax * 100).toFixed(1) + "%";
        else
            Panel.PercenLinesBook.value = 0
    }

    speakTextRu(index) {
        Speeker.ttsActive=true;
        console.log('Отправлено в синтезатор (русский):', Book.book_mass_rus[index]?.substring(0, 50) + '...');
        TTS.speak({
            text: TrimText(Book.book_mass_rus[index]),
            locale: Panel.voiceRusSelect[Panel.voiceRusSelect.selectedIndex].label,
            rate: Panel.rateRusRange.value,
            cancel: false
        }).then(function () {
            Speeker.executeAfterSpeakRU();
        }, function (reason) {
            Speeker.executeAfterSpeakError(reason)
        });
    }

    executeAfterSpeakRU() {
        Speeker.updateTTSTimestamp();
        if (Panel.ReadEng.checked == false) {
            Speeker.NextReadList();
        } else {
            Book.ScanTransReadList();
            if(!Panel.FirstLang.checked) Speeker.NextReadList();   
        }
    }
     executeAfterSpeakEn() {
            Speeker.updateTTSTimestamp()
            if (Panel.ReadRu.checked == true) Book.ScanTransReadList();
            if (Panel.FirstLang.checked) Speeker.NextReadList(); 
     }
    executeAfterSpeakError(reason){
                console.error('Ошибка синтеза речи :', reason);
                Speeker.ttsActive=false
                Speeker.retryTTS();
    }
    //Функция иметация чтения синтезатором речи
    speakTextRuBrowser(index) {
        this.ttsActive = true;
        const text = TrimText(Book.book_mass_rus[index]);
        const delaySeconds = text.length / 3;
        console.log(`[ОЧЕРЕДЬ] Добавление в очередь: ${text.length} символов, пауза ${delaySeconds}с`);
        
        // Добавляем задачу в очередь
        this.speakQueue.push({
            delaySeconds: delaySeconds,
            callback: () => {
                console.log('[ТЕСТ] Имитация завершения чтения');
                this.executeAfterSpeakRU();
            }
        });
        
        this.processQueue();
        console.log(`[ОЧЕРЕДЬ] Текущая длина очереди: ${this.speakQueue.length}, обрабатывается: ${this.isProcessing}`);
    }

        // Функция обработки очереди
    processQueue() {
        if (this.isProcessing || this.speakQueue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        const nextTask = this.speakQueue.shift(); // Берем первый элемент из очереди
        
        console.log(`[ОЧЕРЕДЬ] Запуск задачи. Осталось в очереди: ${this.speakQueue.length}`);
        
        // Выполняем задачу
        setTimeout(() => {
            console.log('[ОЧЕРЕДЬ] Завершение задачи');
            nextTask.callback();
            
            this.isProcessing = false;
            // Запускаем следующую задачу в очереди
            this.processQueue();
        }, nextTask.delaySeconds * 1000);
    }

    speakTextEn(index) {
        Speeker.ttsActive=true;
        console.log('Озвучивание (английский):', Book.book_mass_eng[index]?.substring(0, 50) + '...');
        TTS.speak({
            text: TrimText(Book.book_mass_eng[index]),
            locale: Panel.voiceEngSelect[Panel.voiceEngSelect.selectedIndex].label,
            rate: Panel.rateEngRange.value,
            cancel: false
        }).then(function () {
            executeAfterSpeakEn(); 
        }, function (reason) {
            executeAfterSpeakError(reason)
        });
    }


    NextReadList(){
        Book.num++;
        Speeker.ReadList = Speeker.ReadList.slice(1);
        var tmp = Speeker.ReadList.slice(-1)[0].id + 1
        let text = Book.book_mass_rus[tmp];
        Speeker.ReadList.push({ id: tmp,text: text, status: 0, statusEng: 0 });
        Speeker.Speak()
    }
    
    speak_pause() {
        console.log('Пауза озвучивания');
        TTS.stop();
        Statistic.errorCoutStatisticRequest = 1;
       // Statistic.keeptime(ISSTART);
       Speeker.ttsActive = false
        setTimeout(TTS.stop(), 100);
        noSleep.disable()
        noSleepx = 0
        numNext = Book.num + 1
        Statistic.keeptime(ISSTOP);
    }

    SpeakStart() {
        this.updateTTSTimestamp()
        console.log('Старт озвучивания');
        if(Panel.readYourself.checked == true) {
            Panel.Forward();
        } else {
            if(Panel.text_en.textContent.length == 0 && Panel.Translate.checked == true){
                TranslateBook.TranslateNum(Book.num);
            } else {
              //  TTS.stop();
                Speeker.updateReadList();
                this.Speak();
            }
            Statistic.keeptime(ISSTART);
        }
    }

    SpeakCheckStartStop(){
         if (Speeker.ttsActive == false){
            Speeker.SpeakStart();
         } else
         {
            Speeker.speak_pause();
        }
    }



    retryTTS() {
        console.log(`Попытка перезагрузки голосов #${this.ttsRetryCount + 1}`);
        
        Panel.voiceRusSelect.innerHTML = '';
        Panel.voiceEngSelect.innerHTML = '';
        
        setTimeout(() => this.ttsList(), 1000);
    }

    ttsList() {
        if (TTS_LOADING) return;
        TTS_LOADING = true;
        console.log('Загрузка списка голосов TTS...');
        
        TTS.getVoices()
            .then(voicesList => {
                this.ttsRetryCount = 0;
                TTS_LOADING = false;
                TTS_LOADED = true;
                console.log('Голоса TTS загружены, всего голосов:', voicesList.length);
                
                const ruVoices = voicesList.filter(voice => 
                    voice.language && voice.language.startsWith("ru")
                );
                
                const enVoices = voicesList.filter(voice => 
                    voice.language && voice.language.startsWith("en")
                );

                Panel.voiceRusSelect.innerHTML = '';
                if (ruVoices.length > 0) {
                    ruVoices.forEach((voice, index) => {
                        const displayName = voice.name || voice.identifier || `Голос ${index + 1}`;
                        Panel.voiceRusSelect.options[index] = new Option(displayName, index);
                    });
                    console.log('Найдено русских голосов:', ruVoices.length);
                } else {
                    Panel.voiceRusSelect.options[0] = new Option('Нет русских голосов', 0);
                    console.warn('Русские голоса не найдены');
                }

                Panel.voiceEngSelect.innerHTML = '';
                if (enVoices.length > 0) {
                    enVoices.forEach((voice, index) => {
                        const displayName = voice.name || voice.identifier || `Voice ${index + 1}`;
                        Panel.voiceEngSelect.options[index] = new Option(displayName, index);
                    });
                    console.log('Найдено английских голосов:', enVoices.length);
                } else {
                    Panel.voiceEngSelect.options[0] = new Option('No English voices', 0);
                    console.warn('Английские голоса не найдены');
                }

                const savedRusVoice = getCookie('voice_num');
                const savedEngVoice = getCookie('voice0_num');
                
                if (savedRusVoice !== null && savedRusVoice < Panel.voiceRusSelect.length) {
                    Panel.voiceRusSelect.selectedIndex = savedRusVoice;
                } else if (Panel.voiceRusSelect.length > 0) {
                    Panel.voiceRusSelect.selectedIndex = 0;
                }

                if (savedEngVoice !== null && savedEngVoice < Panel.voiceEngSelect.length) {
                    Panel.voiceEngSelect.selectedIndex = savedEngVoice;
                } else if (Panel.voiceEngSelect.length > 0) {
                    Panel.voiceEngSelect.selectedIndex = 0;
                }

                console.log('Голоса успешно загружены');
            })
            .catch(error => {
                console.error('Ошибка загрузки голосов:', error);
                TTS_LOADING = false;
                
                this.ttsRetryCount++;
                
                if (this.ttsRetryCount < this.maxTtsRetries) {
                    const delay = Math.min(1000 * Math.pow(1.5, this.ttsRetryCount), 10000);
                    
                    console.log(`Повторная попытка загрузки голосов через ${delay}ms (попытка ${this.ttsRetryCount}/${this.maxTtsRetries})`);
                    
                    setTimeout(() => this.ttsList(), delay);
                } else {
                    console.error('Превышено максимальное количество попыток загрузки голосов');
                    this.showVoiceLoadError();
                    this.createVoicePlaceholders();
                }
            });
    }

    showVoiceLoadError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'voice-error-message';
        errorDiv.innerHTML = 'Ошибка загрузки голосов. Проверьте подключение к интернету и обновите страницу.';
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    createVoicePlaceholders() {
        if (Panel.voiceRusSelect.options.length === 0) {
            Panel.voiceRusSelect.options[0] = new Option('Голос по умолчанию', 0);
        }
        
        if (Panel.voiceEngSelect.options.length === 0) {
            Panel.voiceEngSelect.options[0] = new Option('Default voice', 0);
        }
    }
}

class StatisticClass {
    constructor() {
        console.log('Инициализация StatisticClass');
        this.GetStatistic();
        this.errorCoutStatisticRequest = 0;
        this.CoutAddStatistic = 0;
        this.CoutAddStatisticList = 0;
        this.CoutAddStatisticLast= 0;
        this.isSendingRequest = false;
    }
    
    keeptime(inputVar = 0) {
        const TIMEREQUESTSECMIN = 30;
        const TIMEREQUESTSECMAX = 80;
        
        // Флаг, указывающий, что запрос уже отправлен и ожидает ответа
        if (Statistic.isSendingRequest === undefined) Statistic.isSendingRequest = false;
        
        if (inputVar == ISUPDATE) {
            // Обновление без добавления времени – можно отправлять всегда,
            // но тоже стоит проверять флаг, чтобы не создавать очередь
            if (!Statistic.isSendingRequest) {
                Statistic.isSendingRequest = true;
                $.post("https://api.allfilmbook.ru/book/keeptime/", {
                    id: Book.book_id, addTime: 0, UserName: UserName, UserHash: UserHash, last: Book.num
                })
                .done(function(data) {})
                .always(function() { Statistic.isSendingRequest = false; });
            }
            return;
        }
        
        var currentTime = new Date().getTime(); 
        if (lastTime !== null) {
            let tmplastTime = Math.floor(lastTime);
            var diffSeconds = Math.floor((currentTime - lastTime) / 1000);
            Statistic.CoutAddStatistic += diffSeconds;
            Statistic.CoutAddStatisticList += Book.num - lastTimeLast;
            lastTime = currentTime;
            lastTimeLast = Book.num;
            
            if ((Statistic.CoutAddStatistic > TIMEREQUESTSECMIN && Statistic.CoutAddStatistic < TIMEREQUESTSECMAX && inputVar != isReadYourSelf) ||
                (Statistic.CoutAddStatistic > 3 && Statistic.CoutAddStatistic < 120 && inputVar == isReadYourSelf) ||
                Statistic.errorCoutStatisticRequest > 0) { 
                
                var addTime = Statistic.CoutAddStatistic + Statistic.CoutAddStatisticLast;
               
                if (addTime == 0) addTime = 1;
                
                // Если уже есть активный запрос – пропускаем, данные продолжат накапливаться
                if (Statistic.isSendingRequest) {
                    console.log('Предыдущий запрос ещё не завершён, откладываем отправку');
                    return;
                }
                
                Statistic.CoutAddStatisticLast += Statistic.CoutAddStatistic;
                Statistic.CoutAddStatistic = 0;
                console.log('Отправляем в статистику :' + addTime + ' сек ' + Statistic.CoutAddStatistic + " + " + Statistic.CoutAddStatisticLast); 
                // Устанавливаем флаг перед отправкой
                Statistic.isSendingRequest = true;
                
                $.post({
                    url: "https://api.allfilmbook.ru/book/keeptime/",
                    data: {
                        id: Book.book_id, 
                        addTime: addTime, 
                        UserName: UserName, 
                        UserHash: UserHash, 
                        last: Book.num,
                        laststep: Statistic.CoutAddStatisticList,
                        timestep: tmplastTime
                    },
                    timeout: 5000 // таймаут 5 секунд
                })
                .done(function(data) { 
                    Statistic.errorCoutStatisticRequest = 0;
                    Statistic.CoutAddStatisticLast = 0;
                    console.log('Статистика получена сервером :' + addTime + ' сек');
                })
                .fail(function(xhr, status, error) {
                    Statistic.errorCoutStatisticRequest++;
                    console.log('Ошибка отправки:' + addTime + ' сек');
                })
                .always(function() {
                    // Сбрасываем флаг в любом случае (успех/ошибка/таймаут)
                    Statistic.isSendingRequest = false;
                });
                
            } else if((Statistic.CoutAddStatistic > 80 && inputVar != isReadYourSelf) || 
                      (Statistic.CoutAddStatistic > 120 && inputVar == isReadYourSelf)) {
                lastTime = currentTime;
            }
        } else {
            lastTime = currentTime;
            lastTimeLast = Book.num;
        }
        
        if(inputVar == ISSTOP) {
            lastTime = null;
            // При остановке можно также сбросить флаг, если он вдруг остался true
            Statistic.isSendingRequest = false;
        }
    }

    ocenka() {
        $.post("https://api.allfilmbook.ru/book/rating/", {
            book: Book.book_id,
            UserName: UserName, 
            UserHash: UserHash,
            tip: "1",
            r: Panel.ocenka_n.value
        });
    }

    GetStatistic() {
        $.post("https://api.allfilmbook.ru/book/statistic/", {
            UserName: UserName, 
            UserHash: UserHash 
        }).done(function(data) { 
            var json;
            json = JSON.parse(data)['results'];
            var out = '';
            out = "<br><table class='tableStatistic' width='" + screenWidth + "px'> <tr><th width='10%'>Дата</th><th width='30%'>Книга</th><th width='5%'>Время</th><th width='3%'>Вид</th><th width='5%'>Last</th></tr>";
            json.forEach(function (item, i, json) {
                if(item['last']) {
                    out += "<tr ><td>" + item['date'] + "</td><td><a href='list.html?AvtorId=" + item['authorId'] + "&IdBook=" + item['id'] + "'>" + item['name'] + "</a></td><td>" + item['time'] + "</td><td>" + item['type'] + "</td><td>" + item['last'] + "</td></tr>";
                } else {
                    out += "<tr class='tableStatItogi'><td>Худож.</td><td>" + item['HudMin'] + " мин.</td><td>Обучающие</td><td>" + item['ObuchMin'] + " мин.</td><td></td></tr>";
                }
            });
            Panel.StatisticOutElement.innerHTML = out + "</table></div>"
        }).fail(function() {
            setTimeout(() => { Statistic.GetStatistic(); }, 10 * 1000) 
        });
        
        return;
    }
}

var voicesList = [];
const screenWidth = window.screen.width;

var UserId = getCookie("UserId");
var UserHash = getCookie("user_hash");
var UserName = getCookie("user_login");
const ISSTART = 1;
const ISSTOP = 0;
const ISUPDATE = 2;
const isReadYourSelf = 3;

if (!UserHash || !UserName) { 
    Avtorization_ShowHide();
}

var numNext;
var noSleep = new NoSleep()
var noSleepx = 0
$.ajaxSetup({ timeout: 5000 })
var lastTime = null;

let TrimText = function (text) {
    if(text != undefined && text != ""){
        text = text.trim()
        text = text.replace(/[*{}(»›‹«)\r]+/g, "");
        text = text.replace(/&amp;|lt;|gt;/g, '');
        return text
    } else {
        return ''
    }
}

const CookiesUp = new CookiesClass;
const Panel = new VisualPanelClass;
const Book = new MainBookClass;
const Speeker = new SpeakClass;
const TranslateBook = new TranslateBookClass;
const Statistic = new StatisticClass;

setTimeout(function() {
    CookiesUp.start_cookie();
    if (Book.book_id > 1) { 
        Book.get_book() 
    }
}, 200)

setTimeout(function() {
    if (Panel.Translate.checked == true) {
        Speeker.updateReadList();
        TranslateBook.TranslateNum(Book.num);
    }
}, 1400)



function writeTextToFile(fileName, text, isAppend = false) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
            const dataObj = new Blob([text], { type: 'text/plain' });
            
            dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwrite = function() {
                        resolve(fileEntry);
                    };

                    fileWriter.onerror = function(e) {
                        console.log("Failed file write: " + e.toString());
                        reject(e);
                    };

                    if (isAppend) {
                        try { 
                            fileWriter.seek(fileWriter.length);  
                        } catch (e) {
                            console.log("file doesn't exist!"); 
                        }
                    }
                    
                    fileWriter.write(dataObj);
                });
            }, function(error) {
                console.log("Error creating file: " + error.toString());
                reject(error);
            });
        }, function(error) {
            console.log("Error resolving directory: " + error.toString());
            reject(error);
        });
    });
}



function readTextFromFile(fileName) {
  //  if(Book.platform=='android'){
        return new Promise((resolve, reject) => {
            try{
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                    dirEntry.getFile(fileName, {create: false}, function(fileEntry) {
                        fileEntry.file(function(file) {
                            const reader = new FileReader();
                            reader.onloadend = function() {
                                resolve({
                                    text: this.result,
                                    fileEntry: fileEntry,
                                    fullPath: fileEntry.fullPath
                                });
                            };
                            
                            reader.onerror = function(e) {
                                console.log("Failed file read: " + e.toString());
                                reject(e);
                            };
                            
                            reader.readAsText(file);
                        }, function(error) {
                            console.log("Error reading file: " + error.toString());
                            reject(error);
                        });
                    }, function(error) {
                        console.log("Error getting file: " + error.toString());
                        reject(error);
                    });
                }, function(error) {
                    console.log("Error resolving directory: " + error.toString());
                    reject(error);
                });
            } catch (error) { 
                console.log("Ошибка загрузки файловой системы. " + error.toString());
                reject(error);
            }
        });
  //  }
 //   else {
  //      reject(error);
   // }
}

function WriteBook(id, text) {
    writeTextToFile(id + '.fb2', text)
        .then(() => {
            console.log("Файл записан успешно");
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
}