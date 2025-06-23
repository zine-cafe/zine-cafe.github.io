var navtemplate = document.getElementById("nav-template");

$.get('navbar.html', function(text){
    var nav = document.getElementById("nav");
    nav.outerHTML = text;
});