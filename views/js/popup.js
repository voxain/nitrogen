function popupCategory(name){
    $('.popup-content').removeClass('active');
    setTimeout(() => {
        $('.popup-content').css('display', 'none');
        $('#content-' + name).css('display', 'block');
        setTimeout(() => $('#content-' + name).addClass('active'), 50);
    }, 500);
}