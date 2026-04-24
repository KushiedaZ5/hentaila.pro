// =============================================
// player-data.js — Datos del episodio para el reproductor
// Simula lo que el backend original inyectaba en cada página
// =============================================

const WB = 'https://web.archive.org/web/20240515211022id_/https://www4.hentaila.com';

// Datos del episodio actual (Oshiete Re: Maid - Episodio 1)
const episodeData = {
    anime_id: 507,
    anime_title: 'Oshiete Re: Maid',
    anime_slug: 'oshiete-re-maid',
    episode_number: 1,
    episode_slug: 'oshiete-re-maid-1',
    cover: WB + '/uploads/portadas/507.jpg',
    // Array de servidores de video: [nombre, url_embed, ?, ?]
    videos: [
        ["Yupi", "https://www.yourupload.com/embed/n87NqIShlGTF", 0, 1],
        ["VidHide", "https://vidhidevip.com/v/qlevo1aogfoo", 0, 0],
        ["Sendvid", "https://sendvid.com/embed/m4bey9zg", 0, 0],
        ["Streamwish", "https://embedwish.com/e/q2b8z2fyhl05", 0, 0],
        ["Voe", "https://voe.sx/e/ztzcfvka1ka9", 0, 0],
        ["Burst", "https://www.burstcloud.co/embed/81fa27e975b25d6a22cf66473a5964d8a5837f8bc3184f15cbaf041bfcb02655/file.mp4", 0, 0],
        ["MP4Upload", "https://www.mp4upload.com/embed-ahw8vkfwnqeb.html", 0, 1],
        ["MEGA", "https://mega.nz/embed#!dxMHXbwR!C4r-3o3FMFYMlEuq6rVP3pihYG9XhKXj06KSjpzBr-I", 0, 0]
    ],
    // Enlaces de descarga
    downloads: [
        { server: "VidHide", lang: "Sub", quality: "HD", url: "https://vidhidevip.com/f/qlevo1aogfoo" },
        { server: "Streamwish", lang: "Sub", quality: "HD", url: "https://jodwish.com/f/q2b8z2fyhl05" },
        { server: "Fire", lang: "Sub", quality: "HD", url: "https://www.fireload.com/3a8aa6920dbc3b51" },
        { server: "1fichier", lang: "Sub", quality: "HD", url: "https://1fichier.com/?zd021eqdppsotemelue7" },
        { server: "MediaFire", lang: "Sub", quality: "HD", url: "https://www.mediafire.com/file/mbph7nooj9a8upr" },
        { server: "MEGA", lang: "Sub", quality: "HD", url: "https://mega.nz/#!dxMHXbwR!C4r-3o3FMFYMlEuq6rVP3pihYG9XhKXj06KSjpzBr-I" }
    ],
    // Navegación de episodios
    prev_episode: null,
    next_episode: { slug: 'oshiete-re-maid-2', number: 2 },
    episodes_url: 'hentai-oshiete-re-maid.html'
};

// Hentais similares (sidebar)
const similarHentais = [
    { title: 'Kyonyuu Elf Oyako Saimin', thumb: WB + '/uploads/portadas/861.jpg', slug: 'kyonyuu-elf-oyako-saimin' },
    { title: 'Jashin Shoukan: Inran Kyonyuu Oyako Ikenie Gishiki', thumb: WB + '/uploads/portadas/844.jpg', slug: 'jashin-shoukan' },
    { title: 'Isekai Harem Monogatari', thumb: WB + '/uploads/portadas/667.jpg', slug: 'isekai-harem-monogatari' },
    { title: 'Muttsuri Do Sukebe Tsuyu Gibo Shimai no Honshitsu', thumb: WB + '/uploads/portadas/269.jpg', slug: 'muttsuri-do-sukebe' },
    { title: 'Baku Ane Otouto Shibocchau zo! The Animation', thumb: WB + '/uploads/portadas/190.jpg', slug: 'baku-ane-otouto' },
    { title: 'Baku Ane The Animation', thumb: WB + '/uploads/portadas/68.jpg', slug: 'baku-ane-the-animation' },
    { title: 'Sweet Home H na Oneesan wa Suki Desu ka?', thumb: WB + '/uploads/portadas/25.jpg', slug: 'sweet-home' },
    { title: 'Eroge! H mo Game mo Kaihatsu Zanmai', thumb: WB + '/uploads/portadas/23.jpg', slug: 'eroge-h-mo-game' },
    { title: 'Mankitsu Happening', thumb: WB + '/uploads/portadas/11.jpg', slug: 'mankitsu-happening' }
];
