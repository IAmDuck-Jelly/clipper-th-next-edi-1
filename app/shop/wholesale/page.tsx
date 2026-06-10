'use client';

import React, { useEffect, useState } from 'react';
import ProductCatalogue from '../../components/ProductCatalogue';
import { useLanguage } from '../../context/LanguageContext';
import { staticProducts } from '../../lib/static-products';

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
};

export default function WholesaleShopPage() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await fetch('/api/products?type=wholesale');
                const result = await response.json();

                setProducts(result.products?.length ? result.products : staticProducts);
            } catch (error) {
                console.error('Failed to load wholesale products:', error);
                setProducts(staticProducts);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#FFD600] flex items-center justify-center font-black uppercase text-xl">Loading...</div>;
    }

    return (
        <ProductCatalogue
            type="wholesale"
            products={products}
            title={`${t('shop.wholesale')} COLLECTION`}
        />
    );
}
