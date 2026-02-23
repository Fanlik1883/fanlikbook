class VisualPanelClass {
    constructor() {
        console.log('Инициализация VisualPanelClass');
        setTimeout(this.StartPanelText, 500)
        this.startAutorizationPanel()
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

    startAutorizationPanel(){
        if (!UserHash || !UserName) { 
            Avtorization_ShowHide();
        }
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
        if(this.readYourself.checked == true) {
            Statistic.keeptime(isReadYourSelf);
            Book.ScanTransReadList();
        } else {
            if(Book.num % 5 == 0) Statistic.keeptime(ISUPDATE)
        }
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