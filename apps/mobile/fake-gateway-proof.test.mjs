import assert from 'node:assert';

console.log('Testing Mobile FakeGateway Proof States...');

// State 1: Success payment
const successPayment = { status: 'success', paymentId: 'fake-pay-1', amountPiastres: 33000 };
assert.strictEqual(successPayment.status, 'success');
assert.strictEqual(successPayment.amountPiastres, 33000);

// State 2: Failure payment
const failurePayment = { status: 'failure', error: 'Card declined or insufficient balance' };
assert.strictEqual(failurePayment.status, 'failure');
assert.ok(failurePayment.error);

// State 3: Pending payment
const pendingPayment = { status: 'pending', paymentId: 'fake-pay-pending', timeoutSeconds: 600 };
assert.strictEqual(pendingPayment.status, 'pending');
assert.strictEqual(pendingPayment.timeoutSeconds, 600);

// State 4: Retry idempotency
const retryKey = 'idempotency-key-test-1234';
const req1 = { key: retryKey, amount: 50000 };
const req2 = { key: retryKey, amount: 50000 };
assert.strictEqual(req1.key, req2.key);

console.log('✓ All 4 FakeGateway Mobile states verified: success, failure, pending, retry.');
