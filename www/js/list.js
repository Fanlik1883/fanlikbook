class ViewBookClass {
    constructor() {

    }

}

var UserName = getCookie("UserName");
var UserHash = getCookie("UserHash");

class CookiesClass {
    constructor() {
        this.restoreCheckboxState()
        setTimeout(this.start_cookie(),2500)
    }

}


var step = getCookie("step");if (step === undefined) {step = 0; }
var type = getCookie("type");if (type === undefined) {type = 0; }
var rate = getCookie("rate");if (rate === undefined) {rate = false; }
var year = getCookie("year");if (year === undefined) {year = 0; }
var datas = getCookie("datas");if (datas === undefined) {datas = 0; }
rate = (rate === "true");


var selectType = document.getElementById('typeRazdel');

for (let i = 0; i < selectType.options.length; i++) {
  if (selectType.options[i].value === type) {
      selectType.selectedIndex = i;
      break;
  }
}


selectType.addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue) {
        SelectType(selectedValue);
    }
});

var selectYear = document.getElementById('year');

for (let i = 0; i < selectYear.options.length; i++) {
  if (selectYear.options[i].value === year) {
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
selectRate=document.getElementById('rate');
selectRate.addEventListener('change', SelectRate);
selectRate.checked = rate;
function SelectType(value) {
    setCookieMy('type',value);
    location.reload();
}
function SelectYear(value) {
    setCookieMy('year',value);
    location.reload();
}

function SelectRate() {
    setCookieMy('rate',selectRate.checked);
    location.reload();
}
function SelectType(value,datas) {
    setCookieMy('type',value);
    setCookieMy('datas',datas);
    location.reload();
}


     BookList()
            function BookList() {
                let params = new URLSearchParams(document.location.search);
                var req_out = document.getElementById('ViewPort');
                if (rate==true) var rateR=3
                else  var rateR=0
                $.ajaxSetup({timeout: 10000});
                var finds = '';
                $.post('https://allfilmbook.ru/API/book/list/', { UserName: UserName, UserHash: UserHash, type: type, rate: rateR , year: year, step: step, data:datas}).success(function (data) {
            
                    json = JSON.parse(data);
                    if (json.length === 0) {
              } else {
                    json.forEach(function (item, i, json) {
                        let liLast = document.createElement('div');
                        liLast.className = "MovieCardFace";
                        liLast.id = 'Book_'+item['book_id'];
                        liLast.addEventListener('click', function() { showDesc(item['book_id']); });
                      
                        liLast.innerHTML = "<img src='"+item['image']+"' alt='"+item['title']+"' class='MovesPicFace'>";
                        liLast.innerHTML += "<div class='short-infobar' id='name_"+item['book_id']+"'><span class='short-quality'>"+item['title']+"</span></div>";
                        liLast.innerHTML += "<div class='overlay' id='overlay_"+item['book_id']+"'>"+item['rate']+"</div>";
                   
                        liLast.innerHTML += "<div class='desc hide' id='desc_"+item['book_id']+"' ></div?";
                        liLast.innerHTML +='</div>';



                        ViewPort.append(liLast); // вставить liLast в конец <ol>			
                    })
                }
                })
            
            }

function GetDesc(n){
    $.get('https://allfilmbook.ru/API/book/description/', { n: n}).done(function (data) {
		json = JSON.parse(data);
        if (json.length === 0) {
                      //  req_out.innerHTML = "<img src='/img/zero.jpg' style=' width: 100%;' title='' />";
                    } else {
                        
        var req_out = document.getElementById('desc_'+n);
		json.forEach(function (item, i, json) {
            req_out.innerHTML='<img  src=\'img/read.png\' onclick="openBook('+n+')" class=\'bottons\'>';
            if(type==3)  req_out.innerHTML+='<img  src=\'img/minus-2-icon-14-256.png\' id="bottonMinusFavorite_'+n+'" onclick="minusFavorites('+n+')" class=\'bottons\'>';
            if(type==4)  req_out.innerHTML+='<img  src=\'img/minus-2-icon-14-256.png\' id="bottonMinusFavorite_'+n+'" onclick="minusFavorites('+n+')" class=\'bottons\'>';
            if(type==1){
                req_out.innerHTML+='<img  src=\'img/add-icon-png-2468.png\' id="bottonAddFavorite_'+n+'" onclick="addFavoriteBook('+n+')" class=\'bottons\'><img  src=\'img/add-icon-png-2468.png\' onclick="addWaitBook('+n+')" class=\'bottons\'>';
            }
           req_out.innerHTML+="<br>";
          var avtorMap=item['avtor'];
          var AvtorId,name,rating;
          avtorMap.forEach(function (items, i, avtorMap) {
            AvtorId=items['AvtorId'];
            name=items['name'];
            rating=items['rating'];
            req_out.innerHTML+="<a href='avtor.html?id="+AvtorId+"' >"+name+"("+rating+")</a><br>"
           })

           var seqId,seqDesc;
           var seqMap=item['seq'];
           seqMap.forEach(function (items, i, seqMap) {
            seqId=items['seqId'];
            seqDesc=items['seqDesc'];
            req_out.innerHTML+="<a href='seq.html?id="+seqId+"' >"+seqDesc+"</a>"
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

function openBook (id){
setCookieMy('book_id', id); 
location.href='index.html';
}

function showDesc (id){
  
    if(document.getElementById("desc_"+id).innerHTML==''){
        GetDesc(id);

		setCookieMy('SaveiDF',id);

    }else {

        if(document.getElementById("desc_"+id).classList[1]=="hide"){
            setCookieMy('SaveiDF',id);


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

function setCookieMy(name,data) {
    setCookie(name, data, {
        expires: new Date(Date.now() + 86400 * 1000 * 30 * 12),
        path: '/'
    })

    }



   
  function minusFavorites(idBook) {
    $.post('https://allfilmbook.ru/API/book/rating/', {
        UserName: UserName, UserHash: UserHash,
        book: idBook,
        tip: 2,
        r: 0}).done(function (data) {
          document.getElementById("Book_"+idBook).classList.toggle("hide");

    })
} 





 function addFavoriteBook(idBook) {
    $.post("https://allfilmbook.ru/API/book/rating/", {
        UserName: UserName, UserHash: UserHash,
        book: idBook,
        tip: 2,
        r: 1
    },function(data) {
        document.getElementById("bottonAddFavorite_"+n).classList.toggle("hide");
    })
}


    const observer = new IntersectionObserver((entries) => {
    if ((window.scrollY > document.body.scrollHeight - 1500)&& window.scrollY > 5000 ) {
        let dd = document.getElementById('load-more-button')
        step++;
        BookList();
        observer.observe(dd);
    }
  }, {
    root: null, 
    threshold: 1.0,
  });

  
  let dd = document.getElementById('load-more-button')
  setTimeout(observer.observe(dd), 10000);


