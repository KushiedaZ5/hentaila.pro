// =============================================
// database.js — BASE DE DATOS LOCAL
// Este archivo reemplaza a MySQL. Aquí van los 100 (o 1000) animes.
// Ortiz y Gonzalo solo necesitan alimentar este archivo.
// Cada anime tiene: slug, título, sinopsis, géneros, episodios, portada, etc.
// =============================================

const WB = 'https://web.archive.org/web/20240515211022id_/https://www4.hentaila.com';

const DATABASE = [

    // ──────────── ANIME #1 ────────────
    {
        id: 536,
        slug: 'overflow',
        title: 'Overflow',
        synopsis: 'Un chico se baña con sus dos hermanas adoptivas por "accidente" y las cosas se salen de control.',
        type: 'Hentai',
        status: 'Finalizado',
        statusClass: 'status-off',
        cover: WB + '/uploads/portadas/536.jpg',
        background: WB + '/uploads/fondos/536.jpg',
        rating: 9.7,
        votes: 49310,
        ratingPercent: 97,
        genres: ['Ahegao', 'Incesto', 'Tetonas', 'Vanilla'],
        episodeCount: 8,
        episodes: [
            { number: 8, title: 'Overflow Episodio 8', thumb: WB + '/uploads/thumbs/2700.jpg', date: 'March 15, 2020' },
            { number: 7, title: 'Overflow Episodio 7', thumb: WB + '/uploads/thumbs/2600.jpg', date: 'March 8, 2020' },
            { number: 6, title: 'Overflow Episodio 6', thumb: WB + '/uploads/thumbs/2500.jpg', date: 'March 1, 2020' },
            { number: 5, title: 'Overflow Episodio 5', thumb: WB + '/uploads/thumbs/2400.jpg', date: 'February 23, 2020' },
            { number: 4, title: 'Overflow Episodio 4', thumb: WB + '/uploads/thumbs/2300.jpg', date: 'February 16, 2020' },
            { number: 3, title: 'Overflow Episodio 3', thumb: WB + '/uploads/thumbs/2200.jpg', date: 'February 9, 2020' },
            { number: 2, title: 'Overflow Episodio 2', thumb: WB + '/uploads/thumbs/2100.jpg', date: 'February 2, 2020' },
            { number: 1, title: 'Overflow Episodio 1', thumb: WB + '/uploads/thumbs/2000.jpg', date: 'January 6, 2020' }
        ],
        videos: {
            1: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1],["Sendvid","https://sendvid.com/embed/m4bey9zg",0,0]],
            2: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            3: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            4: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            5: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            6: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            7: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            8: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]]
        },
        downloads: [
            { server: "MediaFire", lang: "Sub", quality: "HD", url: "#" },
            { server: "MEGA", lang: "Sub", quality: "HD", url: "#" }
        ]
    },

    // ──────────── ANIME #2 ────────────
    {
        id: 11,
        slug: 'mankitsu-happening',
        title: 'Mankitsu Happening',
        synopsis: 'Keiichi consigue un trabajo en un manga cafe administrado por dos chicas muy atractivas que tienen sentimientos por él.',
        type: 'Hentai',
        status: 'Finalizado',
        statusClass: 'status-off',
        cover: WB + '/uploads/portadas/11.jpg',
        background: WB + '/uploads/fondos/11.jpg',
        rating: 9.8,
        votes: 44131,
        ratingPercent: 98,
        genres: ['Ahegao', 'Harem', 'Tetonas', 'Vanilla'],
        episodeCount: 4,
        episodes: [
            { number: 4, title: 'Mankitsu Happening Episodio 4', thumb: WB + '/uploads/thumbs/100.jpg', date: 'June 15, 2015' },
            { number: 3, title: 'Mankitsu Happening Episodio 3', thumb: WB + '/uploads/thumbs/99.jpg', date: 'March 15, 2015' },
            { number: 2, title: 'Mankitsu Happening Episodio 2', thumb: WB + '/uploads/thumbs/98.jpg', date: 'December 15, 2014' },
            { number: 1, title: 'Mankitsu Happening Episodio 1', thumb: WB + '/uploads/thumbs/97.jpg', date: 'September 15, 2014' }
        ],
        videos: {
            1: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1],["Sendvid","https://sendvid.com/embed/m4bey9zg",0,0]],
            2: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            3: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            4: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]]
        },
        downloads: [
            { server: "MediaFire", lang: "Sub", quality: "HD", url: "#" },
            { server: "MEGA", lang: "Sub", quality: "HD", url: "#" }
        ]
    },

    // ──────────── ANIME #3 ────────────
    {
        id: 507,
        slug: 'oshiete-re-maid',
        title: 'Oshiete Re: Maid',
        synopsis: 'Para lo que tienen el fetiche de las maids.',
        type: 'Hentai',
        status: 'Finalizado',
        statusClass: 'status-off',
        cover: WB + '/uploads/portadas/507.jpg',
        background: WB + '/uploads/fondos/507.jpg',
        rating: 9.9,
        votes: 117,
        ratingPercent: 99.15,
        genres: ['Ahegao', 'Harem', 'Maids', 'Virgenes', 'Yuri', 'Threesome', 'Paizuri'],
        episodeCount: 2,
        episodes: [
            { number: 2, title: 'Oshiete Re: Maid Episodio 2', thumb: WB + '/uploads/thumbs/1177.jpg', date: 'November 20, 2019' },
            { number: 1, title: 'Oshiete Re: Maid Episodio 1', thumb: WB + '/uploads/thumbs/1178.jpg', date: 'November 20, 2019' }
        ],
        videos: {
            1: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1],["VidHide","https://vidhidevip.com/v/qlevo1aogfoo",0,0],["Sendvid","https://sendvid.com/embed/m4bey9zg",0,0],["Streamwish","https://embedwish.com/e/q2b8z2fyhl05",0,0],["Voe","https://voe.sx/e/ztzcfvka1ka9",0,0],["Burst","https://www.burstcloud.co/embed/81fa27e975b25d6a22cf66473a5964d8a5837f8bc3184f15cbaf041bfcb02655/file.mp4",0,0],["MP4Upload","https://www.mp4upload.com/embed-ahw8vkfwnqeb.html",0,1],["MEGA","https://mega.nz/embed#!dxMHXbwR!C4r-3o3FMFYMlEuq6rVP3pihYG9XhKXj06KSjpzBr-I",0,0]],
            2: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1],["Sendvid","https://sendvid.com/embed/m4bey9zg",0,0]]
        },
        downloads: [
            { server: "VidHide", lang: "Sub", quality: "HD", url: "https://vidhidevip.com/f/qlevo1aogfoo" },
            { server: "Streamwish", lang: "Sub", quality: "HD", url: "https://jodwish.com/f/q2b8z2fyhl05" },
            { server: "Fire", lang: "Sub", quality: "HD", url: "https://www.fireload.com/3a8aa6920dbc3b51" },
            { server: "1fichier", lang: "Sub", quality: "HD", url: "https://1fichier.com/?zd021eqdppsotemelue7" },
            { server: "MediaFire", lang: "Sub", quality: "HD", url: "https://www.mediafire.com/file/mbph7nooj9a8upr" },
            { server: "MEGA", lang: "Sub", quality: "HD", url: "https://mega.nz/#!dxMHXbwR!C4r-3o3FMFYMlEuq6rVP3pihYG9XhKXj06KSjpzBr-I" }
        ]
    },

    // ──────────── ANIME #4 ────────────
    {
        id: 198,
        slug: 'itadaki-seieki',
        title: 'Itadaki! Seieki',
        synopsis: 'Una vampiresa que en lugar de beber sangre necesita absorber "energía vital" de los hombres para sobrevivir.',
        type: 'Hentai',
        status: 'Finalizado',
        statusClass: 'status-off',
        cover: WB + '/uploads/portadas/198.jpg',
        background: WB + '/uploads/fondos/198.jpg',
        rating: 9.6,
        votes: 26376,
        ratingPercent: 96,
        genres: ['Ahegao', 'Succubus', 'Tetonas', 'Vanilla'],
        episodeCount: 1,
        episodes: [
            { number: 1, title: 'Itadaki! Seieki Episodio 1', thumb: WB + '/uploads/thumbs/500.jpg', date: 'March 28, 2014' }
        ],
        videos: {
            1: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1],["Sendvid","https://sendvid.com/embed/m4bey9zg",0,0]]
        },
        downloads: [
            { server: "MediaFire", lang: "Sub", quality: "HD", url: "#" },
            { server: "MEGA", lang: "Sub", quality: "HD", url: "#" }
        ]
    },

    // ──────────── ANIME #5 ────────────
    {
        id: 68,
        slug: 'baku-ane-the-animation',
        title: 'Baku Ane The Animation',
        synopsis: 'Un joven vive con sus 4 hermanas mayores. Cada una tiene una personalidad muy diferente y todas compiten por su "atención".',
        type: 'Hentai',
        status: 'Finalizado',
        statusClass: 'status-off',
        cover: WB + '/uploads/portadas/68.jpg',
        background: WB + '/uploads/fondos/68.jpg',
        rating: 9.5,
        votes: 26165,
        ratingPercent: 95,
        genres: ['Ahegao', 'Incesto', 'Paizuri', 'Tetonas'],
        episodeCount: 2,
        episodes: [
            { number: 2, title: 'Baku Ane The Animation Episodio 2', thumb: WB + '/uploads/thumbs/300.jpg', date: 'August 1, 2014' },
            { number: 1, title: 'Baku Ane The Animation Episodio 1', thumb: WB + '/uploads/thumbs/299.jpg', date: 'April 1, 2014' }
        ],
        videos: {
            1: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]],
            2: [["Yupi","https://www.yourupload.com/embed/n87NqIShlGTF",0,1]]
        },
        downloads: [
            { server: "MediaFire", lang: "Sub", quality: "HD", url: "#" }
        ]
    }

    // ──────────── AQUÍ VAN LOS 95 ANIMES RESTANTES ────────────
    // Cada uno sigue EXACTAMENTE la misma estructura de arriba.
    // Ortiz y el Data Tagger solo necesitan copiar el bloque,
    // cambiar los valores, y pegar.
    // ──────────────────────────────────────────────────────────

];

// =============================================
// FUNCIONES DE BÚSQUEDA (el "motor" de la base de datos)
// =============================================

// Buscar anime por slug (para ficha.html?slug=overflow)
function getAnimeBySlug(slug) {
    return DATABASE.find(function(a) { return a.slug === slug; }) || null;
}

// Buscar anime por ID
function getAnimeById(id) {
    return DATABASE.find(function(a) { return a.id === id; }) || null;
}

// Obtener todos los animes (para directorio)
function getAllAnimes() {
    return DATABASE;
}

// Filtrar por género
function getAnimesByGenre(genre) {
    return DATABASE.filter(function(a) {
        return a.genres.indexOf(genre) !== -1;
    });
}

// Buscar por texto (para el buscador del header)
function searchAnimes(query) {
    var q = query.toLowerCase();
    return DATABASE.filter(function(a) {
        return a.title.toLowerCase().indexOf(q) !== -1 ||
               a.synopsis.toLowerCase().indexOf(q) !== -1 ||
               a.genres.some(function(g) { return g.toLowerCase().indexOf(q) !== -1; });
    });
}

// Leer parámetro de la URL (?slug=overflow&ep=1)
function getUrlParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}
