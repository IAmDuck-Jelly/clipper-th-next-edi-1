'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
};

type ProductCatalogueProps = {
    type: 'wholesale' | 'retail' | 'giftset';
    products: Product[];
    title: string;
};

function cleanCollectionName(name: string) {
    return name
        .replace(/^Clipper\s*(Lighter)?\s*\|\s*/i, '')
        .replace(/^Clipper\s*\|\s*/i, '')
        .replace(/^Clipper\s+/i, '')
        .replace(/^Reusable Lighter\s+/i, '')
        .replace(/^Lighter\s+/i, '')
        .replace(/^Jet Flame\s*[–-]\s*/i, 'Jet Flame - ')
        .replace(/\s*[–-]\s*$/i, '')
        .replace(/\s*[–-]\s*4pcs Gift Set$/i, '')
        .replace(/\s*[–-]\s*[^–-]+$/i, '')
        .replace(/\s*\/\s*\d+$/i, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function getCollectionName(product: Product) {
    if (/\s*[–-]\s*4pcs Gift Set$/i.test(product.name)) {
        return 'Gift Set';
    }

    const cleanedName = cleanCollectionName(product.name);

    if (/^(Bangkok|Phuket|Pattaya|Chiang mai)( Collection)?$/i.test(cleanedName)) {
        return "Thailand's Province";
    }

    if (/collection$/i.test(cleanedName)) {
        return cleanedName;
    }

    if (/^Jet Flame/i.test(cleanedName)) {
        return cleanedName;
    }

    return `${cleanedName} Collection`;
}

function sortProductGroups(groups: Array<{ title: string; products: Product[] }>) {
    return [...groups].sort((a, b) => {
        const aIsMiniTubeGold = a.title.toLowerCase() === 'mini tube gold edition collection';
        const bIsMiniTubeGold = b.title.toLowerCase() === 'mini tube gold edition collection';

        if (aIsMiniTubeGold && !bIsMiniTubeGold) {
            return 1;
        }

        if (!aIsMiniTubeGold && bIsMiniTubeGold) {
            return -1;
        }

        return 0;
    });
}

export default function ProductCatalogue({ type, products, title }: ProductCatalogueProps) {
    const { language } = useLanguage();
    const productGroups = sortProductGroups(products.reduce<Array<{ title: string; products: Product[] }>>((groups, product) => {
        const groupTitle = type === 'retail' ? getCollectionName(product) : title;
        const existingGroup = groups.find((group) => group.title === groupTitle);

        if (existingGroup) {
            existingGroup.products.push(product);
        } else {
            groups.push({ title: groupTitle, products: [product] });
        }

        return groups;
    }, []));

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#FFD600] py-20 px-4 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <Link
                href="/shop"
                className="fixed top-24 left-8 z-50 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black uppercase text-sm shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
                <ArrowLeft size={20} />
                {language === 'th' ? 'ย้อนกลับ' : 'Back'}
            </Link>

            <div className="relative z-10 w-full max-w-7xl text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-4">
                    {title}
                </h2>
                <p className="text-xl font-bold text-black/70">
                    Showing {products.length} exclusive designs
                </p>
            </div>

            <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 pb-20">
                {products.length === 0 && (
                    <div className="col-span-full bg-white border-4 border-black rounded-3xl p-10 text-center shadow-[8px_8px_0_0_#000]">
                        <p className="text-2xl font-black uppercase text-black">
                            {language === 'th' ? 'ยังไม่มีสินค้าในหมวดนี้' : 'No products in this collection yet'}
                        </p>
                    </div>
                )}

                {type !== 'retail' && products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col"
                    >
                        <div className="relative aspect-square border-b-4 border-black bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-black text-black uppercase mb-6 leading-tight">
                                {product.name}
                            </h3>

                            <a
                                href={type === 'wholesale' ? "https://uptowntrading.co.th/brand/clipper" : "https://highsostore.com/brand/clipper/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto w-full bg-black text-white py-3 rounded-xl font-black uppercase text-center hover:bg-[#FFD600] hover:text-black hover:border-black border-2 border-transparent transition-colors"
                            >
                                {language === 'th' ? 'ซื้อ Clipper' : 'Buy Clipper'}
                            </a>
                        </div>
                    </div>
                ))}

                {type === 'retail' && productGroups.map((group) => (
                    <section key={group.title} className="col-span-full">
                        <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black mb-6 text-left">
                            {group.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {group.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col"
                                >
                                    <div className="relative aspect-square border-b-4 border-black bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h4 className="text-xl font-black text-black uppercase mb-6 leading-tight">
                                            {product.name}
                                        </h4>

                                        <a
                                            href="https://highsostore.com/brand/clipper/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto w-full bg-black text-white py-3 rounded-xl font-black uppercase text-center hover:bg-[#FFD600] hover:text-black hover:border-black border-2 border-transparent transition-colors"
                                        >
                                            {language === 'th' ? 'ซื้อ Clipper' : 'Buy Clipper'}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
