
class SpeakClass {
    constructor() {
        console.log('Инициализация SpeakClass');
        this.book_id;
        this.ReadList = [];
        this.ReadListCout = 10;
        this.ruVoiceFirst = 0;
        this.enVoiceFirst = 1;
        this.langFirstRead = this.ruVoiceFirst;
        this.ttsRetryCount = 0;
        this.maxTtsRetries = 5;
        this.ttsActive = false;
        this.ttsLastActivity = Date.now();
        this.ttsMonitorInterval = null;
        this.ttsCurrentPromise = null;
        this.ttsTimeoutId = null;
        this.isScreenOff = false;
        this.keepAliveTimer = null;
        this.ttsWatchdogTimer = null;
        this.voicesList=[]

        // Для браузерного синтеза
        this.speakQueue = [];
        this.isProcessing = false;
        this.isBrowser = (Book.platform !== 'android');
        this.browserVoices = [];
        this.browserRuVoices = [];
        this.browserEnVoices = [];

        this.tts_loading = false;
        this.tts_loaded = false;

        setTimeout(() => this.ttsList(), 3000);
        this.startTTSMonitor();
    }

    TrimText (text) {
        if(text != undefined && text != ""){
                text = text.trim()
                text = text.replace(/[*{}(»›‹«)\r]+/g, "");
                text = text.replace(/&amp;|lt;|gt;/g, '');
                return text
            } else {
                return ''
        }
    }
    updateReadList() {
        let i = 0;
        this.ReadList = [];
        while (i < this.ReadListCout) {
            let tmp;
            let tmp1 = 0;
            if (Book.book_mass_eng[Book.num + i] === undefined) {
                tmp = '';
            } else {
                tmp = Book.book_mass_eng[Book.num + i];
                tmp1 = 3;
            }
            this.ReadList.push({ 
                id: Book.num + i, 
                text: this.TrimText(Book.book_mass_rus[Book.num + i]), 
                textEng: tmp, 
                status: 0, 
                statusEng: tmp1 
            });
            i++;
        }
    }

    startTTSMonitor() {
        if (this.ttsMonitorInterval) clearInterval(this.ttsMonitorInterval);
        this.ttsMonitorInterval = setInterval(() => this.checkTTSStatus(), 15000);
    }

    checkTTSStatus() {
        const timeSinceLastActivity = Date.now() - this.ttsLastActivity;
        if (this.ttsActive && timeSinceLastActivity > 60000) {
            console.warn('TTS не отвечает, перезапуск...');
            this.restartTTS();
        }
    }

    updateTTSTimestamp() {
        this.ttsActive = true;
        this.ttsLastActivity = Date.now();
    }

    restartTTS() {
        console.log('Перезапуск TTS...');
        this.ttsActive = false;
        if (this.isBrowser) {
            window.speechSynthesis.cancel();
            this.speakQueue = [];
            this.isProcessing = false;
        } else {
            TTS.stop();
        }
    }

    // ---------- Основной цикл чтения ----------
    Speak() {
        const STATUS = {
            NOT_READY: 0,
            READY_FROM_TRANSLATE: 3,
            COMPLETED: 10
        };
        
        let notSpeek = false;
        let processedCount = 0;
        const translateEnabled = Panel.Translate.checked;
        const readRuEnabled = Panel.ReadRu.checked;
        const readEngEnabled = Panel.ReadEng.checked;

        if (Book.book_mass_rus[Book.num] !== undefined) {
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
            Panel.text_en.textContent = Book.book_mass_eng[Book.num];
            
            for (const [index, data] of this.ReadList.entries()) {
                if (processedCount > 1) break;
                const item = this.ReadList[index];

                if (translateEnabled && item.statusEng === STATUS.NOT_READY) {
                    notSpeek = true;
                    TranslateBook.TranslateNum(data.id);
                    processedCount++;
                    continue;
                }

                if (readRuEnabled && !readEngEnabled && !notSpeek) {
                    if (item.status === STATUS.NOT_READY) {
                        item.status = STATUS.COMPLETED;
                        this.speakTextRu(item.id);
                        processedCount++;
                    }
                } 
                else if (!readRuEnabled && readEngEnabled && !notSpeek) {
                    if (item.statusEng === STATUS.READY_FROM_TRANSLATE) {
                        item.statusEng = STATUS.COMPLETED;
                        this.speakTextEn(item.id);
                        processedCount++;
                    } else {
                        notSpeek = true;
                    }
                } 
                else if (readRuEnabled && readEngEnabled) {
                    if (item.status === STATUS.NOT_READY && item.statusEng === STATUS.READY_FROM_TRANSLATE && !notSpeek) {
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
                    }
                }
            }
        } else {
            this.speak_pause();
        }

        Statistic.keeptime(ISSTART);
        if (document.visibilityState === 'visible' && noSleep.enabled == false) { 
            try { noSleep.enable(); } catch (error) { } 
        }
        noSleepx = ISSTART;
        CookiesUp.setCookieMy(Book.name_file, Book.num);
        Panel.NumberLinesBook.value = Book.num;
        Panel.PercenLinesBook.value = (Book.num != 0) ? (Book.num / Book.numMax * 100).toFixed(1) + "%" : 0;
    }

    // ---------- Отправка текста в синтезатор (Android / Browser) ----------
    speakTextRu(index) {
        this.ttsActive = true;
        if (this.isBrowser) {
            this.browserSpeakRu(index);
        } else {
            console.log('Озвучивание Андройд (русский):', Book.book_mass_rus[index]?.substring(0, 50) + '...');
            TTS.speak({
                text: this.TrimText(Book.book_mass_rus[index]),
                locale: Panel.voiceRusSelect[Panel.voiceRusSelect.selectedIndex]?.label || 'ru-RU',
                rate: parseFloat(Panel.rateRusRange.value) || 1,
                cancel: false
            }).then(() => this.executeAfterSpeakRU(), (reason) => this.executeAfterSpeakError(reason));
        }
    }

    speakTextEn(index) {
        this.ttsActive = true;
        if (this.isBrowser) {
            this.browserSpeakEn(index);
        } else {
            console.log('Озвучивание Андройд (английский):', Book.book_mass_eng[index]?.substring(0, 50) + '...');
            TTS.speak({
                text: this.TrimText(Book.book_mass_eng[index]),
                locale: Panel.voiceEngSelect[Panel.voiceEngSelect.selectedIndex]?.label || 'en-US',
                rate: parseFloat(Panel.rateEngRange.value) || 1,
                cancel: false
            }).then(() => this.executeAfterSpeakEn(), (reason) => this.executeAfterSpeakError(reason));
        }
    }

    // ---------- Браузерный синтез (Web Speech API) ----------
    browserSpeakRu(index) {
        const text = this.TrimText(Book.book_mass_rus[index]);
        const voiceIndex = Panel.voiceRusSelect.selectedIndex;
        console.log('Озвучивание Браузер (русский):', text.substring(0, 50) + '...');
        // Убедимся, что голос действительно из массива русских голосов
        const voice = this.browserRuVoices[voiceIndex] || null;
        const rate = parseFloat(Panel.rateRusRange.value) || 1;

        this.speakQueue.push({
            execute: () => this.browserSpeakPromise(text, voice, rate),
            callback: () => this.executeAfterSpeakRU()
        });
        this.processBrowserQueue();
    }

    browserSpeakEn(index) {
        const text = this.TrimText(Book.book_mass_eng[index]);
        const voiceIndex = Panel.voiceEngSelect.selectedIndex;
        const voice = this.browserEnVoices[voiceIndex] || null;
        const rate = parseFloat(Panel.rateEngRange.value) || 1;
        console.log('Озвучивание Браузер (английский):', text.substring(0, 50) + '...');

        this.speakQueue.push({
            execute: () => this.browserSpeakPromise(text, voice, rate),
            callback: () => this.executeAfterSpeakEn()
        });
        this.processBrowserQueue();
    }

    browserSpeakPromise(text, voice, rate) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            if (voice) {
                utterance.voice = voice;
                // Для надёжности можно также установить lang из голоса
                utterance.lang = voice.lang;
            }
            utterance.rate = rate;
            utterance.onend = () => {
                this.updateTTSTimestamp();
                resolve();
            };
            utterance.onerror = (event) => reject(event.error);
            window.speechSynthesis.speak(utterance);
        });
    }

    processBrowserQueue() {
        if (this.isProcessing || this.speakQueue.length === 0) return;
        
        this.isProcessing = true;
        const task = this.speakQueue.shift();
        
        task.execute()
            .then(() => {
                task.callback();
                this.isProcessing = false;
                this.processBrowserQueue();
            })
            .catch((reason) => {
                console.error('Ошибка браузерного синтеза:', reason);
                this.executeAfterSpeakError(reason);
                this.isProcessing = false;
                this.processBrowserQueue();
            });
    }

    // ---------- Колбэки после озвучивания ----------
    executeAfterSpeakRU() {
        this.updateTTSTimestamp();
        if (!Panel.ReadEng.checked) {
            this.NextReadList();
        } else {
            Book.ScanTransReadList();
            if (!Panel.FirstLang.checked) this.NextReadList();   
        }
    }

    executeAfterSpeakEn() {
        this.updateTTSTimestamp();
        if (Panel.ReadRu.checked) Book.ScanTransReadList();
        if (Panel.FirstLang.checked) this.NextReadList(); 
    }

    executeAfterSpeakError(reason) {
        console.error('Ошибка синтеза речи:', reason);
        this.ttsActive = false;
        this.retryTTS();
    }

    NextReadList() {
        Book.num++;
        this.ReadList = this.ReadList.slice(1);
        const tmp = this.ReadList.slice(-1)[0].id + 1;
        const text = Book.book_mass_rus[tmp];
        this.ReadList.push({ id: tmp, text: text, status: 0, statusEng: 0 });
        this.Speak();
    }

 
    // Обновлённый метод паузы
    speak_pause() {
        console.log('Пауза озвучивания');

        if (this.isBrowser) {
            window.speechSynthesis.cancel();   // остановить все синтезы
            this.speakQueue = [];              // очистить очередь
            this.isProcessing = false;         // сбросить флаг обработки
        } else {
            TTS.stop();
            setTimeout(() => TTS.stop(), 100); // дополнительная защита
        }

        Statistic.errorCoutStatisticRequest = 1;
        this.ttsActive = false;
        noSleep.disable();
        noSleepx = 0;
        Statistic.keeptime(ISSTOP);
    }

    // Обновлённый обработчик ошибок
    executeAfterSpeakError(reason) {
        console.error('Ошибка синтеза речи:', reason);

        // Если это плановое прерывание (interrupted), просто игнорируем
        if (reason === 'interrupted' || (reason && reason.toString().includes('interrupted'))) {
            console.log('Плановая остановка, не обрабатываем как ошибку');
            this.ttsActive = false;   // сбрасываем активность, но перезагрузку не запускаем
            return;
        }

        // Реальная ошибка – пробуем перезагрузить голоса
        this.ttsActive = false;
        this.retryTTS();
    }

    // В browserSpeakPromise нужно убедиться, что reject получает именно строку ошибки
    browserSpeakPromise(text, voice, rate) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            if (voice) {
                utterance.voice = voice;
                utterance.lang = voice.lang;
            }
            utterance.rate = rate;
            utterance.onend = () => {
                this.updateTTSTimestamp();
                resolve();
            };
            utterance.onerror = (event) => reject(event.error); // event.error – строка
            window.speechSynthesis.speak(utterance);
        });
    }


    SpeakStart() {
        this.updateTTSTimestamp();
        console.log('Старт озвучивания');
        if (Panel.readYourself.checked) {
            Panel.Forward();
        } else {
            if (Panel.text_en.textContent.length === 0 && Panel.Translate.checked) {
                TranslateBook.TranslateNum(Book.num);
            } else {
                this.updateReadList();
                this.Speak();
            }
            Statistic.keeptime(ISSTART);
        }
    }

    SpeakCheckStartStop() {
        if (!this.ttsActive) {
            this.SpeakStart();
        } else {
            this.speak_pause();
        }
    }

    retryTTS() {
        console.log(`Попытка перезагрузки голосов #${this.ttsRetryCount + 1}`);
        Panel.voiceRusSelect.innerHTML = '';
        Panel.voiceEngSelect.innerHTML = '';
        setTimeout(() => this.ttsList(), 1000);
    }

    // ---------- ЗАГРУЗКА ГОЛОСОВ  ----------
    ttsList() {
        if (this.tts_loading) return;
        this.tts_loading = true;
        console.log('Загрузка списка голосов TTS...');

        if (this.isBrowser) {
            this.loadBrowserVoices();
        } else {
            this.loadAndroidVoices();
        }
    }

    // --- Android (Cordova TTS) ---
    loadAndroidVoices() {
        TTS.getVoices()
            .then(voicesList => this.handleAndroidVoices(voicesList))
            .catch(error => this.handleAndroidVoicesError(error));
    }

    handleAndroidVoices(voicesList) {
        this.ttsRetryCount = 0;
        this.tts_loading = false;
        this.tts_loaded = true;
        console.log('Голоса TTS загружены, всего голосов:', voicesList.length);

        const ruVoices = voicesList.filter(voice => voice.language && voice.language.startsWith("ru"));
        const enVoices = voicesList.filter(voice => voice.language && voice.language.startsWith("en"));

        this.populateAndroidVoiceSelects(ruVoices, enVoices);
        this.restoreSelectedVoices();
    }

    populateAndroidVoiceSelects(ruVoices, enVoices) {
        Panel.voiceRusSelect.innerHTML = '';
        if (ruVoices.length > 0) {
            ruVoices.forEach((voice, index) => {
                const displayName = voice.name || voice.identifier || `Голос ${index + 1}`;
                Panel.voiceRusSelect.options[index] = new Option(displayName, index);
            });
        } else {
            Panel.voiceRusSelect.options[0] = new Option('Нет русских голосов', 0);
        }

        Panel.voiceEngSelect.innerHTML = '';
        if (enVoices.length > 0) {
            enVoices.forEach((voice, index) => {
                const displayName = voice.name || voice.identifier || `Voice ${index + 1}`;
                Panel.voiceEngSelect.options[index] = new Option(displayName, index);
            });
        } else {
            Panel.voiceEngSelect.options[0] = new Option('No English voices', 0);
        }
    }

    handleAndroidVoicesError(error) {
        console.error('Ошибка загрузки голосов:', error);
        this.tts_loading = false;
        this.ttsRetryCount++;
        if (this.ttsRetryCount < this.maxTtsRetries) {
            const delay = Math.min(1000 * Math.pow(1.5, this.ttsRetryCount), 10000);
            setTimeout(() => this.ttsList(), delay);
        } else {
            console.error('Превышено максимальное количество попыток');
            this.showVoiceLoadError();
            this.createVoicePlaceholders();
        }
    }

    // --- Browser (Web Speech API) ---
    loadBrowserVoices() {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            this.processBrowserVoices(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                const updatedVoices = window.speechSynthesis.getVoices();
                this.processBrowserVoices(updatedVoices);
            };
        }
    }

    processBrowserVoices(voices) {
        this.tts_loading = false;
        this.tts_loaded = true;
        this.browserVoices = voices;
        this.browserRuVoices = voices.filter(v => v.lang && v.lang.startsWith('ru'));
        this.browserEnVoices = voices.filter(v => v.lang && v.lang.startsWith('en'));

        this.populateBrowserVoiceSelects();
        this.restoreSelectedVoices();
    }

    populateBrowserVoiceSelects() {
        Panel.voiceRusSelect.innerHTML = '';
        this.browserRuVoices.forEach((voice, index) => {
            Panel.voiceRusSelect.options[index] = new Option(voice.name, index);
        });
        if (this.browserRuVoices.length === 0) {
            Panel.voiceRusSelect.options[0] = new Option('Нет русских голосов', 0);
        }

        Panel.voiceEngSelect.innerHTML = '';
        this.browserEnVoices.forEach((voice, index) => {
            Panel.voiceEngSelect.options[index] = new Option(voice.name, index);
        });
        if (this.browserEnVoices.length === 0) {
            Panel.voiceEngSelect.options[0] = new Option('No English voices', 0);
        }
    }

    // --- Общие вспомогательные методы для голосов ---
    restoreSelectedVoices() {
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

        console.log('Голоса успешно восстановлены из cookie');
    }

    showVoiceLoadError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'voice-error-message';
        errorDiv.innerHTML = 'Ошибка загрузки голосов. Проверьте подключение к интернету и обновите страницу.';
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
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