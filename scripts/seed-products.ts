
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars manually
const SUPABASE_URL = 'https://yisvqdlpvftflntwzuhg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc3ZxZGxwdmZ0ZmxudHd6dWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc2NTgsImV4cCI6MjA4NDM3MzY1OH0.PyyPpbzChL7qYgpFpvEM259PRIU9UFVEvPnzoN6ghcI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const products = [
    {
        "name": "Clipper | Reusable Lighter Mini Tube Gold edition- 24pcs./Box",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/12/Product-Image-1-600x600.png"
    },
    {
        "name": "Clipper Lighter | HighSostore Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/10/UTT-CLIPPER-Highsostore-1-600x600.png"
    },
    {
        "name": "Clipper Lighter | Strainz Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/10/UTT-CLIPPER-strainz-1-600x600.png"
    },
    {
        "name": "Clipper Lighter | UpTown Trading Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/10/UTT-CLIPPER-utt-1-600x600.png"
    },
    {
        "name": "Clipper Lighter | Good Weed Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-13-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Leaves Justice Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-9-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Weed Mandala | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-6-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Weed BROS Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-4-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Rasta Animals V.2 Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-2-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Pop Art Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-11-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Gamer 4 Life Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-5-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Retro Bets Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-3-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Hungry UFO Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-10-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Sweet Summer Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-14-600x600.webp"
    },
    {
        "name": "Clipper | Asian Lift – Lighter Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-1-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Yantra Cloth Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-8-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Bangkok Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-12-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Chiang mai Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/07/utt-clipper-lighter-pattaya-600x600.png"
    },
    {
        "name": "Clipper Lighter | Pattaya Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/utt-clipper-pattaya-600x600.png"
    },
    {
        "name": "Clipper Lighter | Phuket Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/07/clipper-lighter-phuket-1-600x600.png"
    },
    {
        "name": "Clipper | Minitube Flower – Lighter Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/utt-clipper-mini-flower-24-600x600.png"
    },
    {
        "name": "Clipper Lighter | Crystal Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/06/Clipper-Lighter-7-600x600.webp"
    },
    {
        "name": "Clipper Lighter | Mushrooms Collection | 24pcs",
        "image": "https://uptowntrading.co.th/wp-content/uploads/2025/07/clipper-lighter-mushroom-600x600.png"
    }
];

async function seed() {
    console.log('Starting WHOLESALE seed process...');

    for (const product of products) {
        try {
            if (!product.image) {
                console.warn(`Skipping ${product.name}: No image URL`);
                continue;
            }

            console.log(`Processing: ${product.name}`);

            // 1. Download Image
            const response = await fetch(product.image);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileExt = product.image.split('.').pop() || 'png';
            const fileName = `seed-ws-${Math.random().toString(36).substring(2)}.${fileExt}`;

            // 2. Upload to Supabase
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, buffer, {
                    contentType: `image/${fileExt}`
                });

            if (uploadError) {
                console.error(`Failed to upload image for ${product.name}:`, uploadError);
                continue;
            }

            const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

            // 3. Insert Product
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    name: product.name,
                    price: '-',
                    category: 'wholesale', // CHANGED TO WHOLESALE
                    image_url: imageUrl
                });

            if (insertError) {
                console.error(`Failed to insert product ${product.name}:`, insertError);
            } else {
                console.log(`Successfully added: ${product.name}`);
            }

        } catch (err) {
            console.error(`Error processing ${product.name}:`, err);
        }
    }

    console.log('Wholesale seed process completed.');
}

seed();
