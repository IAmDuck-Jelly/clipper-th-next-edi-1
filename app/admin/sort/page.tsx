'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowLeft, ArrowUp, Check, GripVertical, Save } from 'lucide-react';
import { saveProductOrder } from '../actions';

type Section = 'wholesale' | 'retail' | 'giftset';

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
};

type CatalogueResponse = {
    products?: Product[];
    error?: string;
};

type LoadState = {
    loading: boolean;
    error: string | null;
};

const sections: Array<{ id: Section; label: string }> = [
    { id: 'wholesale', label: 'Wholesale' },
    { id: 'retail', label: 'Retail' },
    { id: 'giftset', label: 'Gift Set' },
];

const emptyProducts: Record<Section, Product[]> = {
    wholesale: [],
    retail: [],
    giftset: [],
};

const initialLoadState: Record<Section, LoadState> = {
    wholesale: { loading: true, error: null },
    retail: { loading: true, error: null },
    giftset: { loading: true, error: null },
};

const initialFlags: Record<Section, boolean> = {
    wholesale: false,
    retail: false,
    giftset: false,
};

const initialMessages: Record<Section, string | null> = {
    wholesale: null,
    retail: null,
    giftset: null,
};

function isProduct(value: unknown): value is Product {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Partial<Product>;
    return Number.isInteger(candidate.id) &&
        typeof candidate.name === 'string' &&
        typeof candidate.image === 'string' &&
        typeof candidate.price === 'string';
}

type SortableProductRowProps = {
    product: Product;
    index: number;
    productCount: number;
    saving: boolean;
    onMove: (index: number, direction: -1 | 1) => void;
};

function SortableProductRow({
    product,
    index,
    productCount,
    saving,
    onMove,
}: SortableProductRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id, disabled: saving });
    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`relative flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm sm:gap-5 sm:p-4 ${
                isDragging
                    ? 'z-10 border-black opacity-60 shadow-lg'
                    : 'border-gray-200'
            }`}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                disabled={saving}
                aria-label={`Drag ${product.name} to reorder`}
                className="shrink-0 touch-none cursor-grab rounded-lg border border-gray-300 p-2 text-gray-500 transition-colors hover:border-black hover:bg-black hover:text-[#FFD600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
            >
                <GripVertical aria-hidden="true" size={20} />
            </button>
            <span className="w-8 shrink-0 text-center text-lg font-black tabular-nums" aria-label={`Rank ${index + 1}`}>
                {index + 1}
            </span>
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20">
                <Image
                    src={product.image}
                    alt=""
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="font-bold leading-snug">{product.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Rank {index + 1}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                <button
                    type="button"
                    onClick={() => onMove(index, -1)}
                    disabled={index === 0 || saving}
                    aria-label={`Move ${product.name} up`}
                    className="rounded-lg border border-gray-300 p-2.5 transition-colors hover:border-black hover:bg-black hover:text-[#FFD600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-black"
                >
                    <ArrowUp aria-hidden="true" size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => onMove(index, 1)}
                    disabled={index === productCount - 1 || saving}
                    aria-label={`Move ${product.name} down`}
                    className="rounded-lg border border-gray-300 p-2.5 transition-colors hover:border-black hover:bg-black hover:text-[#FFD600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-black"
                >
                    <ArrowDown aria-hidden="true" size={20} />
                </button>
            </div>
        </li>
    );
}

export default function ProductSortPage() {
    const [activeSection, setActiveSection] = useState<Section>('wholesale');
    const [productsBySection, setProductsBySection] = useState<Record<Section, Product[]>>(emptyProducts);
    const [loadState, setLoadState] = useState<Record<Section, LoadState>>(initialLoadState);
    const [dirty, setDirty] = useState<Record<Section, boolean>>(initialFlags);
    const [saving, setSaving] = useState<Record<Section, boolean>>(initialFlags);
    const [saveMessages, setSaveMessages] = useState<Record<Section, string | null>>(initialMessages);
    const [saveErrors, setSaveErrors] = useState<Record<Section, string | null>>(initialMessages);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => {
        const controller = new AbortController();

        async function loadSection(section: Section) {
            setLoadState((current) => ({
                ...current,
                [section]: { loading: true, error: null },
            }));

            try {
                const response = await fetch(`/api/products?type=${section}`, {
                    signal: controller.signal,
                    cache: 'no-store',
                });
                const payload: unknown = await response.json();
                const catalogue = payload as CatalogueResponse;

                if (!response.ok) {
                    throw new Error(catalogue.error || `Request failed with status ${response.status}`);
                }
                if (!Array.isArray(catalogue.products) || !catalogue.products.every(isProduct)) {
                    throw new Error('The catalogue returned an invalid product list.');
                }

                setProductsBySection((current) => ({ ...current, [section]: catalogue.products as Product[] }));
                setLoadState((current) => ({
                    ...current,
                    [section]: { loading: false, error: null },
                }));
            } catch (error) {
                if (controller.signal.aborted) return;

                setLoadState((current) => ({
                    ...current,
                    [section]: {
                        loading: false,
                        error: error instanceof Error ? error.message : 'Unable to load products.',
                    },
                }));
            }
        }

        void Promise.all(sections.map(({ id }) => loadSection(id)));
        return () => controller.abort();
    }, []);

    const products = productsBySection[activeSection];
    const currentLoadState = loadState[activeSection];

    function moveProduct(index: number, direction: -1 | 1) {
        const destination = index + direction;
        if (destination < 0 || destination >= products.length) return;

        setProductsBySection((current) => {
            const reordered = [...current[activeSection]];
            [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
            return { ...current, [activeSection]: reordered };
        });
        setDirty((current) => ({ ...current, [activeSection]: true }));
        setSaveMessages((current) => ({ ...current, [activeSection]: null }));
        setSaveErrors((current) => ({ ...current, [activeSection]: null }));
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        if (!over || active.id === over.id) return;

        const section = activeSection;
        const sectionProducts = productsBySection[section];
        const oldIndex = sectionProducts.findIndex(({ id }) => id === active.id);
        const newIndex = sectionProducts.findIndex(({ id }) => id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        setProductsBySection((current) => ({
            ...current,
            [section]: arrayMove(current[section], oldIndex, newIndex),
        }));
        setDirty((current) => ({ ...current, [section]: true }));
        setSaveMessages((current) => ({ ...current, [section]: null }));
        setSaveErrors((current) => ({ ...current, [section]: null }));
    }

    async function handleSave() {
        const section = activeSection;
        const productIds = productsBySection[section].map(({ id }) => id);

        setSaving((current) => ({ ...current, [section]: true }));
        setSaveMessages((current) => ({ ...current, [section]: null }));
        setSaveErrors((current) => ({ ...current, [section]: null }));

        try {
            const result = await saveProductOrder(section, productIds);
            if ('error' in result) {
                setSaveErrors((current) => ({ ...current, [section]: result.error }));
                return;
            }

            setDirty((current) => ({ ...current, [section]: false }));
            setSaveMessages((current) => ({ ...current, [section]: 'Order saved successfully.' }));
        } catch (error) {
            setSaveErrors((current) => ({
                ...current,
                [section]: error instanceof Error ? error.message : 'Unable to save this order.',
            }));
        } finally {
            setSaving((current) => ({ ...current, [section]: false }));
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-[57px] text-black md:pt-[83px]">
            <header className="sticky top-[57px] z-50 bg-black px-4 py-5 text-white shadow-lg sm:px-8 md:top-[83px]">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD600]">Admin</p>
                        <h1 className="text-xl font-black uppercase sm:text-2xl">Product Order</h1>
                    </div>
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg border border-white/30 px-3 py-2 text-sm font-bold transition-colors hover:border-[#FFD600] hover:text-[#FFD600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600]"
                    >
                        <ArrowLeft aria-hidden="true" size={18} />
                        Back to Admin
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <section className="overflow-hidden rounded-2xl bg-white shadow-lg" aria-labelledby="sort-heading">
                    <div className="border-b border-gray-200 p-5 sm:p-7">
                        <h2 id="sort-heading" className="text-xl font-black uppercase">Sort catalogue products</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Move products into storefront order, then save each section separately.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-100" role="tablist" aria-label="Product sections">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                id={`tab-${section.id}`}
                                type="button"
                                role="tab"
                                aria-selected={activeSection === section.id}
                                aria-controls={`panel-${section.id}`}
                                onClick={() => setActiveSection(section.id)}
                                className={`px-2 py-4 text-sm font-black uppercase transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black sm:text-base ${
                                    activeSection === section.id
                                        ? 'bg-[#FFD600] text-black'
                                        : 'text-gray-600 hover:bg-yellow-100 hover:text-black'
                                }`}
                            >
                                {section.label}
                                {dirty[section.id] && <span className="sr-only"> (unsaved changes)</span>}
                                {dirty[section.id] && <span aria-hidden="true" className="ml-1">*</span>}
                            </button>
                        ))}
                    </div>

                    <div
                        id={`panel-${activeSection}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${activeSection}`}
                        className="p-4 sm:p-7"
                    >
                        {currentLoadState.loading && (
                            <div className="py-16 text-center" role="status">
                                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#FFD600]" />
                                <p className="font-bold">Loading {sections.find(({ id }) => id === activeSection)?.label} products…</p>
                            </div>
                        )}

                        {!currentLoadState.loading && currentLoadState.error && (
                            <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
                                <p className="font-black">Products could not be loaded.</p>
                                <p className="mt-1 text-sm">{currentLoadState.error}</p>
                            </div>
                        )}

                        {!currentLoadState.loading && !currentLoadState.error && products.length === 0 && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
                                No products are available in this section.
                            </div>
                        )}

                        {!currentLoadState.loading && !currentLoadState.error && products.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                accessibility={{
                                    screenReaderInstructions: {
                                        draggable: 'To reorder a product, press space to pick it up, use the arrow keys to move it, then press space to drop it. Press escape to cancel.',
                                    },
                                    announcements: {
                                        onDragStart({ active }) {
                                            const product = products.find(({ id }) => id === active.id);
                                            return `Picked up ${product?.name ?? 'product'}.`;
                                        },
                                        onDragOver({ active, over }) {
                                            if (!over) return;
                                            const product = products.find(({ id }) => id === active.id);
                                            const position = products.findIndex(({ id }) => id === over.id) + 1;
                                            return `${product?.name ?? 'Product'} is over position ${position}.`;
                                        },
                                        onDragEnd({ active, over }) {
                                            const product = products.find(({ id }) => id === active.id);
                                            if (!over) return `${product?.name ?? 'Product'} was not moved.`;
                                            const position = products.findIndex(({ id }) => id === over.id) + 1;
                                            return `${product?.name ?? 'Product'} was dropped at position ${position}.`;
                                        },
                                        onDragCancel({ active }) {
                                            const product = products.find(({ id }) => id === active.id);
                                            return `Moving ${product?.name ?? 'product'} was cancelled.`;
                                        },
                                    },
                                }}
                            >
                                <SortableContext
                                    items={products.map(({ id }) => id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ol className="space-y-3" aria-label={`${activeSection} product order`}>
                                        {products.map((product, index) => (
                                            <SortableProductRow
                                                key={product.id}
                                                product={product}
                                                index={index}
                                                productCount={products.length}
                                                saving={saving[activeSection]}
                                                onMove={moveProduct}
                                            />
                                        ))}
                                    </ol>
                                </SortableContext>
                            </DndContext>
                        )}

                        {saveErrors[activeSection] && (
                            <div role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800">
                                Save failed: {saveErrors[activeSection]}
                            </div>
                        )}
                        {saveMessages[activeSection] && (
                            <div role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-4 text-sm font-semibold text-green-800">
                                <Check aria-hidden="true" size={18} /> {saveMessages[activeSection]}
                            </div>
                        )}

                        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center">
                            <p className="text-sm font-semibold text-gray-500" aria-live="polite">
                                {dirty[activeSection] ? 'You have unsaved changes.' : 'No unsaved changes.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => void handleSave()}
                                disabled={currentLoadState.loading || Boolean(currentLoadState.error) || products.length === 0 || !dirty[activeSection] || saving[activeSection]}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-6 py-3 font-black uppercase text-black shadow-sm transition-colors hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
                            >
                                <Save aria-hidden="true" size={19} />
                                {saving[activeSection] ? 'Saving…' : 'Save Order'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
