$(document).ready(() => {
    function keybinds(e) {
        console.log(e.which)
    }
    // T = 84
    // W = 87

    // F5 = 116
    // TAB = 

    $(document.body).on('keydown', e => {
        keybinds(e);
    });
});