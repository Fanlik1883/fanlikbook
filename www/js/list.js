let errorCount=0;
const TIMEOUTREQUEST=5000;
$.ajaxSetup({timeout: TIMEOUTREQUEST});
class ViewBookClass {
    constructor() {
        this.ViewPort = document.getElementById('ViewPort');
        this.BookList()


    }
     BookList() {
                let params = new URLSearchParams(document.location.search);
               // let req_out = this.ViewPort;
                let rateR=0;
                if (Data.rateBook===true) rateR=3;
                if(params.get('AvtorId')){Data.datas=params.get('AvtorId');Data.type=7;}
                if(params.get('SeqId')){Data.datas=params.get('SeqId');Data.type=8;}
                if(params.get('SearchTitle')){Data.datas=params.get('SearchTitle');Data.type=9;}

                
                let finds = '';// 
                $.post('https://api.allfilmbook.ru/book/list/', {UserName: UserName, UserHash: UserHash,  type: Data.type, rate: rateR , year: Data.year, step: Data.step, data: Data.datas}).success(function (data) {
            
                   let json = JSON.parse(data);
                    if (json.length === 0) {
              } else {
                    json.forEach(function (item, i, json) {
                        let liLast = document.createElement('div');
                        liLast.className = "MovieCardFace";
                        liLast.id = 'Book_'+item['book_id'];
                        liLast.addEventListener('click', function() { ViewBook.showDesc(item['book_id']); });
                        liLast.insertAdjacentHTML('afterBegin', "<img src='"+item['image']+"' alt='"+item['title']+"' class='MovesPicFace'> \
                                            <div class='short-infobar' id='name_"+item['book_id']+"'><span class='short-quality'>"+item['title']+"</span></div> \
                                            <div class='overlay' id='overlay_"+item['book_id']+"'>"+item['rate']+"</div> \
                                            <div class='desc hide' id='desc_"+item['book_id']+"' ></div> \
                        l                   </div>");
                        ViewBook.ViewPort.append(liLast); 	
	
                    }
                
                )
                    if((Data.SaveiD>0 && Data.type<5)||(Data.SaveiD>0 && Data.type==7)) {
                        if (document.querySelector('#Book_'+Data.SaveiD) !== null) {
                            document.querySelector('#Book_'+Data.SaveiD).scrollIntoView({ behavior: 'smooth' });
                            Data.SaveiD=0;
                        }
                    }	
                }
                }).fail(function () {
                    errorCount++;
                    if (errorCount < 3) {
                        if (confirm('Не удалось загрузить данные. Повторить запрос?')) {
                            ViewBook.BookList();
                        }
                    } else {
                        errorCount = 0;
                        alert('Не удается подключиться к серверу. Проверьте интернет-соединение.');
                    }
                });


            }

 GetDesc(n){
    
    $.get('https://api.allfilmbook.ru/book/description/', { n: n}).done(function (data) {
		let json = JSON.parse(data);
        if (json.length === 0) {
                      //  req_out.innerHTML = "<img src='/img/zero.jpg' style=' width: 100%;' title='' />";
                    } else {
                        
        let req_out = document.getElementById('desc_'+n);
		json.forEach(function (item, i, json) {
            req_out.insertAdjacentHTML('afterBegin','<img  src=\'img/read.png\' onclick="openBook('+n+')" class=\'bottons\'>');
            if(Data.type==3 )  req_out.insertAdjacentHTML('beforeEnd','<img  src=\'img/minus-2-icon-14-256.png\' id="bottonMinusFavorite_'+n+'" onclick="minusFavorites('+n+')" class=\'bottons\'>');
            if(Data.type==4)  req_out.insertAdjacentHTML('beforeEnd','<img  src=\'img/minus-2-icon-14-256.png\' id="bottonMinusFavorite_'+n+'" onclick="minusFavorites('+n+')" class=\'bottons\'>');
            if(Data.type==1 || Data.type==5||Data.type==7||Data.type==8||Data.type==0){
                req_out.insertAdjacentHTML('beforeEnd','<img  src=\'img/add-icon-png-2468.png\' id="bottonAddFavorite_'+n+'" onclick="addFavoriteBook('+n+')" class=\'bottons\'><img  src=\'img/add-icon-png-2468.png\' onclick="addWaitBook('+n+')" class=\'bottons\'>');
            }
           req_out.insertAdjacentHTML('beforeEnd',"<br>");
          let avtorMap=item['avtor'];
          let AvtorId,name,rating;
          avtorMap.forEach(function (items, i, avtorMap) {
          //  let ff=req_out.createElement('a').href='list.html?AvtorId='+AvtorId;
          //  ff.textContent=name+"("+rating+")";
            req_out.insertAdjacentHTML('beforeEnd',"<a href='list.html?AvtorId="+items['AvtorId']+"' >"+items['name']+"("+items['rating']+")</a><br>")
           })

           let seqId,seqDesc;
           let seqMap=item.seq;
           seqMap.forEach(function (items, i, seqMap) {
           let seqId=items.seqId;
           let seqDesc=items.seqDesc;
           let seqRating=items.seqRating;
            req_out.insertAdjacentHTML('beforeEnd',"<a href='list.html?SeqId="+seqId+"' >"+seqDesc+"("+seqRating+")</a>")
           })



            req_out.insertAdjacentHTML('beforeEnd',"<br>"+item['description']);
            req_out.insertAdjacentHTML('beforeEnd','</div>');
            document.getElementById("desc_"+n).classList.remove("hide");
            document.getElementById("desc_"+n).classList.toggle("show");
            document.getElementById("name_"+n).classList.toggle("hide");
		})

    }



	})


}

 showDesc (id){
   if(Data.type<5) {setCookieMy('SaveiD',id,USELOCALPATH);setCookieMy('SaveStep',Data.step ,USELOCALPATH);}

    if(document.getElementById("desc_"+id).innerHTML==''){
        this.GetDesc(id);

		

    }else {

        if (document.getElementById("desc_" + id).classList.contains("hide")) {
           


            document.getElementById("desc_"+id).classList.remove("hide")
            document.getElementById("desc_"+id).classList.toggle("show")
            document.getElementById("name_"+id).classList.toggle("hide")

        } else {
            document.getElementById("desc_"+id).classList.remove("show")
            document.getElementById("desc_"+id).classList.toggle("hide")
            document.getElementById("name_"+id).classList.remove("hide")


        }
}
}

 SettingsPanelHide(id) {
    if(document.getElementById(id).classList[1]=='hide'){
        document.getElementById(id).classList.remove("hide")
        document.getElementById(id).classList.toggle("show")

    } else {
        document.getElementById(id).classList.remove("show")
        document.getElementById(id).classList.toggle("hide")
    }
}

}

let UserName = getCookie("user_login");
let UserHash = getCookie("user_hash");

class DataClass {
    constructor() {
        this.step = getCookie("SaveStep");if (this.step === undefined ||isNaN(this.step) ) {this.step = 0; }
        this.type = getCookie("type");if (this.type === undefined||isNaN(this.type)) {this.type = 0; }
        this.rateBook = getCookie("rate");if (this.rateBook === undefined||!this.rateBook) {this.rateBook = false; }
        this.year = getCookie("year");if (this.year === undefined||isNaN(this.year)) {this.year = 0; }
        if (getCookie("SaveiD") === undefined) this.SaveiD=0; else this.SaveiD = getCookie("SaveiD");
        if (getCookie("datas") === undefined) this.datas=0; else this.datas = getCookie("datas");
        this.rateBook = (this.rateBook === "true");
        this.getIdBook();
    }
    getIdBook(){
        let params = new URLSearchParams(document.location.search);
        let IdBook = Number(params.get('IdBook'));
        if(IdBook>0) this.SaveiD=IdBook;
    }

}
const Data = new DataClass
const ViewBook = new ViewBookClass

let selectYear = document.getElementById('year');

for (let i = 0; i < selectYear.options.length; i++) {
  if (selectYear.options[i].value === Data.year) {
      selectYear.selectedIndex = i;
      break;
  }
}


selectYear.addEventListener('change', function() {
    let selectedValue = this.value;
    if (selectedValue) {
        SelectYear(selectedValue);
    }
});
selectRateElem = document.getElementById('rate');
selectRateElem.addEventListener('change', SelectRate);
selectRateElem.checked = Data.rateBook

function SelectYear(value) {
    setCookieMy('year',value);
    setCookieMy('datas',0);Data.datas = 0;
    setCookieMy('SaveiD',0,USELOCALPATH)
    setCookieMy('SaveStep',0,USELOCALPATH)
    Data.year=value;
    SelectReload()
}
function GoSearch() {
    setCookieMy('SaveiD',0,USELOCALPATH)
    setCookieMy('SaveStep',0,USELOCALPATH)
    location.href='list.html?SearchTitle='+document.getElementById("TextSearch").value;
}
function SelectRate() {
    setCookieMy('rate',selectRateElem.checked);
    setCookieMy('datas',0); Data.datas = 0;
    setCookieMy('SaveiD',0,USELOCALPATH)
    setCookieMy('SaveStep',0,USELOCALPATH)
    SelectReload();
    
}
function SelectType(value) {
    setCookieMy('type',value);
    setCookieMy('datas',Data.datas);
    setCookieMy('SaveStep',0,USELOCALPATH)
    setCookieMy('SaveiD',0,USELOCALPATH)
    Data.type=value;
    SelectReload()
}

function SelectReload() { 
    ViewBook.ViewPort.innerHTML = '';
    Data.rateBook =selectRateElem.checked
    ViewBook.BookList();
}



function openBook (id){
setCookieMy('book_id', id); 
location.href='index.html';
}



function setCookieMy(name,data,local =0 ) {
    if(local==0) 
        setCookie(name, data, { expires: new Date(Date.now() + 86400 * 1000 * 30 * 12), path: '/'});
    else
        setCookie(name, data, { expires: new Date(Date.now() + 86400 * 1000 * 30 * 12)});
    }



   
  function minusFavorites(idBook) {
    $.post('https://api.allfilmbook.ru/book/rating/', {
        UserName: UserName, UserHash: UserHash,
        book: idBook,
        tip: 2,
        r: 0}).done(function (data) {
          document.getElementById("Book_"+idBook).classList.toggle("hide");

    })
} 





 function addFavoriteBook(idBook) {
    $.post("https://api.allfilmbook.ru/book/rating/", {UserName: UserName, UserHash: UserHash, book: idBook, tip: 2, r: 1   },
        function(data) {
        document.getElementById("bottonAddFavorite_"+idBook).classList.toggle("hide");
        }
    )
    $.post("https://api.allfilmbook.ru/book/file/", { UserName: UserName, UserHash: UserHash, id: idBook, unzip: 2 },
        function(data) { }
    )
 }

if(Data.type<=5){
    const observer = new IntersectionObserver((entries) => {
    if ((window.scrollY > document.body.scrollHeight - 1500)&& window.scrollY > 5000 ) {
        let dd = document.getElementById('load-more-button')
        Data.step++;            
        setCookieMy('SaveStep',Data.step ,USELOCALPATH);
        ViewBook.BookList();
        observer.observe(dd);
    }
  }, {
    root: null, 
    threshold: 1.0,
  });


  let dd = document.getElementById('load-more-button')
  setTimeout(() => observer.observe(dd), 10000);
}

const TURNON=1; const USELOCALPATH=1;
const TURNOFF=0;