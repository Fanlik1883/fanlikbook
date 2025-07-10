function keeptime(time_status) {
    var currentTime = new Date().getTime(); // текущее время в миллисекундах
    var addTime = 0; // количество секунд, прошедших с предыдущего запуска функции
    var diff = (currentTime - lastTime) / 1000; // разница в секундах

    if (lastTime !== null) {
        if (diff > 30 && diff < 80) { // проверяем условие
            addTime = Math.floor(diff); // округляем до целого числа
            if (addTime==0) addTime=1;
            $.post("https://allfilmbook.ru/API/book/keeptime/", {
                 id: Book.book_id, addTime: addTime, UserName: UserName, UserHash: UserHash, last: Book.num })
                 .done(function(data) { 
                    // data; 
                })

            lastTime=currentTime;
        }
        else 
            if(diff > 80) lastTime=currentTime;

    
        }
    else 
        lastTime=currentTime;

}


