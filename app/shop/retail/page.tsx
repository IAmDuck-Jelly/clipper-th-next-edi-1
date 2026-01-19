'use client';

import React, { useEffect, useState } from 'react';
import ProductCatalogue from '../../components/ProductCatalogue';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
};

export default function RetailShopPage() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('category', 'retail')
                .order('sort_order', { ascending: true })
                .order('id', { ascending: false });

            if (data) {
                setProducts(data.map(p => ({
                    id: p.id,
                    name: p.name,
                    image: p.image_url,
                    price: p.price
                })));
            }
            setLoading(false);
        }
        loadProducts();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#FFD600] flex items-center justify-center font-black uppercase text-xl">Loading...</div>;
    }

    return (
        <ProductCatalogue
            type="retail"
            products={products}
            title={`${t('shop.retail')} COLLECTION`}
        />
    );
}
