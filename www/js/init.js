
class VisualPanelClass {
    constructor() {
        setTimeout(this.StartPanelText, 500)
        this.Translate = document.getElementById("TranslateRusPanel")
        this.ReadRu = document.getElementById("ReadRusPanel")//Читать оригинал?
        this.ReadEng = document.getElementById("ReadEngPanel") // Читать преревод
        this.textPanelEN = document.getElementById("textPanelEN") //Английская панель
        this.textPanelRU = document.getElementById("textPanelRU") //Русская панель
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
        this.NumberLinesBook0 = document.getElementById("file_nom0") // Поле для строки ввода
        this.NumberLinesBook = document.getElementById("file_nom1") //Строка сейчас
        this.StatisticOutElement = document.getElementById("StatisticOut") 
        this.FirstLang = document.getElementById("FirstLang") 


        this.rateRusRange.addEventListener('change', updateOutputs);
        this.rateEngRange.addEventListener("change", updateOutputs)
        setTimeout(function() {
            this.voiceRusSelect.addEventListener("change", CookiesUp.updateVoice)
            this.voiceEngSelect.addEventListener("change", CookiesUp.updateVoice)
        },5000)
        this.NumberLinesBook0.addEventListener("change", function (event) {
            Book.num = Number(Panel.NumberLinesBook0.value)
            Panel.NumberLinesBook.value = Panel.NumberLinesBook0.value
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
            Panel.text_en.textContent = Book.book_mass_eng[Book.num]
            CookiesUp.setCookieMy(Book.name_file, Book.num)
            numNext = Book.num + 1 }
        )

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
                    updateReadList();
                    TranslateBook.TranslateNum(Book.num);
                } Number(getCookie(Book.name_file))
            }
        });


    }


    updatelang() { TranslateBook.lang0 = Panel.lang_0.value; TranslateBook.lang1 = Panel.lang_1.value; }





    Back() {
        Book.num = Book.num - 1
        text_ru.textContent = Book.book_mass_rus[Book.num]
        Panel.NumberLinesBook.value = Book.num
        if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { Panel.text_en.textContent = Book.book_mass_eng[Book.num]; }
        else { Panel.text_en.textContent = '' }
        numNext = Book.num + 1
        if(Book.num % 5 == 0) Statistic.keeptime(isUpdate)

    }
    Forward() {
        Book.num = Book.num + 1
        Panel.text_ru.textContent = Book.book_mass_rus[Book.num]
        Panel.NumberLinesBook.value = Book.num
        if (Book.book_mass_eng[Book.num] !== undefined && Book.book_mass_eng[Book.num].length > 0) { Panel.text_en.textContent = Book.book_mass_eng[Book.num]; }
        else { Panel.text_en.textContent = '' }
        numNext = Book.num + 1
        if(this.readYourself.checked==true) {
               Statistic.keeptime(isReadYourSelf);
               Book.ScanTransReadList();
        }
        else
               if(Book.num % 5 == 0) Statistic.keeptime(isUpdate)
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



        StartPanelText = function () {
            if (this.HideRusPanel.checked == true) { this.textPanelRU.style.display = 'none' }
            else if (this.HideRusPanel.checked == false) this.textPanelRU.style.display = ''
            if (this.HideEngPanel.checked == true) { this.textPanelEN.style.display = 'none' }
            else if (this.HideEngPanel.checked == false) this.textPanelEN.style.display = ''
        }

        }

class CookiesClass {
    constructor() {
        this.updateCookieState()
        this.checkboxes = ['TranslateRusPanel', 'ReadRusPanel', 'ReadEngPanel', 'HideEngPanel', 'HideRusPanel','FirstLang','readYourself'];
        this.restoreCheckboxState()

    }
    updateCookieState() {
        document.getElementById('TranslateRusPanel').onchange = function () { CookiesUp.setCookieMy('TranslateRusPanel', document.getElementById('TranslateRusPanel').checked.toString()); }
        document.getElementById('ReadRusPanel').onchange = function () { CookiesUp.setCookieMy('ReadRusPanel', document.getElementById('ReadRusPanel').checked.toString()); }
        document.getElementById('ReadEngPanel').onchange = function () { CookiesUp.setCookieMy('ReadEngPanel', document.getElementById('ReadEngPanel').checked.toString()); }
        document.getElementById('HideEngPanel').onchange = function () { CookiesUp.setCookieMy('HideEngPanel', document.getElementById('HideEngPanel').checked.toString()); }
        document.getElementById('HideRusPanel').onchange = function () { CookiesUp.setCookieMy('HideRusPanel', document.getElementById('HideRusPanel').checked.toString()); }
        document.getElementById('FirstLang').onchange = function () { CookiesUp.setCookieMy('FirstLang', document.getElementById('FirstLang').checked.toString()); }
        document.getElementById('readYourself').onchange = function () { CookiesUp.setCookieMy('readYourself', document.getElementById('readYourself').checked.toString()); }
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
        this.book_id = getCookie("book_id")
        this.book_name = getCookie(this.book_id + '_title');
        this.book_mass_rus = []
        this.book_mass_eng = []
        this.num
        this.name_file
        this.bookhead = {}
        this.map = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', '[': '_', ']': '_', '-': '_', '.': '_', ' ': '_', '	': '_' };


    }

    changeBook(id){
        CookiesUp.setCookieMy('book_id', id); 
        location.reload();
    }

    reReadBook(){
       
        this.get_book();
    }

    get_book() {
        if (this.book_id == 0) return;
        $.ajaxSetup({
            timeout: 120000
        })
        $("#PleaseWait").show()
        readTextFromFile(this.book_id+'.fb2').then(result => {

        
            if (result.text.length < 100) goto: ReGetBook;
            //result.text= this.decompressData(result.text);
            Book.mass_to_text(result.text)   ;  
            

            if (this.book_mass_rus.length < 100) {

            goto: ReGetBook;
            }
            Panel.NumberLinesBookSlider.value = this.book_mass_rus.length

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
            updateReadList();
            $("#PleaseWait").hide()
        })
        .catch(error => {
            ReGetBook:
            $.get("https://api.allfilmbook.ru/book/file/", {
                id: this.book_id,
                unzip: 1,
                type: 'fb2'
            }).success(function (data) {
                Book.name_file = Book.book_id
                var json = data
           //   var tmp = Book.compressData(json);  
           
                if (json.error) {
                    alert(json.error+': '+json.message);
                    $("#PleaseWait").hide()
                    return;
                }
                WriteBook(Book.book_id,json);
                Book.mass_to_text(json)
                Panel.NumberLinesBookSlider.value = Book.book_mass_rus.length

                
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

                $("#PleaseWait").hide()
                updateReadList();
            })
        
      
    });

        CookiesUp.setCookieMy('book_id', Book.book_id)
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
        Speeker.ReadList.forEach((data) => {
            if (data.statusEng == 0 && Book.book_mass_eng.length == 0) {
                TranslateBook.TranslateNum(data.id);
                return 0;
            }

        });
    }


 mass_to_text(json) {
  var Body0=json.indexOf("<body>");
  var Body1=json.indexOf("</body>")+7;
  if (Body1<10){$("#PleaseWait").hide();return;}

    var text=json.slice(Body0, Body1); 
     var head=json.slice( 0,Body0);
      var foot=json.slice(Body1); 
      text=text.replace(/<[^>]*?>/ig,'');
      text=text.replace(/[\'\"]*/,'`');
      this.bookhead.book=text.split("\n");
      this.bookhead.book = this.bookhead.book.map(s => s.trim());
      this.bookhead.book=this.splitArray(this.bookhead.book.filter(n => n))
      json=head+" "+foot;

    
    
    var tmp= parseXml(json);

 
  try{  this.bookhead.description =tmp.FictionBook.description['title-info']} catch{}
  try{  this.bookhead.img =tmp.FictionBook.binary; } catch{}
  try{ this.bookhead.title=tmp.FictionBook.description['title-info']['book-title']['#text'];} catch{}

     document.title = "Книга - " + this.bookhead.title;
    this.book_mass_rus =this.bookhead.book;
    this.book_mass_rus = this.book_mass_rus.filter(Boolean)
    CookiesUp.setCookieMy(this.book_id + '_title', this.name_book);
    this.putDescription()



}

  putDescription(){
        if (typeof this.bookhead == "undefined") return 0;
        
        var descriptionOut = document.getElementById("descriptionOut")
        var tmp='';
        tmp='<h2>'+Book.bookhead['title']+'</h2>';
        try{    
            if(Book.bookhead['img'].constructor==Array){
Book.bookhead['img'].forEach(pic => { tmp+='<img src="data:'+pic['content-type']+';base64, '+pic['#text']+'" class="imgDescription" /><br>'})
            }
            else
            if (Book.bookhead['img'] !=undefined &&'#text' in Book.bookhead['img'])  tmp+='<img src="data:'+Book.bookhead['img']['content-type']+';base64, '+Book.bookhead['img']['#text']+'" class="imgDescription" /><br>'

        } catch(error){//tmp+='<img src="'+Book.book_id+'" class="imgDescription" alt="Red dot" /><br>'

        }
        
        try{if (typeof Book.bookhead['description']['author'][0] == "undefined")    { 
            var tmp2=Book.bookhead['description']['author'];        
            tmp+='Автор: ';
            if ('first-name'in tmp2)tmp+=tmp2['first-name']['#text']+' ';
            if ('middle-name' in tmp2)tmp+=tmp2['middle-name']['#text']+' ';
            if ('last-name' in tmp2)tmp+=tmp2['last-name']['#text']+' ';
            tmp+='<br>';
        }
        else {
            tmp+='Авторы: <br>';
            Book.bookhead['description']['author'].forEach((text) => { 
                if ('first-name'in text)tmp+=text['first-name']['#text']+' ';
                if ('middle-name' in text)tmp+=text['middle-name']['#text']+' ';
                if ('last-name' in text)tmp+=text['last-name']['#text']+' ';    
                tmp+='<br>';
            })
        }
        } catch(error){}
       try{ if ('sequence' in Book.bookhead['description']) if ('name' in Book.bookhead['description']['sequence'])   tmp+='Серия: '+Book.bookhead['description']['sequence']['name']+", №"+Book.bookhead['description']['sequence']['number']+'<br>'; } catch(error){} 
       tmp+='<hr>Жанр: ';
        try{ if ('genre' in Book.bookhead['description']) Book.bookhead['description']['genre'].forEach((text) => { tmp+=text['#text']+' '; })} catch(error){}
 try{
        tmp+='<hr>Анотация: <br>';
        if('annotation'in Book.bookhead['description']){
        if ('p' in Book.bookhead['description']['annotation'])
        {
            if ('0' in Book.bookhead['description']['annotation']['p']){
                Book.bookhead['description']['annotation']['p'].forEach((text) => { tmp+=text['#text']+' <br>'; })}
            else {
                tmp+=Book.bookhead['description']['annotation']['p']['#text']+' <br>'
            }
        }}
        tmp+='<hr>Дата создания: '+Book.bookhead['description']['date']['value']+'<br>';
   } catch(error){}
        descriptionOut.innerHTML=tmp;
  }

  splitArray(bookArray) {
    const MAX_LENGTH = 150;
    var outArray= new Array;
    bookArray.forEach((ArrTmp) => {
        if (typeof ArrTmp == "undefined") return outArray;
        if(ArrTmp.length>MAX_LENGTH) {
                    let sentences = ArrTmp.match(/[^.!?]+[.!?]+/g);
            outArray = outArray.concat(sentences)
        }
        else
        outArray.push(ArrTmp)

     })
     return outArray;
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
   if(Book.book_mass_eng[num0]==undefined) {
   Speeker.ReadList.find(element => element.id === num0).statusEng=1; 
    $.get("https://api.allfilmbook.ru/translate/", {
        from: this.lang0,
        to: this.lang1,
        text: TrimText(Book.book_mass_rus[num0]),
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
        this.ruVoiceFirst=0;
        this.enVoiceFirst=1;
        this.langFirstRead=this.ruVoiceFirst;

        setTimeout(this.ttsList, 3000);
    }


    Speak = function() {
        if (Book.book_mass_rus[Book.num] != undefined) {
            Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
            Panel.text_en.textContent = Book.book_mass_eng[Book.num];
            var out=0;
            Speeker.ReadList.forEach((data,index) => {  
                if (out==0) {
                    if(Panel.Translate.checked==true) { if(Speeker.ReadList[index].statusEng==0){TranslateBook.TranslateNum(data.id);}}
                    if(Panel.ReadRu.checked==true && Panel.ReadEng.checked==false){if(Speeker.ReadList[index].status==0) {Speeker.ReadList[index].status=10;this.speakTextRu(Speeker.ReadList[index].id);}else {out=out+1;}}
                    if(Panel.ReadRu.checked==false && Panel.ReadEng.checked==true){if(Speeker.ReadList[index].statusEng==3){Speeker.ReadList[index].statusEng=10;this.speakTextEn(Speeker.ReadList[index].id)}else {out=out+1;}}
                    if(Panel.ReadRu.checked==true && Panel.ReadEng.checked==true ){
                        if(Speeker.ReadList[index].status==0 && Speeker.ReadList[index].statusEng==3) {
                           if(Panel.FirstLang.checked) {
                                this.speakTextRu(Speeker.ReadList[index].id);
                                this.speakTextEn(Speeker.ReadList[index].id);}
                           else {
                                this.speakTextEn(Speeker.ReadList[index].id);
                                this.speakTextRu(Speeker.ReadList[index].id)}
                           Speeker.ReadList[index].statusEng=10;
                           Speeker.ReadList[index].status=10;

                        } else {out=out+1;}}
                    }       
            });
           
        }

            Statistic.keeptime(isStart);
            if (document.visibilityState === 'visible' &&  noSleep.enabled==false) { try {  noSleep.enable(); } catch (error) { } }
            noSleepx = isStart
            CookiesUp.setCookieMy(Book.name_file, Book.num)  // строчный куки
            Panel.NumberLinesBook.value = Book.num
        }




    speakTextRu(index) {
            TTS.speak({
                text: TrimText(Book.book_mass_rus[index]),
                locale: Panel.voiceRusSelect[Panel.voiceRusSelect.selectedIndex].label,
                rate: Panel.rateRusRange.value,
                cancel: false
            }).then(function () {
                if (Panel.ReadEng.checked == false) {
                    Speeker.NextReadList();
                    
                } else {
                     Book.ScanTransReadList();
                     if(!Panel.FirstLang.checked)  Speeker.NextReadList();   
                    }


            }, function (reason) {
                alert('Ошибка синтеза речи: ' + reason);
            })
        }

    



    speakTextEn(index) {

            TTS.speak({
                text: TrimText(Book.book_mass_eng[index]),
                locale: Panel.voiceEngSelect[Panel.voiceEngSelect.selectedIndex].label,
                rate: Panel.rateEngRange.value,
                cancel: false
            }).then(function () {
                if (Panel.ReadRu.checked == true) Book.ScanTransReadList();
                if (Panel.FirstLang.checked) Speeker.NextReadList();   

                
            }, function (reason) {
                alert('Ошибка синтеза речи: ' + reason);
            })

    }

 NextReadList(){
                Book.num++;
                Speeker.ReadList = Speeker.ReadList.slice(1);
                var tmp = Speeker.ReadList.slice(-1)[0].id + 1
                Speeker.ReadList.push({ id: tmp, status: 0, statusEng: 0 });
                Panel.text_en.textContent = Book.book_mass_eng[Book.num];
                Panel.text_ru.textContent = Book.book_mass_rus[Book.num];
                Speeker.Speak()
 }
 speak_pause () {
        TTS.stop();
        Statistic.errorCoutStatisticRequest=1;
        Statistic.keeptime(isStart);
        setTimeout(TTS.stop(), 100);
        noSleep.disable()
        noSleepx = 0
        numNext=Book.num+1

    Statistic.keeptime(isStop);
}

 SpeakStart () {
 if(Panel.readYourself.checked==true) Panel.Forward();
 else {
        if(Panel.text_en.textContent.length==0 && Panel.Translate.checked==true){TranslateBook.TranslateNum(Book.num);}
        else {
            TTS.stop();
            updateReadList();
            this.Speak();
        
        }
        Statistic.keeptime(isStart);
}
}


 ttsList() {
    
    TTS.getVoices()
      .then(voicesList => {
        const ruVoices = voicesList.filter(voicesList => voicesList.language === "ru_RU");
        const enVoices = voicesList.filter(voicesList => voicesList.language === "en_US");
        ruVoices.forEach((voicesList,index)=>{
            Panel.voiceRusSelect.options[index] = new Option(voicesList.identifier,index)
        }
        )

        Panel.voiceRusSelect.selectedIndex = getCookie('voice_num');
        enVoices.forEach((voicesList,index)=>{
            Panel.voiceEngSelect.options[index] = new Option(voicesList.identifier,index)
        }
        )
        Panel.voiceEngSelect.selectedIndex = getCookie('voice0_num');
      })  
      .catch(error => {
        
        if(Vars.ErrorLoadTts<2) {setTimeout(Speeker.ttsList,2000);Vars.ErrorLoadTts++;}
});
      
}

}
var voices;

class StatisticClass {
    constructor() {
                    this.GetStatistic();
                    this.errorCoutStatisticRequest=0;
                    this.CoutAddStatistic=0;
    }
    
  keeptime(inputVar=0) {

        if(inputVar==isUpdate) {
            $.post("https://api.allfilmbook.ru/book/keeptime/", {
                id: Book.book_id, addTime: 0, UserName: UserName, UserHash: UserHash, last: Book.num })
                .done(function(data) { 
                // data; 
            })
            return;
        }
        
        
        var currentTime = new Date().getTime(); 

        if (lastTime !== null) {
            var diff = (currentTime - lastTime) / 1000; 
            Statistic.CoutAddStatistic+=diff;
            if ((Statistic.CoutAddStatistic > 30 && Statistic.CoutAddStatistic < 80&&inputVar!=isReadYourSelf)||(Statistic.CoutAddStatistic > 3 && Statistic.CoutAddStatistic < 120 && inputVar==isReadYourSelf||Statistic.errorCoutStatisticRequest>0) ) { 
                var addTime = Math.floor(Statistic.CoutAddStatistic); 
                if (addTime==0) addTime=1;
                $.post("https://api.allfilmbook.ru/book/keeptime/", {id: Book.book_id, addTime: addTime, UserName: UserName, UserHash: UserHash, last: Book.num }).done(function(data) { Statistic.errorCoutStatisticRequest=0;Statistic.CoutAddStatistic=0;})
                .fail(function(xhr, status, error) {
                    Statistic.errorCoutStatisticRequest++;
                    
                });
                lastTime=currentTime;
            }
            else 
              if((Statistic.CoutAddStatistic > 80 &&inputVar!=isReadYourSelf)||Statistic.CoutAddStatistic > 120 && inputVar==isReadYourSelf) lastTime=currentTime;
           
            }
        else 
            lastTime=currentTime;
        if(inputVar==isStop)  lastTime= null;
    
    }

   ocenka() {

        $.get("https://api.allfilmbook.ru/RatingBook/", {
            book: Book.book_id,
            tip: "1",
            r: Panel.ocenka_n.value
        })
    }

      GetStatistic() {


            $.post("https://api.allfilmbook.ru/book/statistic/", {
                UserName: UserName, UserHash: UserHash })
                .done(function(data) { 
                    var json;
                    json = JSON.parse(data)['results'];
                    var out='';
                    out ="<br><table class='tableStatistic'   width='"+screenWidth+"px'> <tr><th width='10%'>Дата</th><th width='30%'>Книга</th><th width='5%'>Время</th><th width='3%'>Вид</th><th width='5%'>Last</th></tr>";
                    json.forEach(function (item, i, json) {
                        if(item['last']) out+="<tr ><td>"+item['date']+"</td><td><a href='/list.html?AvtorId="+item['authorId']+"&IdBook="+item['id']+"'>"+item['name']+"</a></td><td>"+item['time']+"</td><td>"+item['type']+"</td><td>"+item['last']+"</td></tr>";
                        else out+= "<tr class='tableStatItogi'><td>Худож.</td><td>"+item['HudMin']+" мин.</td><td>Обучающие</td><td>"+item['ObuchMin']+" мин.</td><td></td></tr>";
                    })
                    Panel.StatisticOutElement.innerHTML=out+"</table></div>"
            }).fail(function() {
        setTimeout(() => { Statistic.GetStatistic(); }, 10 * 1000) 
     })
        
        
            return;
        
    }


}
 var voicesList=[];

 const screenWidth = window.screen.width;




var UserId = getCookie("UserId");
var UserHash = getCookie("user_hash");
var UserName = getCookie("user_login");
var isStart=1;
var isStop=0;
var isUpdate=2;
var isReadYourSelf=3;
if (!UserHash || !UserName) { // Если не авторизован
    document.getElementById('Avtorization_link').innerHTML += '<li><a href="#" onclick=\'Avtorization_ShowHide()\'>Войти</a></li>';
}






var numNext;




var noSleep = new NoSleep()
var noSleepx = 0





$.ajaxSetup({ timeout: 5000 })




const queryOpts = {
    name: "clipboard-read",
    allowWithoutGesture: false
}

const permissionStatus = navigator.permissions.query(queryOpts)
var lastTime = null; // переменная для хранения времени последнего запуска функции
$("body").prepend("<div id='PleaseWait' name='PleaseWait' style='display: none;position: absolute;top: 50%;right: 50%;'><img src='img/load.gif' width='50' height='50'/></div>");











function updateRateCookes() { CookiesUp.setCookieMy("rate", Panel.rateRusRange.value) }

function updateRate0Cookes() { CookiesUp.setCookieMy("rate0", Panel.rateEngRange.value) }

function updateOutputs() {
    //*------Обноление показателей голоса
    CookiesUp.setCookieMy("rate", Panel.rateRusRange.value)
    Panel.rateRusOut.textContent = Panel.rateRusRange.value
    CookiesUp.setCookieMy("rate0", Panel.rateEngRange.value)
    Panel.rateEngOut.textContent = Panel.rateEngRange.value
}

class VarClass {
    constructor() {
                    this.ErrorLoadTts=0;
    }
}






let TrimText = function (text) { /* Переместить в book*/
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
const Statistic = new StatisticClass;
const Vars = new VarClass;

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


function updateReadList() {
    i = 0;
    Speeker.ReadList = [];
    
    while (i < Speeker.ReadListCout) {
        var tmp;
        var tmp1 = 0;
        if (Book.book_mass_eng[Book.num + i] == undefined) tmp = '';
        else {
            tmp = Book.book_mass_eng[Book.num + i];
            tmp1 = 3;
        }
        Speeker.ReadList.push({ id: Book.num + i, text: TrimText(Book.book_mass_rus[Book.num + i]), textEng: tmp, status: 0, statusEng: tmp1 })
        i++;
    }
}







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
}0

function readTextFromFile(fileName) {
    return new Promise((resolve, reject) => {
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
    });
}



function WriteBook(id,text) {
    writeTextToFile(id+'.fb2', text)
        .then(() => {
            console.log("Файл записан успешно");
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
}

function КeadBook(id) {
    readTextFromFile(id+'.fb2')
        .then(result => {
            console.log("Содержимое:", result.text);
        })
        .catch(error => {

        });
}



