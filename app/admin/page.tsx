'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { addProduct, deleteProduct, updateProductOrder } from './actions';
import Image from 'next/image';
import { Trash2, Plus, LogOut, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Product = {
    id: number;
    name: string;
    price: string;
    category: 'wholesale' | 'retail';
    image_url: string;
    sort_order: number;
};

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // Order by sort_order ascending, then id descending
        const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true }).order('id', { ascending: false });
        if (data) setProducts(data);
        setLoading(false);
    };

    const handleDelete = async (id: number, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const result = await deleteProduct(id, imageUrl);
            if (result.error) {
                alert('Error: ' + result.error);
                return;
            }
            await fetchProducts();
        } catch (err) {
            alert('Failed to delete product');
            console.error(err);
        }
    };

    const handleOrderChange = async (id: number, newOrder: string) => {
        const order = parseInt(newOrder);
        if (isNaN(order)) return;

        // Optimistic update
        setProducts(prev => prev.map(p => p.id === id ? { ...p, sort_order: order } : p));

        const result = await updateProductOrder(id, order);
        if (result.error) {
            alert('Failed to update order');
            fetchProducts(); // Revert
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-black text-white py-6 px-8 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-2xl font-black uppercase">Admin Dashboard</h1>
                <button className="flex items-center gap-2 hover:text-gray-300" onClick={() => router.push('/')}>
                    <LogOut size={20} /> Exit
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Add Product Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="bg-black text-white rounded-full p-1" size={24} />
                        Add New Product
                    </h2>
                    <form action={async (formData) => {
                        await addProduct(formData);
                        fetchProducts();
                        (document.getElementById('add-form') as HTMLFormElement).reset();
                    }} id="add-form" className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                            <input name="name" required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Clipper Classic" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select name="category" className="w-full px-4 py-2 border rounded-lg" required>
                                <option value="retail">Retail</option>
                                <option value="wholesale">Wholesale</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                            <input type="file" name="image" accept="image/*" required className="w-full px-4 py-2 border rounded-lg" />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="w-full bg-[#FFD600] text-black font-black uppercase py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-md">
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? <p>Loading...</p> : products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                            <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                                <Image src={product.image_url} alt={product.name} width={150} height={150} className="object-contain" />
                                <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${product.category === 'wholesale' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {product.category}
                                </span>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg mb-4">{product.name}</h3>

                                <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg">
                                    <ArrowUpDown size={16} className="text-gray-400" />
                                    <label className="text-xs font-bold text-gray-500 uppercase">Sort Order:</label>
                                    <input
                                        type="number"
                                        value={product.sort_order}
                                        onChange={(e) => handleOrderChange(product.id, e.target.value)}
                                        className="w-20 px-2 py-1 border rounded text-sm font-mono"
                                    />
                                </div>

                                <button
                                    onClick={() => handleDelete(product.id, product.image_url)}
                                    className="mt-auto w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors font-bold text-sm"
                                >
                                    <Trash2 size={16} /> Delete Product
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
