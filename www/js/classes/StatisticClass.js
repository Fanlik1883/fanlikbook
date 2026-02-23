
class StatisticClass {
    constructor() {
        console.log('Инициализация StatisticClass');
        this.GetStatistic();
        this.errorCoutStatisticRequest = 0;
        this.CoutAddStatistic = 0;
        this.CoutAddStatisticLast= 0;
        this.isSendingRequest = false;
        this.lastTime =  null
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
        if (this.lastTime !== null) {
            let tmplastTime = Math.floor(this.lastTime);
            var diffSeconds = Math.floor((currentTime - this.lastTime) / 1000);
            Statistic.CoutAddStatistic += diffSeconds;
            this.lastTime = currentTime;

            
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
                this.lastTime = currentTime;
            }
        } else {
            this.lastTime = currentTime;
        }
        
        if(inputVar == ISSTOP) {
            this.lastTime = null;
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
            // Безопасный парсинг ответа
            const response = typeof data === 'string' ? JSON.parse(data) : data;
            const items = response.results || []; // защита от отсутствия results
            
            let out = `<table class='tableStatistic' >
                <tr>
                    <th width='10%'>Дата</th>
                    <th width='30%'>Книга</th>
                    <th width='5%'>Время</th>
                    <th width='3%'>Вид</th>
                    <th width='5%'>Last</th>
                </tr>`;
            
            items.forEach(function(item) {
                // Проверяем наличие поля last, а не его истинность
                if (item.hasOwnProperty('last') && item.last !== null && item.last !== undefined) {
                    out += `<tr>
                        <td>${item.date || ''}</td>
                        <td>
                            <a href="#" onclick='Book.changeBook(${item.id})'>${item.id}</a> -
                            <a href="list.html?AvtorId=${item.authorId}&IdBook=${item.id}">${item.name || ''}</a>
                        </td>
                        <td>${item.time || ''}</td>
                        <td>${item.type || ''}</td>
                        <td>${item.last}</td>
                    </tr>`;
                } else {
                    // Для итоговых записей проверяем наличие полей
                    out += `<tr class="tableStatItogi">
                        <td>Худож.</td>
                        <td>${item.HudMin || 0} мин.</td>
                        <td>Обучающие</td>
                        <td>${item.ObuchMin || 0} мин.</td>
                        <td></td>
                    </tr>`;
                }
            });
            
            Panel.StatisticOutElement.innerHTML = out + '</table>';
        }).fail(function() {
            setTimeout(() => { Statistic.GetStatistic(); }, 10000);
        });
    }



}