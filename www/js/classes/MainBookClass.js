class MainBookClass {
    constructor() {
        console.log('Инициализация MainBookClass');
        this.book_id = getCookie("book_id")
        this.initBook();
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

   initBook(){
    setTimeout(function() {
            if (Book.book_id > 1)  Book.get_book();
        }, 200)
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
    
    FileStorageInstance.readBook(this.book_id).then(result => {
        
        if (result.text.length < 100) {
            console.error('[DEBUG] Text too short, throwing error');
            throw new Error('Полученный файл слишком мал для книги.');
        }

        Book.mass_to_text(result.text);
        if (this.book_mass_rus.length < 100) {
            console.error('[DEBUG] Too few lines after conversion:', this.book_mass_rus.length);
            throw new Error('Книга слишком мала < 100 строк.');
        }
        
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
        $("#PleaseWait").hide()
        console.log('Книга успешно загружена, строк:', this.book_mass_rus.length);
    })
    .catch(error => {
        console.error('Ошибка загрузки книги из файла:', error);
        console.error('[DEBUG] Stack:', error.stack);
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
            FileStorageInstance.WriteBook(Book.book_id, data);
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
            $("#PleaseWait").hide()
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
        })
    }
}