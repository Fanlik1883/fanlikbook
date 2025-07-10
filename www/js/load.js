
if (Book.book_id > 1) { Book.get_book() } //Не всегда срабатывает

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




