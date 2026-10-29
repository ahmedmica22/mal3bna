import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, pixelShader) {
  // Format: RGBA
  // Raw scanline: 1 byte filter (0 = none) + width * 4 bytes
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelShader(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Precomputed CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Brand Icon Shader
function brandIconShader(x, y, width, height, opts = {}) {
  const { isSplash = false, isAdaptive = false } = opts;

  // Normalized coords [0, 1]
  const u = x / width;
  const v = y / height;

  if (isSplash) {
    // Large background with icon in center
    const cx = 0.5;
    const cy = 0.45;
    const scale = 0.32; // Icon takes 32% of splash
    const relX = (u - cx) / scale + 0.5;
    const relY = (v - cy) / scale + 0.5;

    // Ambient stadium lighting gradient
    const distToCenter = Math.hypot(u - cx, v - cy);
    const glow = Math.max(0, 1 - distToCenter / 0.55);
    const bgR = Math.round(11 + 18 * glow * glow);
    const bgG = Math.round(23 + 36 * glow * glow);
    const bgB = Math.round(21 + 25 * glow * glow);
    const baseBg = [bgR, bgG, bgB, 255];

    if (relX >= 0 && relX <= 1 && relY >= 0 && relY <= 1) {
      const px = renderIconPixel(relX, relY);
      if (px[3] > 0) {
        const alpha = px[3] / 255;
        const r = Math.round(px[0] * alpha + baseBg[0] * (1 - alpha));
        const g = Math.round(px[1] * alpha + baseBg[1] * (1 - alpha));
        const b = Math.round(px[2] * alpha + baseBg[2] * (1 - alpha));
        return [r, g, b, 255];
      }
    }

    return baseBg;
  }

  if (isAdaptive) {
    // Safe zone padding for Android adaptive icon
    const scale = 0.72;
    const relX = (u - 0.5) / scale + 0.5;
    const relY = (v - 0.5) / scale + 0.5;
    if (relX >= 0 && relX <= 1 && relY >= 0 && relY <= 1) {
      return renderIconPixel(relX, relY);
    }
    return [0, 0, 0, 0]; // Transparent padding
  }

  return renderIconPixel(u, v);
}

function renderIconPixel(u, v) {
  // Rounded shield radius
  const rx = 0.22;
  const shieldDist = roundedRectDist(u - 0.5, v - 0.5, 0.46, 0.46, rx);

  if (shieldDist > 0.005) {
    return [0, 0, 0, 0]; // Outside rounded shield
  }

  // Border of shield: stroke gradient lime-emerald
  if (shieldDist >= -0.02) {
    const t = (u + v) * 0.5;
    const r = Math.round(190 * (1 - t) + 16 * t);
    const g = Math.round(242 * (1 - t) + 185 * t);
    const b = Math.round(100 * (1 - t) + 129 * t);
    return [r, g, b, 255];
  }

  // Inside shield: deep stadium green gradient
  const bgT = Math.sqrt((u - 0.1) ** 2 + (v - 0.1) ** 2) / 1.2;
  let r = Math.round(14 * (1 - bgT) + 4 * bgT);
  let g = Math.round(42 * (1 - bgT) + 15 * bgT);
  let b = Math.round(34 * (1 - bgT) + 12 * bgT);

  // Pitch outer line: width 0.34, height 0.30 around center (0.5, 0.5)
  const pitchDist = Math.abs(roundedRectDist(u - 0.5, v - 0.5, 0.34, 0.30, 0.07));
  if (pitchDist < 0.012) {
    return [163, 230, 53, 235]; // Lime #a3e635
  }

  // Halfway line: x = 0.5, between y 0.20 and 0.80
  if (Math.abs(u - 0.5) < 0.01 && v >= 0.20 && v <= 0.80) {
    return [163, 230, 53, 210];
  }

  // Center circle: radius 0.14
  const cDist = Math.hypot(u - 0.5, v - 0.5);
  if (Math.abs(cDist - 0.14) < 0.011) {
    return [163, 230, 53, 230];
  }

  // Goal boxes
  // Left box: x from 0.16 to 0.28, y from 0.34 to 0.66
  if (
    (u >= 0.16 && u <= 0.28 && (Math.abs(v - 0.34) < 0.009 || Math.abs(v - 0.66) < 0.009)) ||
    (Math.abs(u - 0.28) < 0.009 && v >= 0.34 && v <= 0.66)
  ) {
    return [74, 222, 128, 190]; // #4ade80
  }
  // Right box: x from 0.72 to 0.84, y from 0.34 to 0.66
  if (
    (u >= 0.72 && u <= 0.84 && (Math.abs(v - 0.34) < 0.009 || Math.abs(v - 0.66) < 0.009)) ||
    (Math.abs(u - 0.72) < 0.009 && v >= 0.34 && v <= 0.66)
  ) {
    return [74, 222, 128, 190]; // #4ade80
  }

  // Kinetic Ball at center: radius 0.075
  if (cDist <= 0.075) {
    // Radial glow
    const ballT = cDist / 0.075;
    const br = Math.round(250 * (1 - ballT) + 163 * ballT);
    const bg = Math.round(204 * (1 - ballT) + 230 * ballT);
    const bb = Math.round(21 * (1 - ballT) + 53 * ballT);

    // Ball highlight
    const hlDist = Math.hypot(u - 0.48, v - 0.48);
    if (hlDist < 0.022) {
      return [255, 255, 255, 245];
    }
    return [br, bg, bb, 255];
  }

  // Ball glow ring
  if (cDist <= 0.10) {
    const alpha = Math.round(180 * (1 - (cDist - 0.075) / 0.025));
    return [163, 230, 53, alpha];
  }

  return [r, g, b, 255];
}

function roundedRectDist(dx, dy, hw, hh, r) {
  const qx = Math.abs(dx) - hw + r;
  const qy = Math.abs(dy) - hh + r;
  const outX = Math.max(qx, 0);
  const outY = Math.max(qy, 0);
  const outDist = Math.hypot(outX, outY);
  const inDist = Math.min(Math.max(qx, qy), 0);
  return outDist + inDist - r;
}

// Generate assets
const mobileAssetsDir = path.resolve('apps/mobile/assets');
const webPublicDir = path.resolve('apps/web/public');

fs.mkdirSync(mobileAssetsDir, { recursive: true });
fs.mkdirSync(webPublicDir, { recursive: true });

console.log('Generating mobile icon.png (512x512)...');
const iconPng = createPng(512, 512, (x, y, w, h) => brandIconShader(x, y, w, h));
fs.writeFileSync(path.join(mobileAssetsDir, 'icon.png'), iconPng);

console.log('Generating mobile adaptive-icon.png (512x512)...');
const adaptivePng = createPng(512, 512, (x, y, w, h) =>
  brandIconShader(x, y, w, h, { isAdaptive: true }),
);
fs.writeFileSync(path.join(mobileAssetsDir, 'adaptive-icon.png'), adaptivePng);

console.log('Generating mobile splash.png (1024x1024)...');
const splashPng = createPng(1024, 1024, (x, y, w, h) =>
  brandIconShader(x, y, w, h, { isSplash: true }),
);
fs.writeFileSync(path.join(mobileAssetsDir, 'splash.png'), splashPng);

console.log('Generating web apple-touch-icon.png (192x192)...');
const webIconPng = createPng(192, 192, (x, y, w, h) => brandIconShader(x, y, w, h));
fs.writeFileSync(path.join(webPublicDir, 'apple-touch-icon.png'), webIconPng);

console.log('All brand assets successfully generated!');
