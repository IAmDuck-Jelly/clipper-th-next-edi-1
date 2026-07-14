import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const productTypes = ['wholesale', 'retail', 'giftset'] as const;

export type ProductType = (typeof productTypes)[number];

export type ProductOrderRow = {
    product_id: number | string;
    sort_order: number;
};

type ProductWithId = {
    id: number | string;
};

export function isProductType(value: string | null): value is ProductType {
    return productTypes.includes(value as ProductType);
}

function orderDirectory() {
    return process.env.PRODUCT_ORDER_DIRECTORY
        ? path.resolve(process.env.PRODUCT_ORDER_DIRECTORY)
        : path.join(process.cwd(), 'data', 'product-order');
}

function orderFile(section: ProductType) {
    return path.join(orderDirectory(), `${section}.json`);
}

export async function loadProductOrder(section: ProductType): Promise<ProductOrderRow[]> {
    try {
        const contents = await readFile(orderFile(section), 'utf8');
        const productIds: unknown = JSON.parse(contents);

        if (!Array.isArray(productIds)) {
            throw new Error('Expected an array of product IDs.');
        }

        return productIds
            .filter((productId): productId is number => Number.isInteger(productId) && productId > 0)
            .map((productId, sortOrder) => ({ product_id: productId, sort_order: sortOrder }));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }

        console.error(`Failed to load ${section} product order:`, error);
        return [];
    }
}

export async function writeProductOrder(section: ProductType, productIds: readonly number[]) {
    const directory = orderDirectory();
    const destination = orderFile(section);
    const temporary = `${destination}.${process.pid}.${crypto.randomUUID()}.tmp`;

    await mkdir(directory, { recursive: true });
    await writeFile(temporary, `${JSON.stringify(productIds, null, 2)}\n`, 'utf8');
    await rename(temporary, destination);
}

export function applyProductOrder<T extends ProductWithId>(
    products: readonly T[],
    savedOrder: readonly ProductOrderRow[]
): T[] {
    const ranks = new Map<string, number>();

    for (const row of savedOrder) {
        if (Number.isInteger(row.sort_order) && row.sort_order >= 0) {
            ranks.set(String(row.product_id), row.sort_order);
        }
    }

    return products
        .map((product, sourceIndex) => ({
            product,
            sourceIndex,
            rank: ranks.get(String(product.id)),
        }))
        .sort((a, b) => {
            const aIsSaved = a.rank !== undefined;
            const bIsSaved = b.rank !== undefined;

            if (aIsSaved && bIsSaved) {
                return a.rank! - b.rank! || a.sourceIndex - b.sourceIndex;
            }

            if (aIsSaved) {
                return -1;
            }

            if (bIsSaved) {
                return 1;
            }

            return a.sourceIndex - b.sourceIndex;
        })
        .map(({ product }) => product);
}
