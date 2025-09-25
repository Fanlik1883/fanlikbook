class ViewBookClass {
    constructor() {
        this.BookList()

    }
     BookList() {
                let params = new URLSearchParams(document.location.search);
                var req_out = document.getElementById('ViewPort');
                if (Data.rateBook===true) var rateR=3;
                else  var rateR=0;
                if(params.get('AvtorId')){Data.datas=params.get('AvtorId');Data.type=7;}
                if(params.get('SeqId')){Data.datas=params.get('SeqId');Data.type=8;}

                $.ajaxSetup({timeout: 10000});
                var finds = '';// 
                $.post('https://api.allfilmbook.ru/book/list/', {UserName: UserName, UserHash: UserHash,  type: Data.type, rate: rateR , year: Data.year, step: Data.step, data: Data.datas}).success(function (data) {
            
                   var json = JSON.parse(data);
                    if (json.length === 0) {
              } else {
                    json.forEach(function (item, i, json) {
                        let liLast = document.createElement('div');
                        liLast.className = "MovieCardFace";
                        liLast.id = 'Book_'+item['book_id'];
                        liLast.addEventListener('click', function() { ViewBook.showDesc(item['book_id']); });
                      
                        liLast.innerHTML = "<img src='"+item['image']+"' alt='"+item['title']+"' class='MovesPicFace'>";
                        liLast.innerHTML += "<div class='short-infobar' id='name_"+item['book_id']+"'><span class='short-quality'>"+item['title']+"</span></div>";
                        liLast.innerHTML += "<div class='overlay' id='overlay_"+item['book_id']+"'>"+item['rate']+"</div>";
                   
                        liLast.innerHTML += "<div class='desc hide' id='desc_"+item['book_id']+"' ></div?";
                        liLast.innerHTML +='</div>';



                        ViewPort.append(liLast); // вставить liLast в конец <ol>	
	
                    }
                
                )
                    if((Data.SaveiD>0 && Data.type<5)||(Data.SaveiD>0 && Data.type==7)) {
                        if (document.querySelector('#Book_'+Data.SaveiD) !== null) {
                            document.querySelector('#Book_'+Data.SaveiD).scrollIntoView({ behavior: 'smooth' });
                            Data.SaveiD=0;
                        }
                    }	
                }
                })


            }

 GetDesc(n){
    
    $.get('https://api.allfilmbook.ru/book/description/', { n: n}).done(function (data) {
		var json = JSON.parse(data);
        if (json.length === 0) {
                      //  req_out.innerHTML = "<img src='/img/zero.jpg' style=' width: 100%;' title='' />";
                    } else {
                        
        var req_out = document.getElementById('desc_'+n);
		json.forEach(function (item, i, json) {
            req_out.innerHTML='<img  src=\'img/read.png\' onclick="openBook('+n+')" class=\'bottons\'>';
            if(Data.type==3 )  req_out.innerHTML+='<img  src=\'img/minus-2-icon-14-256.png\' id="bottonMinusFavorite_'+n+'" onclick="minusFavorites('+n+')" class=\'bottons\'>';
            if(Data.type==4)  req_out.innerHTML+='<img  src=\'img/minus-2-icon-14-256.png\' id="bottonMinusFavorite_'+n+'" onclick="minusFavorites('+n+')" class=\'bottons\'>';
            if(Data.type==1 || Data.type==5||Data.type==7||Data.type==8){
                req_out.innerHTML+='<img  src=\'img/add-icon-png-2468.png\' id="bottonAddFavorite_'+n+'" onclick="addFavoriteBook('+n+')" class=\'bottons\'><img  src=\'img/add-icon-png-2468.png\' onclick="addWaitBook('+n+')" class=\'bottons\'>';
            }
           req_out.innerHTML+="<br>";
          var avtorMap=item['avtor'];
          var AvtorId,name,rating;
          avtorMap.forEach(function (items, i, avtorMap) {
            AvtorId=items['AvtorId'];
            name=items['name'];
            rating=items['rating'];
            req_out.innerHTML+="<a href='list.html?AvtorId="+AvtorId+"' >"+name+"("+rating+")</a><br>"
           })

           var seqId,seqDesc;
           var seqMap=item.seq;
           seqMap.forEach(function (items, i, seqMap) {
           var seqId=items.seqId;
           var seqDesc=items.seqDesc;
           var seqRating=items.seqRating;
            req_out.innerHTML+="<a href='list.html?SeqId="+seqId+"' >"+seqDesc+"("+seqRating+")</a>"
           })



            req_out.innerHTML +="<br>"+item['description'];
            req_out.innerHTML +='</div>';
            document.getElementById("desc_"+n).classList.remove("hide");
            document.getElementById("desc_"+n).classList.toggle("show");
            document.getElementById("name_"+n).classList.toggle("hide");
		})

    }



	})


}

 showDesc (id){
   if(Data.type<5) {setCookieMy('SaveiD',id,uselocalPath);setCookieMy('SaveStep',Data.step ,uselocalPath);}

    if(document.getElementById("desc_"+id).innerHTML==''){
        this.GetDesc(id);

		

    }else {

        if(document.getElementById("desc_"+id).classList[1]=="hide"){
           


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
}

var UserName = getCookie("UserName");
var UserHash = getCookie("UserHash");

class DataClass {
    constructor() {
        this.step = getCookie("SaveStep");if (this.step === 'undefined' ) {this.step = 0; }
        this.type = getCookie("type");if (this.type === 'undefined') {this.type = 0; }
        this.rateBook = getCookie("rate");if (this.rateBook === 'undefined') {this.rateBook = false; }
        this.year = getCookie("year");if (this.year === 'undefined') {this.year = 0; }
        if (getCookie("SaveiD") === "undefined") this.SaveiD=0; else this.SaveiD = getCookie("SaveiD");
        if (getCookie("datas") === "undefined") this.datas=0; else this.datas = getCookie("datas");
        this.rateBook = (this.rateBook === "true");
        this.getIdBook();
    }
    getIdBook(){
        let params = new URLSearchParams(document.location.search);
        var IdBook = Number(params.get('IdBook'));
        if(IdBook>0) this.SaveiD=IdBook;
    }

}
const Data = new DataClass
const ViewBook = new ViewBookClass

    


var selectTypeRazdel = document.getElementById('typeRazdel');

for (let i = 0; i < selectTypeRazdel.options.length; i++) {
  if (selectTypeRazdel.options[i].value === Data.type) {
      selectTypeRazdel.selectedIndex = i;
      break;
  }
}


selectTypeRazdel.addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue) {
        SelectType(selectedValue);
    }
});

var selectYear = document.getElementById('year');

for (let i = 0; i < selectYear.options.length; i++) {
  if (selectYear.options[i].value === Data.year) {
      selectYear.selectedIndex = i;
      break;
  }
}


selectYear.addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue) {
        SelectYear(selectedValue);
    }
});
selectRateElem=document.getElementById('rate');
selectRateElem.addEventListener('change', SelectRate);
selectRateElem.checked = Data.rateBook;

function SelectYear(value) {
    setCookieMy('year',value);
    setCookieMy('SaveiD',0);
    setCookieMy('SaveStep',0);
    location.reload();
}

function SelectRate() {
    setCookieMy('rate',selectRateElem.checked);
    setCookieMy('SaveiD',0);
    setCookieMy('SaveStep',0);
    location.reload();
}
function SelectType(value) {
    setCookieMy('type',value);
    setCookieMy('datas',Data.datas);
    setCookieMy('SaveStep',0);

    setCookieMy('SaveiD',0);
    location.reload();
}





function openBook (id){
setCookieMy('book_id', id); 
location.href='index.html';
}



function setCookieMy(name,data,local=0) {
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
    $.post("https://api.allfilmbook.ru/book/rating/", {
        UserName: UserName, UserHash: UserHash,
        book: idBook,
        tip: 2,
        r: 1
    },function(data) {
        document.getElementById("bottonAddFavorite_"+idBook).classList.toggle("hide");
    })
}


    const observer = new IntersectionObserver((entries) => {
    if ((window.scrollY > document.body.scrollHeight - 1500)&& window.scrollY > 5000 ) {
        let dd = document.getElementById('load-more-button')
        Data.step++;            
        setCookieMy('SaveStep',Data.step ,uselocalPath);
        ViewBook.BookList();
        observer.observe(dd);
    }
  }, {
    root: null, 
    threshold: 1.0,
  });

  
  let dd = document.getElementById('load-more-button')
  setTimeout(observer.observe(dd), 10000);


var turnOn=1;uselocalPath=1;
var turnOff=0;