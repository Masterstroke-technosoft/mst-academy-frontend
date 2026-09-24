process.env.npm_package_config_libvips = '8.17.3';
const sharp = require('sharp');
const fs = require('fs');

async function processRibbon() {
    const inputPath = 'C:\\Users\\MST\\.gemini\\antigravity-ide\\brain\\6060345b-b80d-46f3-b4b8-70d0556b4cb9\\.user_uploaded\\media_1789552919193.png';

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;
    const rawBuffer = await image.raw().toBuffer();

    const getPixel = (x, y) => {
        if (x < 0 || x >= width || y < 0 || y >= height) return [0, 0, 0, 0];
        const idx = (y * width + x) * 4;
        return [rawBuffer[idx], rawBuffer[idx + 1], rawBuffer[idx + 2], rawBuffer[idx + 3]];
    };

    const topEdge = new Float32Array(width).fill(-1);
    const bottomEdge = new Float32Array(width).fill(-1);

    for (let x = 0; x < width; x++) {
        // Top outer edge: first pixel where red ribbon begins
        for (let y = 0; y < 140; y++) {
            const [r, g, b] = getPixel(x, y);
            const chroma = r - Math.max(g, b);
            if (chroma > 20 && r > 120) {
                topEdge[x] = y;
                break;
            }
        }

        // Bottom outer edge: finding the ribbon edge, excluding the pink smudge
        for (let y = height - 1; y >= 120; y--) {
            const [r, g, b] = getPixel(x, y);
            const chroma = r - Math.max(g, b);
            const isSmudge = (chroma < 45 || g > 130 || b > 130) && (y > 175);
            if (chroma >= 45 && r > 140 && !isSmudge) {
                bottomEdge[x] = y;
                break;
            }
        }
    }

    // Smooth the edge curves slightly to eliminate sub-pixel staircasing
    const smoothTop = new Float32Array(width).fill(-1);
    const smoothBottom = new Float32Array(width).fill(-1);

    for (let x = 0; x < width; x++) {
        let tSum = 0, tCount = 0;
        let bSum = 0, bCount = 0;
        for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            if (nx >= 0 && nx < width) {
                if (topEdge[nx] !== -1) { tSum += topEdge[nx]; tCount++; }
                if (bottomEdge[nx] !== -1) { bSum += bottomEdge[nx]; bCount++; }
            }
        }
        if (tCount > 0) smoothTop[x] = tSum / tCount;
        if (bCount > 0) smoothBottom[x] = bSum / bCount;
    }

    let minX = 0, maxX = width - 1;
    while (minX < width && (smoothTop[minX] === -1 || smoothBottom[minX] === -1)) minX++;
    while (maxX >= 0 && (smoothTop[maxX] === -1 || smoothBottom[maxX] === -1)) maxX--;

    const outBuffer = Buffer.alloc(width * height * 4);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const [r, g, b] = getPixel(x, y);

            if (x < minX || x > maxX) continue;

            const t = smoothTop[x];
            const bEdge = smoothBottom[x];

            if (t === -1 || bEdge === -1) continue;

            const distAbove = y - t;
            const distBelow = bEdge - y;

            if (distAbove < -1.5 || distBelow < -1.5) continue;

            let alpha = 1.0;
            if (distAbove < 1.5) alpha = Math.min(alpha, (distAbove + 1.5) / 3.0);
            if (distBelow < 1.5) alpha = Math.min(alpha, (distBelow + 1.5) / 3.0);
            if (x - minX < 2) alpha = Math.min(alpha, (x - minX + 1) / 3.0);
            if (maxX - x < 2) alpha = Math.min(alpha, (maxX - x + 1) / 3.0);

            outBuffer[idx] = r;
            outBuffer[idx + 1] = g;
            outBuffer[idx + 2] = b;
            outBuffer[idx + 3] = Math.round(Math.max(0, Math.min(255, alpha * 255)));
        }
    }

    const cropLeft = minX;
    const cropRight = maxX;
    let cropTop = height, cropBottom = 0;
    for (let y = 0; y < height; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (outBuffer[(y * width + x) * 4 + 3] > 10) {
                if (y < cropTop) cropTop = y;
                if (y > cropBottom) cropBottom = y;
            }
        }
    }

    const cropW = cropRight - cropLeft + 1;
    const cropH = cropBottom - cropTop + 1;

    const cropped = Buffer.alloc(cropW * cropH * 4);
    for (let cy = 0; cy < cropH; cy++) {
        for (let cx = 0; cx < cropW; cx++) {
            const sx = cx + cropLeft;
            const sy = cy + cropTop;
            const sIdx = (sy * width + sx) * 4;
            const dIdx = (cy * cropW + cx) * 4;
            cropped[dIdx] = outBuffer[sIdx];
            cropped[dIdx + 1] = outBuffer[sIdx + 1];
            cropped[dIdx + 2] = outBuffer[sIdx + 2];
            cropped[dIdx + 3] = outBuffer[sIdx + 3];
        }
    }

    fs.mkdirSync('public/images', { recursive: true });

    await sharp(cropped, {
        raw: { width: cropW, height: cropH, channels: 4 }
    })
        .resize(cropW * 2, cropH * 2, { kernel: 'lanczos3' })
        .png({ quality: 100 })
        .toFile('public/images/ask-me-anything-exact.png');

    await sharp(cropped, {
        raw: { width: cropW, height: cropH, channels: 4 }
    })
        .resize(cropW * 2, cropH * 2, { kernel: 'lanczos3' })
        .png({ quality: 100 })
        .toFile('public/images/ask-me-anything-ribbon-hd.png');

    console.log('Saved clean ribbon with "Ask Me Anything?" text inside to public/images/ask-me-anything-exact.png and public/images/ask-me-anything-ribbon-hd.png:', { cropW, cropH });
}

processRibbon();

