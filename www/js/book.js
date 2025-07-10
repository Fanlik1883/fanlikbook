document.addEventListener('deviceready', function() {
    handleOpenURL = function(url) {
        const idRegex = /id=(\d+)/; 
        const match = url.match(idRegex);
        Book.book_id=match[1];
        location.href='index.html'
     };
});