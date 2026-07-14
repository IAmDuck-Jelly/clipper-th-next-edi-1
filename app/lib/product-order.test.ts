import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { applyProductOrder, loadProductOrder, writeProductOrder } from './product-order';

test('saved ranks lead while unsaved products retain source order', () => {
    const products = [
        { id: 10, name: 'First' },
        { id: 20, name: 'Second' },
        { id: 30, name: 'Third' },
        { id: 40, name: 'Fourth' },
    ];

    const ordered = applyProductOrder(products, [
        { product_id: 30, sort_order: 0 },
        { product_id: 10, sort_order: 1 },
    ]);

    assert.deepEqual(ordered.map(({ id }) => id), [30, 10, 20, 40]);
    assert.deepEqual(products.map(({ id }) => id), [10, 20, 30, 40]);
});

test('equal ranks are stable and invalid ranks are ignored', () => {
    const products = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    const ordered = applyProductOrder(products, [
        { product_id: 2, sort_order: 4 },
        { product_id: 1, sort_order: 4 },
        { product_id: 3, sort_order: -1 },
        { product_id: 4, sort_order: 1.5 },
    ]);

    assert.deepEqual(ordered.map(({ id }) => id), [1, 2, 3, 4]);
});

test('orders persist as section-specific local JSON', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'clipper-product-order-'));
    const previousDirectory = process.env.PRODUCT_ORDER_DIRECTORY;
    process.env.PRODUCT_ORDER_DIRECTORY = directory;

    try {
        await writeProductOrder('retail', [30, 10, 20]);

        assert.deepEqual(await loadProductOrder('retail'), [
            { product_id: 30, sort_order: 0 },
            { product_id: 10, sort_order: 1 },
            { product_id: 20, sort_order: 2 },
        ]);
        assert.deepEqual(
            JSON.parse(await readFile(path.join(directory, 'retail.json'), 'utf8')),
            [30, 10, 20],
        );
        assert.deepEqual(await loadProductOrder('wholesale'), []);
    } finally {
        if (previousDirectory === undefined) {
            delete process.env.PRODUCT_ORDER_DIRECTORY;
        } else {
            process.env.PRODUCT_ORDER_DIRECTORY = previousDirectory;
        }
        await rm(directory, { recursive: true, force: true });
    }
});
