// =============================================
// app.js — Lógica del clon HentaiLa
// Slider (Slick), buscador, modo oscuro/claro
// =============================================

$(function () {
    // ——— SLIDER PRINCIPAL ———
    if ($('.home-slider .slider').length) {
        $('.home-slider .slider').slick({
            dots: true,
            arrows: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 600,
            fade: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
        });
    }

    // ——— MENÚ HAMBURGUESA (móvil) ———
    $('#menu-btn').on('click', function () {
        $(this).toggleClass('on');
        $('#hd').toggleClass('on');
    });

    // ——— MODO OSCURO / CLARO ———
    var savedMode = localStorage.getItem('hla-mode');
    if (savedMode === 'light') {
        $('body').addClass('w');
        $('.btn-mode').addClass('on');
    }
    $('.btn-mode').on('click', function () {
        $(this).toggleClass('on');
        $('body').toggleClass('w');
        localStorage.setItem('hla-mode', $('body').hasClass('w') ? 'light' : 'dark');
    });

    // ——— BUSCADOR CON AUTOCOMPLETADO LOCAL ———
    var $searchInput = $('#search-anime');
    var $searchBox = $('#search-box');
    var $searchResults = $('#search-results');

    // Construir la lista de búsqueda a partir de todos los datos disponibles
    var searchableItems = [];
    // del slider
    sliderData.forEach(function (item) {
        searchableItems.push({
            title: item.title,
            slug: item.slug,
            thumb: item.bg.replace('/fondos/', '/portadas/'),
            genres: item.genres
        });
    });
    // de la lista de hentais (sin duplicados)
    hentaisData.forEach(function (item) {
        if (!searchableItems.find(function (s) { return s.slug === item.slug; })) {
            searchableItems.push({
                title: item.title,
                slug: item.slug,
                thumb: item.thumb,
                genres: []
            });
        }
    });

    $searchInput.on('input', function () {
        var query = $(this).val().trim().toLowerCase();
        if (query.length < 2) {
            $searchResults.html('<li>Escribe al menos 2 caracteres...</li>');
            $searchBox.removeClass('on');
            return;
        }

        var matches = searchableItems.filter(function (item) {
            return item.title.toLowerCase().includes(query);
        }).slice(0, 8);

        if (matches.length === 0) {
            $searchResults.html('<li>No se encontraron resultados</li>');
        } else {
            var html = matches.map(function (item) {
                return '<li><a href="ficha.html?slug=' + item.slug + '">' +
                    '<figure><img src="' + item.thumb + '" alt="' + item.title + '"></figure>' +
                    '<span>' + item.title + '</span>' +
                    '</a></li>';
            }).join('');
            $searchResults.html(html);
        }
        $searchBox.addClass('on');
    });

    // Cerrar buscador al hacer clic fuera
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#search-box').length) {
            $searchBox.removeClass('on');
        }
    });
    $searchInput.on('focus', function () {
        if ($(this).val().trim().length >= 2) {
            $searchBox.addClass('on');
        }
    });
});
