
class VisualPanelClass {
    constructor() {
        setTimeout(this.StartPanelText, 500)
        this.name = name
        this.Translate = document.getElementById("trans")
        this.ReadRu = document.getElementById("trans0")//Читать оригинал?
        this.ReadEng = document.getElementById("trans1") // Читать преревод
        this.textPanelEN = document.getElementById("textPanelEN") //Английская панель
        this.textPanelRU = document.getElementById("textPanelRU") //Русская панель
        this.Htrans0 = document.getElementById("Htrans0")
        this.Htrans = document.getElementById("Htrans")



        this.ocenka_n = document.getElementById("ocenka_n")
        this.text_ru = document.getElementById("text_ru")
        this.text_en = document.getElementById("text_en")
        this.voiceRusSelect = document.getElementById("voiceRusSelect")
        this.voiceEngSelect = document.getElementById("voiceEngSelect")
        this.list_files = document.getElementById("list_files")
        this.list_reader = document.getElementById('list_reader');
        this.lang_0 = document.getElementById("lang_0")
        this.lang_1 = document.getElementById("lang_1")

        this.rateRusRange = document.getElementById("rateRusRange")
        this.rateRusOut = document.querySelector('output[for="rateRusOut"]')
        this.rateEngRange = document.getElementById("rateEngRange")

        this.rateEngOut = document.querySelector('output[for="rateEngOut"]')


        this.NumberLinesBookSlider = document.getElementById("file_nommax")
        this.NumberLinesBook0 = document.getElementById("file_nom0") // Поле для строки ввода
        this.NumberLinesBook = document.getElementById("file_nom1") //Строка сейчас
        this.how = 0
        this.rateRusRange.addEventListener('change', updateOutputs);
        this.rateEngRange.addEventListener("change", updateOutputs)
        setTimeout(function() {
            this.voiceRusSelect.addEventListener("change", CookiesUp.updateVoice)
            this.voiceEngSelect.addEventListener("change", CookiesUp.updateVoice)
        },500)
        this.NumberLinesBook0.addEventListener("change", function (event) {
            Book.num = Number(Panel.NumberLinesBook0.value)
            Panel.NumberLinesBook.value = Panel.NumberLinesBook0.value
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
            Panel.text_en.textContent = Book.book_mass_eng[Book.num]
            CookiesUp.setCookieMy(Book.name_file, Book.num)
            numNext = Book.num + 1 }
        )

        this.Htrans0.addEventListener("change", function (event) {
            if (Panel.Htrans0.checked == true) { Panel.textPanelRU.style.display = 'none' }
            else if (Panel.Htrans0.checked == false) Panel.textPanelRU.style.display = ''
        })
        this.Htrans.addEventListener("change", function (event) {
            if (Panel.Htrans.checked == true) { Panel.textPanelEN.style.display = 'none' }
            else if (Panel.Htrans.checked == false) Panel.textPanelEN.style.display = ''
        })

        document.addEventListener("keydown", this.KeyDown)

        this.lang_0.addEventListener("change", this.updatelang)
        this.lang_1.addEventListener("change", this.updatelang)

        this.Translate.addEventListener('change', function () {
            CookiesUp.setCookieMy("ChekTranslate", Panel.Translate.checked)
            if (Panel.Translate.checked == true) {
                if (Book.book_mass_eng[Book.num] == undefined || Book.book_mass_eng[Book.num].length == 0) {
                    updateReadList();
                    TranslateBook.TranslateNum(Book.num);
                } Number(getCookie(Book.name_file))
            }
        });


    }


    updatelang() { TranslateBook.lang0 = Panel.lang_0.value; TranslateBook.lang1 = Panel.lang_1.value; }

    SettingsPanelHide() {
        if (Panel.how == 0) {
            Panel.listReaderGet();
            Panel.GetListFile();
            document.getElementById("myDropdown").classList.toggle("show")
            Panel.how = 1;
        } else {
            var dropdowns = document.getElementsByClassName("dropdown-content")
            var i
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i]
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show")
                }
            }
        }

        Panel.how = 0
    }




    KeyDown() {
        if (event.code == "ArrowRight") {
            Book.num = Book.num + 1
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
            Panel.NumberLinesBook.value = Book.num
            if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { Panel.text_en.textContent = Book.book_mass_eng[Book.num]; }
            numNext = Book.num + 1
        }
        if (event.code == "ArrowLeft") {
            Book.num = Book.num - 1
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
            Panel.NumberLinesBook.value = Book.num
            if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { Panel.text_en.textContent = Book.book_mass_eng[Book.num]; }
            numNext = Book.num + 1
        }
    }

    Back() {
        Book.num = Book.num - 1
        text_ru.textContent = Book.book_mass_rus[Book.num]
        Panel.NumberLinesBook.value = Book.num
        if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { Panel.text_en.textContent = Book.book_mass_eng[Book.num]; }
        else { Panel.text_en.textContent = '' }
        numNext = Book.num + 1
        updateReadList()
    }
    Forward() {
        Book.num = Book.num + 1
        Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
        Panel.NumberLinesBook.value = Book.num
        if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { Panel.text_en.textContent = Book.book_mass_eng[Book.num]; }
        else { Panel.text_en.textContent = '' }
        numNext = Book.num + 1
        updateReadList()
    }

    FirstVoiceRatePlus() {
        Panel.rateRusRange.value = Number(Panel.rateRusRange.value) + 0.1
        Panel.rateRusOut.value = Panel.rateRusRange.value;
        updateRateCookes();
    }

    FirstVoiceRateMinus() {
        Panel.rateRusRange.value = Number(Panel.rateRusRange.value) - 0.1
        Panel.rateRusOut.value = Panel.rateRusRange.value;
        updateRateCookes();
    }

    SecondVoiceRatePlus() {
        Panel.rateEngRange.value = Number(Panel.rateEngRange.value) + 0.1
        Panel.rateEngOut.value = Panel.rateEngRange.value;
        updateRate0Cookes();
    }

    SecondVoiceRateMinus() {
        Panel.rateEngRange.value = Number(Panel.rateEngRange.value) - 0.1
        Panel.rateEngOut.value = Panel.rateEngRange.value;
        updateRate0Cookes();
    }

        GetListFile() {
            $.post('https://allfilmbook.ru/API/book/reader/', { id: 7, UserName: UserName, UserHash: UserHash },
                function (data) {
                    var json;
                    json = JSON.parse(data);
                    Panel.list_files.innerHTML = '';
                    json.forEach(file => {
                        const link = document.createElement('a');
                        link.onclick = function () { Book.book_id = file.book_id; CookiesUp.setCookieMy('book_id', Book.book_id); location.reload(); }
                        link.innerText = file.title.slice(0, 50) + ' (' + file.last + ')';
                        Panel.list_files.appendChild(link);
                    });
                });
        }


        listReaderGet() {
            $.post('https://allfilmbook.ru/API/book/keeptimestat/', { id: 7, UserName: UserName, UserHash: UserHash },
                function (data) {
                    data = JSON.parse(data);
                    const link = document.createElement('div');
                    var obuchSeconds = data.obuchSeconds
                    var hudSeconds = data.hudSeconds
                    var hudAll = data.hudAll
                    var obuchAll = data.obuchAll
                    var hudTime = data.hudTime
                    var obuchTime = data.obuchTime
                    link.innerText = 'Худож: ' + hudTime + ' | Обуч. ' + obuchTime;
                    Panel.list_reader.innerHTML = '';
                    Panel.list_reader.appendChild(link);
                });
        }

        StartPanelText = function () {
            if (this.Htrans0.checked == true) { this.textPanelRU.style.display = 'none' }
            else if (this.Htrans0.checked == false) this.textPanelRU.style.display = ''
            if (this.Htrans.checked == true) { this.textPanelEN.style.display = 'none' }
            else if (this.Htrans.checked == false) this.textPanelEN.style.display = ''
        }

        }

class CookiesClass {
    constructor() {
        this.updateCookieState()
        this.checkboxes = ['trans', 'trans0', 'trans1', 'Htrans', 'Htrans0'];
        this.restoreCheckboxState()

    }
    updateCookieState() {
        document.getElementById('trans').onchange = function () { CookiesUp.setCookieMy('trans', document.getElementById('trans').checked.toString()); }
        document.getElementById('trans0').onchange = function () { CookiesUp.setCookieMy('trans0', document.getElementById('trans0').checked.toString()); }
        document.getElementById('trans1').onchange = function () { CookiesUp.setCookieMy('trans1', document.getElementById('trans1').checked.toString()); }
        document.getElementById('Htrans').onchange = function () { CookiesUp.setCookieMy('Htrans', document.getElementById('Htrans').checked.toString()); }
        document.getElementById('Htrans0').onchange = function () { CookiesUp.setCookieMy('Htrans0', document.getElementById('Htrans0').checked.toString()); }
    }

    restoreCheckboxState() { // Функция для восстановления состояния чекбоксов
        this.checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            const checkedValue = getCookie(id) === 'true';
            if (checkbox && typeof checkedValue !== 'undefined') { checkbox.checked = checkedValue; }
        });
    }
    start_cookie() {
        Panel.voiceEngSelect.selectedIndex = getCookie('voice0_num');
        Panel.rateEngRange.value = getCookie("rate0")
        Panel.rateEngOut.textContent = Panel.rateEngRange.value
        Panel.voiceRusSelect.selectedIndex = getCookie('voice_num');
        Panel.rateRusRange.value = getCookie("rate")
        Panel.rateRusOut.textContent = Panel.rateRusRange.value
    }

 updateVoice() {
    // Если изменение голоса
    this.setCookieMy("voice0_num", Panel.voiceEngSelect.value)
    this.setCookieMy("voice_num", Panel.voiceRusSelect.value)
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
        this.book_id = getCookie("book_id")
        this.book_name = getCookie(this.book_id + '_title');
        this.book_mass_rus = []
        this.book_mass_eng = []
        this.num
        this.name_file
        this.map = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', '[': '_', ']': '_', '-': '_', '.': '_', ' ': '_', '	': '_' };


    }

    get_book() {
        if (this.book_id == 0) return;
        $.ajaxSetup({
            timeout: 60000
        })
        $("#PleaseWait").show()
        var bookZip;
        if (bookZip = localStorage.getItem(this.book_id + "file_text")) {
            bookZip = this.decompressData(bookZip);


            try {
                this.book_mass_rus = JSON.parse(bookZip);
            } catch (e) {
                localStorage.clear();
                this.get_book();
            }

            Panel.NumberLinesBookSlider.value = this.book_mass_rus.length

            if (this.book_mass_rus.length < 100) {
                const ErrorZipArhiv = this.book_mass_rus.some(item => item.includes("ZipArchive"));
                const ErrorLoad = this.book_mass_rus.some(item => item.includes("TimeMemoryFunctionLocation"));

                if (ErrorZipArhiv || ErrorLoad) {
                    localStorage.removeItem(this.book_id + "file_text");
                    alert("Error: Ошибка Загрузки");
                    $("#PleaseWait").hide()
                    return;
                }
            }

            this.name_file = this.book_id
            if (Number(getCookie(this.name_file)) > 0) {
                this.num = Number(getCookie(this.name_file))
            } else
                this.num = 0

            Panel.NumberLinesBook.value = this.num

            Panel.text_ru.textContent = this.book_mass_rus[this.num]
            if (typeof Panel.text_ru.innerText !== this.book_mass_rus[this.num]) {
                Panel.text_ru.innerText = this.book_mass_rus[this.num]
            } else {
                Panel.text_ru.textContent = this.book_mass_rus[this.num]
            }
            numNext = this.num + 1;
            $("#PleaseWait").hide()
        } else {

            $.get("https://allfilmbook.ru/book/files.php", {
                id: this.book_id,
                unzip: 1,
                type: 'fb2'
            }).success(function (data) {
                Book.name_file = Book.book_id

                var json = data
                Book.mass_to_text(json)
                //---------------------------------------
                Panel.NumberLinesBookSlider.value = Book.book_mass_rus.length

                if (Book.book_mass_rus.length < 100) {
                    const ErrorZipArhiv = Book.book_mass_rus.some(item => item.includes("ZipArchive"));
                    const ErrorLoad = Book.book_mass_rus.some(item => item.includes("TimeMemoryFunctionLocation"));

                    if (ErrorZipArhiv || ErrorLoad) {
                        alert("Error: Ошибка Загрузки");
                        $("#PleaseWait").hide()
                        return;
                    }

                }
                if (Number(getCookie(Book.name_file)) > 0) {
                    Book.num = Number(getCookie(Book.name_file))
                } else
                    Book.num = 0
                Panel.NumberLinesBook.value = Book.num

                Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
                if (typeof Panel.text_ru.innerText !== Book.book_mass_rus[Book.num]) {
                    Panel.text_ru.innerText = Book.book_mass_rus[Book.num]
                } else {
                    Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
                }
                numNext = Book.num + 1
                var tmp = JSON.stringify(Book.book_mass_rus)
                tmp = Book.compressData(tmp); 
                try {
                    localStorage.setItem(Book.book_id + "file_text", tmp);
                } catch (e) {   
                    localStorage.clear();
                    localStorage.setItem(Book.book_id + "file_text", tmp);
                }
                CookiesUp.setCookieMy("file_text_name", Book.name_file)

                $("#PleaseWait").hide()
            })
        }

        CookiesUp.setCookieMy('book_id', Book.book_id)


        updateReadList();
    }

    openFile() {
        let input = event.target
        let val = ""
        this.name_file = event.target.files[0].name
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
        CookiesUp.setCookieMy(book_id + '_title', Book.name_book)

    }


    ScanTransReadList() {
        var i = 0;
        Speeker.ReadList.forEach((data, index) => {
            if (data.statusEng == 0 && data.textEng.length == 0) {
                TranslateBook.TranslateNum(data.id);
                return 0;
            }

        });
    }


 mass_to_text(json) {
    var from = json.search("<body>")
    var from_title = json.search("<book-title>") + 12

    var end_title = json.search("</book-title>")
    let Book2 = new Array()
    this.name_book = json.substring(from_title, end_title)
    document.title = "Книга - " + this.name_book;

    if (from > 0) {

        var to = json.length
        json = json.substring(from, to)
    }
    from = json.search("</body>")
    if (from > 0) {
        json = json.substring(0, from + 1)
    }
    json = json.replace(/<binary.*?>([\s\S]*?)<\/binary>/gi, ''); // Обрезаем все картинки
    json = json.replace(/<.+?>/gi, "")
    json = json.replace(/—/g, "-")

      Book2 = this.splitBook(json);

    this.book_mass_rus = Book2.map((s) => s.trim())
    Book2 = [];
    this.book_mass_rus = this.book_mass_rus.filter(Boolean)
    CookiesUp.setCookieMy(this.book_id + '_title', this.name_book);

}

 splitBook(bookString) {
        const MAX_LENGTH = 180;
        const MIN_LENGTH = 60;
        const MIN_END_LENGTH = 30;

        let sentences = bookString.match(/[^.!?]+[.!?]+/g);
        let result = [];
        let currentLine = "";

        for (let i = 0; i < sentences.length; i++) {
            let sentence = sentences[i].trim();

            if ((currentLine.length + sentence.length) <= MAX_LENGTH) {
                if (currentLine) {
                    currentLine += " " + sentence;
                } else {
                    currentLine = sentence; //.replace(/\n/g, '')
                }
            } else {

                result.push(currentLine);

                currentLine = sentence;
            }
        }

        if (currentLine) {
            result.push(currentLine);
        }

        return result;
    }

     buffer_add() {
    cordova.plugins.clipboard.paste(function (text) {
        this.book_mass_rus = [];
        this.mass_to_text(text)
        Panel.NumberLinesBookSlider.value = this.book_mass_rus.length

        this.book_id = 0
        this.num = 0
        // Выставляем максимум ползунка файла
        Panel.NumberLinesBookSlider.value = this.num
        Panel.NumberLinesthis.value = this.num

        Panel.text_ru.textContent = this.book_mass_rus[this.num]
        numNext = this.num + 1
    }
    )
}


 compressData(data) {
    var compressedData = LZString.compress(data);
    return compressedData;
}


 decompressData(compressedData) {
    var data = LZString.decompress(compressedData);
    return data;
}




}

class TranslateBookClass {
    constructor() {
      
         this.lang0 = "ru"
         this.lang1 = "en"
        }
  TranslateNum(num0) {
   //*------Запрос на получение перевод
   if(Book.book_mass_eng[num0]==undefined) {
   var textData = TrimText(Book.book_mass_rus[num0]);
   Speeker.ReadList.find(element => element.id === num0).statusEng=1; 
    $.get("https://allfilmbook.ru/API/translate/", {
        from: this.lang0,
        to: this.lang1,
        text: textData,
    }).success(function(data) {
        var json = JSON.parse(data);
        Book.book_mass_eng[num0]=json.response;
          Speeker.ReadList.find(element => element.id == num0).textEng=json.response; 
          Speeker.ReadList.find(element => element.id == num0).statusEng=3; 
          if(num0==Book.num) Panel.text_en.textContent =json.response;
    }).error(function(xhr, textStatus, errorThrown) {
   
        Speeker.ReadList.find(element => element.id === num0).statusEng=0; 
    })
 }
}

}

class SpeakClass {
    constructor() {
        this.book_id
        this.ReadList = new Array();
        this.ReadListCout = 10;// Сколько строчек попадают в массив для чтения одного языка
        setTimeout(this.ttsList, 3000);
    }


    Speak = function() {
        if (Book.book_mass_rus[Book.num] != undefined) {
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
            Panel.text_en.textContent = Book.book_mass_eng[Book.num];
            // Отследить остановку функции
           var out=0;
            Speeker.ReadList.forEach((data,index) => {  
                if (out==0) {
                if(Panel.Translate.checked==true) { if(Speeker.ReadList[index].statusEng==0){TranslateBook.TranslateNum(data.id);}}
                if(Panel.ReadRu.checked==true && Panel.ReadEng.checked==false){if(Speeker.ReadList[index].status==0) {Speeker.ReadList[index].status=10;this.speakTextRu(data.text,Speeker.ReadList[index].id);}else {out=out+1;}}
                if(Panel.ReadRu.checked==false && Panel.ReadEng.checked==true){if(Speeker.ReadList[index].statusEng==3){Speeker.ReadList[index].statusEng=10;this.speakTextEn(data.textEng,Speeker.ReadList[index].id)}else {out=out+1;}}
                if(Panel.ReadRu.checked==true && Panel.ReadEng.checked==true ){if(Speeker.ReadList[index].status==0 && Speeker.ReadList[index].statusEng==3) {Speeker.ReadList[index].status=10;this.speakTextRu(data.text,Speeker.ReadList[index].id);Speeker.ReadList[index].statusEng=10;this.speakTextEn(data.textEng,Speeker.ReadList[index].id);} else {out=out+1;}}
                }       
            });
           
        }

            keeptime(0);
            noSleep.enable();noSleepx = 1
            CookiesUp.setCookieMy(Book.name_file, Book.num)  // строчный куки
            Panel.NumberLinesBook.value = Book.num
        }




    speakTextRu(text, index) {
            TTS.speak({
                text: text,
                locale: Panel.voiceRusSelect[Panel.voiceRusSelect.selectedIndex].label,
                rate: Panel.rateRusRange.value,
                cancel: false
            }).then(function () {
                if (Panel.ReadEng.checked == false) {
                    Speeker.ReadList = Speeker.ReadList.slice(1);
                    lastElement = Speeker.ReadList.slice(-1)
                    var tmp = lastElement[0].id + 1;
                    Speeker.ReadList.push({ id: tmp, text: TrimText(Book.book_mass_rus[tmp]), textEng: '', status: 0, statusEng: 0 });
                    Book.num++; Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
                    Speeker.Speak();
                } else
                    Book.ScanTransReadList();


            }, function (reason) {
                alert('Ошибка синтеза речи: ' + reason);
            })
        }

    



    speakTextEn(text) {

            TTS.speak({
                text: text,
                locale: Panel.voiceEngSelect[Panel.voiceEngSelect.selectedIndex].label,
                rate: Panel.rateEngRange.value,
                cancel: false
            }).then(function () {
                Book.num++;
                Speeker.ReadList = Speeker.ReadList.slice(1);
                var lastElement = Speeker.ReadList.slice(-1)
                var tmp = lastElement[0].id + 1;
                Speeker.ReadList.push({ id: tmp, text: TrimText(Book.book_mass_rus[tmp]), textEng: '', status: 0, statusEng: 0 });

                if (Panel.ReadRu.checked == true) Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
                Panel.text_en.textContent = Book.book_mass_eng[Book.num];
                Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
                Book.ScanTransReadList();
                Speeker.Speak()

            }, function (reason) {
                alert('Ошибка синтеза речи: ' + reason);
            })

    }


 speak_pause () {
        TTS.stop();
        setTimeout(TTS.stop(), 100);
        noSleep.disable()
        noSleepx = 0
        numNext=Book.num+1

    keeptime(1);
}

 SpeakStart () {

        if(Panel.text_en.textContent.length==0 && Panel.Translate.checked==true){TranslateBook.TranslateNum(Book.num);}
        else {
        updateReadList();
        this.Speak();
    
        }
    keeptime(1);
}


 ttsList() {
    
    TTS.getVoices().then(voicesList => {
        const ruVoices = voicesList.filter(voicesList => voicesList.language === "ru_RU");
        const enVoices = voicesList.filter(voicesList => voicesList.language === "en_US");
        ruVoices.forEach((voicesList,index)=>{
            Panel.voiceRusSelect.options[index] = new Option(voicesList.identifier,index)
        }
        )

        enVoices.forEach((voicesList,index)=>{
            Panel.voiceEngSelect.options[index] = new Option(voicesList.identifier,index)
        }
        )
      });
      
}

}


 var voicesList=[];











var UserId = getCookie("UserId");
var UserHash = getCookie("UserHash");
var UserName = getCookie("UserName");

if (!UserHash || !UserName) { // Если не авторизован
    document.getElementById('Avtorization_link').innerHTML += '<li><a href="#" onclick=\'Avtorization_ShowHide()\'>Войти</a></li>';
}






var numNext;




var noSleep = new NoSleep()
var noSleepx = 0





$.ajaxSetup({ timeout: 5000 })


//*******************************

const queryOpts = {
    name: "clipboard-read",
    allowWithoutGesture: false
}
const permissionStatus = navigator.permissions.query(queryOpts)
var lastTime = null; // переменная для хранения времени последнего запуска функции
$("body").prepend("<div id='PleaseWait' name='PleaseWait' style='display: none;position: absolute;top: 50%;right: 50%;'><img src='img/load.gif' width='50' height='50'/></div>");








function ocenka() {
    // Отправляем оценку книги в БД
    $.get("https://allfilmbook.ru/API/RatingBook/", {
        book: Book.book_id,
        tip: "1",
        r: Panel.ocenka_n.value
    })
}


function updateRateCookes() { CookiesUp.setCookieMy("rate", Panel.rateRusRange.value) }

function updateRate0Cookes() { CookiesUp.setCookieMy("rate0", Panel.rateEngRange.value) }

function updateOutputs() {
    //*------Обноление показателей голоса
    CookiesUp.setCookieMy("rate", Panel.rateRusRange.value)
    Panel.rateRusOut.textContent = Panel.rateRusRange.value
    CookiesUp.setCookieMy("rate0", Panel.rateEngRange.value)
    Panel.rateEngOut.textContent = Panel.rateEngRange.value
}







let TrimText = function (text) {
    if(text!=undefined && text!=""){
        text = text.trim()
        text = text.replace(/[*{}(»›‹«)\r]+/g, "");
        text = text.replace(/&amp;|lt;|gt;/g, '');
        return text
    }
    else 
        return ''
}



const CookiesUp = new CookiesClass;
const Panel = new VisualPanelClass;

const Book = new MainBookClass;
const Speeker = new SpeakClass;
const TranslateBook = new TranslateBookClass;
setTimeout(function() {
CookiesUp.start_cookie()
if (Book.book_id > 1) { Book.get_book() } //Не всегда срабатывает

    handleOpenURL = function(url) {
        const idRegex = /id=(\d+)/; 
        const match = url.match(idRegex);
        Book.book_id=match[1];
        location.href='index.html'
     };

},200)

setTimeout(function() {if (Panel.Translate.checked==true) {updateReadList();TranslateBook.TranslateNum(Book.num);}}, 1400)