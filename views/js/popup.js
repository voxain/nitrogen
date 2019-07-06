function popupCategory(name, clicker){
    $('.sidebar-entry').removeClass('active');
    $(clicker).addClass('active');

    $('.popup-content').removeClass('active');
    setTimeout(() => {
        $('.popup-content').css('display', 'none');
        $('#content-' + name).css('display', 'block');
        setTimeout(() => $('#content-' + name).addClass('active'), 50);
    }, 200);
}

$('#devtools').on('click', () => {
    require('remote').getCurrentWindow().toggleDevTools();
});