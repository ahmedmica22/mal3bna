const baseUrl = process.env.STAGING_BASE_URL ?? 'http://127.0.0.1:3000/api/v1';
const response = await fetch(`${baseUrl}/health`);
if (!response.ok) throw new Error(`health failed: ${response.status}`);
const body = await response.json();
if (body.status !== 'ok') throw new Error('health payload is not ok');
console.log(
  JSON.stringify({ smoke: 'pass', endpoint: `${baseUrl}/health`, status: response.status }),
);
