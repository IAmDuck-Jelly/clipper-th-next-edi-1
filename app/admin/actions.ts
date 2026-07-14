'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { isProductType, writeProductOrder } from '../lib/product-order';

function isAuthenticated(cookieStore: ReadonlyRequestCookies) {
    const session = cookieStore.get('admin_session');
    const password = process.env.ADMIN_PASSWORD;
    return Boolean(password) && session?.value === password;
}

type SaveProductOrderResult =
    | { success: true }
    | { success: false; error: string };

export async function saveProductOrder(
    section: string,
    productIds: number[],
): Promise<SaveProductOrderResult> {
    const cookieStore = await cookies();
    if (!isAuthenticated(cookieStore)) {
        return { success: false, error: 'Unauthorized' };
    }

    if (!isProductType(section)) {
        return { success: false, error: 'Invalid product section.' };
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
        return { success: false, error: 'At least one product is required.' };
    }
    if (!productIds.every((id) => Number.isInteger(id) && id > 0)) {
        return { success: false, error: 'Product IDs must be positive integers.' };
    }
    if (new Set(productIds).size !== productIds.length) {
        return { success: false, error: 'The product order contains duplicate IDs.' };
    }

    try {
        await writeProductOrder(section, productIds);

        revalidatePath('/api/products');
        revalidatePath(`/shop/${section}`);
        revalidatePath('/admin');
        revalidatePath('/admin/sort');

        return { success: true };
    } catch (error) {
        console.error('Unexpected error in saveProductOrder:', error);
        return {
            success: false,
            error: error instanceof Error
                ? `Unable to save product order: ${error.message}`
                : 'Unexpected server error while saving product order.',
        };
    }
}
