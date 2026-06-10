export type StaticProduct = {
    id: number;
    name: string;
    image: string;
    price: string;
};

const clipperProducts: Omit<StaticProduct, 'id' | 'price'>[] = [
    {
        name: 'Clipper | Reusable Lighter Mini Tube Gold edition- 24pcs./Box',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/12/Product-Image-1-600x600.png',
    },
    {
        name: 'Clipper Lighter | HighSostore Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/10/UTT-CLIPPER-Highsostore-1-600x600.png',
    },
    {
        name: 'Clipper Lighter | Strainz Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/10/UTT-CLIPPER-strainz-1-600x600.png',
    },
    {
        name: 'Clipper Lighter | UpTown Trading Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/10/UTT-CLIPPER-utt-1-600x600.png',
    },
    {
        name: 'Clipper Lighter | Good Weed Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-13-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Leaves Justice Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-9-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Weed Mandala | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-6-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Weed BROS Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-4-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Rasta Animals V.2 Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-2-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Pop Art Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-11-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Gamer 4 Life Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-5-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Retro Bets Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-3-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Hungry UFO Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-10-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Sweet Summer Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-14-600x600.webp',
    },
    {
        name: 'Clipper | Asian Lift - Lighter Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-1-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Yantra Cloth Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-8-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Bangkok Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-12-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Chiang mai Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/07/utt-clipper-lighter-pattaya-600x600.png',
    },
    {
        name: 'Clipper Lighter | Pattaya Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/utt-clipper-pattaya-600x600.png',
    },
    {
        name: 'Clipper Lighter | Phuket Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/07/clipper-lighter-phuket-1-600x600.png',
    },
    {
        name: 'Clipper | Minitube Flower - Lighter Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/utt-clipper-mini-flower-24-600x600.png',
    },
    {
        name: 'Clipper Lighter | Crystal Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-7-600x600.webp',
    },
    {
        name: 'Clipper Lighter | Mushrooms Collection | 24pcs',
        image: 'https://uptowntrading.co.th/wp-content/uploads/2025/07/clipper-lighter-mushroom-600x600.png',
    },
];

export const staticProducts: StaticProduct[] = clipperProducts.map((product, index) => ({
    ...product,
    id: index + 1,
    price: '-',
}));
