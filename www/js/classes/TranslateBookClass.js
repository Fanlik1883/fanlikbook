class TranslateBookClass {
    constructor() {
        console.log('Инициализация TranslateBookClass');
        this.lang0 = "ru"
        this.lang1 = "en"
        this.start()
    }

    start(){
        setTimeout(function() {
        if (Panel.Translate.checked == true) {
                TranslateBook.TranslateNum(Book.num);
            }
        }, 1400)
    }
    TrimText(text) {
        return Speeker.TrimText(text); 
    }


    TranslateNum(num0) {
        if(Book.book_mass_eng[num0] == undefined) {

            console.log('Запрос перевода для строки:', num0);
            if (!Speeker.ReadList || Speeker.ReadList.length == 0) Speeker.updateReadList();
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