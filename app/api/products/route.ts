import { NextRequest, NextResponse } from 'next/server';
import { staticProducts } from '../../lib/static-products';

type ProductType = 'wholesale' | 'retail' | 'giftset';

type WooProduct = {
    id: number;
    name: string;
    images?: Array<{ src?: string }>;
    prices?: {
        price?: string;
        currency_prefix?: string;
        currency_suffix?: string;
    };
};

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
};

const storeUrls: Record<ProductType, string> = {
    wholesale: 'https://uptowntrading.co.th',
    retail: 'https://highsostore.com',
    giftset: 'https://highsostore.com',
};

const wholesaleProductsMovedToEnd = [
    'Clipper | Reusable Lighter Mini Tube Gold Edition - 24pcs./Box',
    'Clipper | Reusable Lighter Mini Tube Gold Gradient Edition - 24pcs./Box',
];

function isProductType(value: string | null): value is ProductType {
    return value === 'wholesale' || value === 'retail' || value === 'giftset';
}

function formatPrice(product: WooProduct) {
    const price = product.prices?.price;

    if (!price) {
        return '-';
    }

    const amount = Number(price) / 100;
    const prefix = product.prices?.currency_prefix ?? '';
    const suffix = product.prices?.currency_suffix ?? '';

    return `${prefix}${amount.toLocaleString('en-US', {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })}${suffix}`;
}

function decodeHtmlEntities(value: string) {
    return value
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function normalizeProductName(value: string) {
    return value
        .replace(/[–—]/g, '-')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function mapProduct(product: WooProduct): Product {
    return {
        id: product.id,
        name: decodeHtmlEntities(product.name),
        image: product.images?.[0]?.src ?? '',
        price: formatPrice(product),
    };
}

function sortProducts(type: ProductType, products: Product[]) {
    if (type !== 'wholesale') {
        return products;
    }

    const movedNames = new Map(
        wholesaleProductsMovedToEnd.map((name, index) => [normalizeProductName(name), index])
    );

    return [...products].sort((a, b) => {
        const aIndex = movedNames.get(normalizeProductName(a.name));
        const bIndex = movedNames.get(normalizeProductName(b.name));
        const aMoved = aIndex !== undefined;
        const bMoved = bIndex !== undefined;

        if (aMoved && bMoved) {
            return aIndex - bIndex;
        }

        if (aMoved) {
            return 1;
        }

        if (bMoved) {
            return -1;
        }

        return 0;
    });
}

function isClipperProduct(product: WooProduct) {
    return product.name.trim().toLowerCase().startsWith('clipper');
}

function isGiftSetProduct(product: Product) {
    return /\s*[–-]\s*4pcs Gift Set$/i.test(product.name);
}

async function fetchWooProducts(type: ProductType) {
    const url = new URL('/wp-json/wc/store/v1/products', storeUrls[type]);
    url.searchParams.set('search', 'Clipper');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('orderby', 'menu_order');
    url.searchParams.set('order', 'asc');

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
        next: {
            revalidate: 60 * 30,
        },
    });

    if (!response.ok) {
        throw new Error(`WooCommerce responded with ${response.status}`);
    }

    const products = (await response.json()) as WooProduct[];

    const mappedProducts = products
        .filter(isClipperProduct)
        .map(mapProduct)
        .filter((product) => product.name && product.image);

    const filteredProducts = type === 'giftset'
        ? mappedProducts.filter(isGiftSetProduct)
        : type === 'retail'
            ? mappedProducts.filter((product) => !isGiftSetProduct(product))
            : mappedProducts;

    return sortProducts(type, filteredProducts);
}

export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');

    if (!isProductType(type)) {
        return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    try {
        const products = await fetchWooProducts(type);

        return NextResponse.json({
            products: products.length > 0 ? products : staticProducts,
            source: products.length > 0 ? 'woocommerce' : 'static',
        });
    } catch (error) {
        console.error(`Failed to load ${type} WooCommerce products:`, error);

        return NextResponse.json({
            products: staticProducts,
            source: 'static',
        });
    }
}
