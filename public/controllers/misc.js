// UTILITIES
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.formatPhone = function () {
    var re = /\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
    var subst = '$1-$2-$3';
    return this.replace(re, subst);
};

// TODO:
// Paralax
// var jumboHeight = $('.jumbotron').outerHeight();
// function parallax() {
//     var scrolled = $(window).scrollTop();
//     $('.bg').css('height', (jumboHeight - scrolled) + 'px');
// }

// $(window).scroll(function (e) {
//     parallax();
// });

