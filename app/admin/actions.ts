'use server';

import { supabase } from '../lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

function isAuthenticated(cookieStore: ReadonlyRequestCookies) {
    const session = cookieStore.get('admin_session');
    const password = process.env.ADMIN_PASSWORD;
    return session?.value === password;
}

export async function addProduct(formData: FormData) {
    const cookieStore = await cookies();
    if (!isAuthenticated(cookieStore)) {
        return { error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const category = formData.get('category') as 'wholesale' | 'retail';
    const image = formData.get('image') as File;

    if (!name || !category || !image) {
        return { error: 'Missing fields' };
    }

    // Upload Image
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

    if (uploadError) {
        return { error: 'Image upload failed: ' + uploadError.message };
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    // Insert Record
    const { error: dbError } = await supabase
        .from('products')
        .insert({
            name,
            price: '-',
            category,
            image_url: imageUrl,
            // New products go to top (0) or bottom? Let's say top (0) is default. User can reorder.
        });

    if (dbError) {
        return { error: 'Database insert failed: ' + dbError.message };
    }

    revalidatePath('/shop/retail');
    revalidatePath('/shop/wholesale');
    revalidatePath('/admin');
    return { success: true };
}

export async function deleteProduct(id: number, imageUrl: string) {
    console.log('Attempting to delete product:', id);
    const cookieStore = await cookies();
    if (!isAuthenticated(cookieStore)) {
        console.error('Delete failed: Unauthorized');
        return { error: 'Unauthorized' };
    }

    try {
        // Delete Image (Optional cleanup)
        if (imageUrl) {
            const fileName = imageUrl.split('/').pop();
            if (fileName) {
                console.log('Deleting image:', fileName);
                const { error: storageError } = await supabase.storage.from('product-images').remove([fileName]);
                if (storageError) console.error('Image delete error:', storageError);
            }
        }

        const { error, count } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Database delete error:', error);
            return { error: 'Delete failed: ' + error.message };
        }

        console.log('Product deleted successfully');

        revalidatePath('/shop/retail');
        revalidatePath('/shop/wholesale');
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error('Unexpected error in deleteProduct:', e);
        return { error: 'Unexpected server error' };
    }
}

export async function updateProductOrder(id: number, newOrder: number) {
    const cookieStore = await cookies();
    if (!isAuthenticated(cookieStore)) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('products')
        .update({ sort_order: newOrder })
        .eq('id', id);

    if (error) {
        return { error: 'Update failed' };
    }

    revalidatePath('/shop/retail');
    revalidatePath('/shop/wholesale');
    revalidatePath('/admin');
    return { success: true };
}
