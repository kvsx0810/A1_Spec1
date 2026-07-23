let canvasW = window.innerWidth;
let canvasH = window.innerHeight;

const paperColors = [
  [73, 91, 125],
  [200, 217, 230],
  [245, 239, 235],
  [255, 255, 255],
];

const tapeColors = [
  [150, 150, 154],
  [35, 50, 80],
  [95, 120, 165],
  [150, 170, 200],
];

const minTapes = 2;
const maxTapes = 4;

const textColorPairs = [
  { paper: [200, 217, 230], text: [36, 52, 77] },
  { paper: [255, 255, 255], text: [31, 41, 53] },
  { paper: [245, 239, 235], text: [19, 53, 79] },
  { paper: [73, 91, 125], text: [249, 249, 249] },
];

const tapeTextureFiles = [
  '/A1_Spec1/Assets/Texture/TapeTexture.png',
];
const tapeTextureOpacityMin = 0.15;
const tapeTextureOpacityMax = 0.3;
let tapeTextureImages = [];

const textureFiles = [
  '/A1_Spec1/Assets/Texture/Texture1.png',
  '/A1_Spec1/Assets/Texture/Texture2.png',
  '/A1_Spec1/Assets/Texture/Texture3.png',
  '/A1_Spec1/Assets/Texture/Texture4.png',
];
const textureOpacityMin = 0.15;
const textureOpacityMax = 0.25;
let textureImages = [];

const backgroundImageFile = '/A1_Spec1/Assets/Background2.jpg';
let backgroundImage = null;

const assetPool = [
  { src: '/A1_Spec1/Assets/16.png', needsPaper: false, paperColor: null, sizeF: null },
  { src: '/A1_Spec1/Assets/16.1.png', needsPaper: false, paperColor: null, sizeF: null },
  { src: '/A1_Spec1/Assets/19.png', needsPaper: false, paperColor: null, sizeF: null },
  { src: '/A1_Spec1/Assets/19.1.png', needsPaper: false, paperColor: null, sizeF: null },
  { src: '/A1_Spec1/Assets/36.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/36.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/37.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/37.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/38.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/38.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/39.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/39.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/40.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/41.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/41.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/42.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/42.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/43.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
  { src: '/A1_Spec1/Assets/43.1.png', needsPaper: false, paperColor: null, sizeF: 0.15 },
];

function buildAssetGroups(pool) {
  let map = new Map();
  for (let i = 0; i < pool.length; i++) {
    let entry = pool[i];
    let m = entry.src.match(/(\d+)(\.1)?\.png$/i);
    let baseKey = m ? m[1] : entry.src;
    let isVariant = m ? !!m[2] : false;
    if (!map.has(baseKey)) map.set(baseKey, { base: null, variant: null });
    let g = map.get(baseKey);
    if (isVariant) g.variant = entry; else g.base = entry;
  }
  return [...map.values()];
}
const assetGroups = buildAssetGroups(assetPool);

const numAssetsMin = 10;
const numAssetsMax = 14;
const assetSizeMinF = 0.16;
const assetSizeMaxF = 0.28;
const assetAngleMin = -12;
const assetAngleMax = 12;
const assetTextMarginPx = 24;

let assetImages = {};

function preload() {
  for (let i = 0; i < textureFiles.length; i++) {
    textureImages.push(loadImage(textureFiles[i]));
  }
  for (let i = 0; i < tapeTextureFiles.length; i++) {
    tapeTextureImages.push(loadImage(tapeTextureFiles[i]));
  }
  if (backgroundImageFile) {
    backgroundImage = loadImage(backgroundImageFile);
  }
  for (let i = 0; i < assetPool.length; i++) {
    let a = assetPool[i];
    assetImages[a.src] = loadImage(a.src);
  }
}

const edgeRoughnessRatio = 0.045;

const jagPointSpacing = 7;

const gridSpacingMin = 0.09;
const gridSpacingMax = 0.16;
const linesSpacingMin = 0.06;
const linesSpacingMax = 0.11;
const tapeJag = 3;

const fontPreloadList = [
  { family: 'Lumiare', weight: 400 },
];

const windowLightAngleMin = -180;
const windowLightAngleMax = 180;
const windowLightStripeWidthMinF = 0.1;
const windowLightStripeWidthMaxF = 0.2;
const windowLightGapMinF = 0.1;
const windowLightGapMaxF = 0.2;
const windowLightOpacityMin = 0.1;
const windowLightOpacityMax = 0.3;
const windowLightBlurMinF = 0.012;
const windowLightBlurMaxF = 0.015;

let windowLightBuffer = null;
let windowLightOpacity = 0;

function buildWindowLightBuffer() {
  if (!windowLightBuffer || windowLightBuffer.width !== canvasW || windowLightBuffer.height !== canvasH) {
    windowLightBuffer = createGraphics(canvasW, canvasH);
  }
  let g = windowLightBuffer;
  g.clear();
  g.noStroke();
  g.fill(0);

  let minSide = min(canvasW, canvasH);
  let diag = sqrt(canvasW * canvasW + canvasH * canvasH);
  let angleDeg = random(windowLightAngleMin, windowLightAngleMax);

  g.push();
  g.translate(canvasW / 2, canvasH / 2);
  g.rotate(radians(angleDeg));

  let yCursor = -diag;
  while (yCursor < diag) {
    let gap = random(windowLightGapMinF, windowLightGapMaxF) * minSide;
    yCursor += gap;
    let stripeW = random(windowLightStripeWidthMinF, windowLightStripeWidthMaxF) * minSide;
    g.rect(-diag, yCursor, diag * 2, stripeW);
    yCursor += stripeW;
  }
  g.pop();

  let blurPx = random(windowLightBlurMinF, windowLightBlurMaxF) * minSide;
  g.filter(BLUR, blurPx);

  windowLightOpacity = random(windowLightOpacityMin, windowLightOpacityMax);
}

const whiteEdgeColor = [250, 250, 246];
const whiteEdgeWidthFactor = 0.5;
const whiteEdgeSkipThreshold = 40;

function isNearWhiteColor(col) {
  let d = dist(col[0], col[1], col[2], whiteEdgeColor[0], whiteEdgeColor[1], whiteEdgeColor[2]);
  return d < whiteEdgeSkipThreshold;
}

const patternTypes = ['none', 'none', 'none', 'lines', 'grid'];

function getPatternColor(col) {
  let lum = 0.299 * col[0] + 0.587 * col[1] + 0.114 * col[2];
  let delta = 40;
  if (lum > 150) {
    return [max(col[0] - delta, 0), max(col[1] - delta, 0), max(col[2] - delta, 0)];
  } else {
    return [min(col[0] + delta, 255), min(col[1] + delta, 255), min(col[2] + delta, 255)];
  }
}

function biasedRandomSize(minVal, maxVal, skewPow) {
  let t = pow(random(), skewPow);
  return lerp(minVal, maxVal, t);
}

function centerBiasedPositioning(terms) {
  let sum = 0;
  for (let i = 0; i < terms; i++) sum += random();
  return sum / terms;
}

function rotatedWrapSize(w, h, angleDeg) {
  let rad = radians(angleDeg);
  return {
    halfW: (abs(w * cos(rad)) + abs(h * sin(rad))) / 2,
    halfH: (abs(w * sin(rad)) + abs(h * cos(rad))) / 2,
  };
}

function rectsOverlap(cx1, cy1, halfW1, halfH1, cx2, cy2, halfW2, halfH2, marginPx) {
  return !(
    cx1 + halfW1 + marginPx < cx2 - halfW2 ||
    cx1 - halfW1 - marginPx > cx2 + halfW2 ||
    cy1 + halfH1 + marginPx < cy2 - halfH2 ||
    cy1 - halfH1 - marginPx > cy2 + halfH2
  );
}

function findAllowedArea(w, h, angleDeg, avoidRects, marginPx, maxAttempts) {
  let wrap = rotatedWrapSize(w, h, angleDeg);
  let halfW = wrap.halfW, halfH = wrap.halfH;

  let minCx = halfW, maxCx = canvasW - halfW;
  let minCy = halfH, maxCy = canvasH - halfH;

  function randomPos() {
    let cx = (minCx <= maxCx) ? random(minCx, maxCx) : canvasW / 2;
    let cy = (minCy <= maxCy) ? random(minCy, maxCy) : canvasH / 2;
    return { cx, cy };
  }

  if (!avoidRects || avoidRects.length === 0) {
    return randomPos();
  }

  const gridSize = 6;
  let margin = marginPx ?? 0;

  let cells = [];
  for (let gx = 0; gx < gridSize; gx++) {
    for (let gy = 0; gy < gridSize; gy++) {
      cells.push({ gx, gy });
    }
  }
  shuffleArray(cells);

  function cellToPos(cell) {
    let cellW = (maxCx > minCx) ? (maxCx - minCx) / gridSize : 0;
    let cellH = (maxCy > minCy) ? (maxCy - minCy) / gridSize : 0;
    let baseCx = minCx + cellW * (cell.gx + 0.5);
    let baseCy = minCy + cellH * (cell.gy + 0.5);
    let cx = (maxCx > minCx) ? baseCx + random(-cellW * 0.4, cellW * 0.4) : canvasW / 2;
    let cy = (maxCy > minCy) ? baseCy + random(-cellH * 0.4, cellH * 0.4) : canvasH / 2;
    return { cx, cy };
  }

  let bestCandidate = null;
  let bestClearance = -Infinity;

  for (let i = 0; i < cells.length; i++) {
    let candidate = cellToPos(cells[i]);
    let hitsAny = false;
    for (let j = 0; j < avoidRects.length; j++) {
      let r = avoidRects[j];
      if (rectsOverlap(candidate.cx, candidate.cy, halfW, halfH, r.cx, r.cy, r.halfW, r.halfH, margin)) {
        hitsAny = true;
        break;
      }
    }
    if (!hitsAny) return candidate;

    let minGap = Infinity;
    for (let j = 0; j < avoidRects.length; j++) {
      let r = avoidRects[j];
      let dx = Math.abs(candidate.cx - r.cx) - (halfW + r.halfW) - margin;
      let dy = Math.abs(candidate.cy - r.cy) - (halfH + r.halfH) - margin;
      let gap = Math.max(dx, dy);
      if (gap < minGap) minGap = gap;
    }
    if (minGap > bestClearance) {
      bestClearance = minGap;
      bestCandidate = candidate;
    }
  }

  return bestCandidate ?? randomPos();
}

let papers = [];
let assetInstances = [];
let textInstances = [];
let tapes = [];

function measureWrappedText(text, font, fontWeight, fontSize, maxWidth, lineHeight, letterSpacingPx) {
  drawingContext.font = `${fontWeight} ${fontSize}px ${font}`;
  drawingContext.letterSpacing = `${letterSpacingPx || 0}px`;

  let words = text.split(' ');
  let lines = [];
  let line = '';
  let widest = 0;
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let test = line ? line + ' ' + word : word;
    if (drawingContext.measureText(test).width > maxWidth && line) {
      widest = max(widest, drawingContext.measureText(line).width);
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    widest = max(widest, drawingContext.measureText(line).width);
    lines.push(line);
  }

  let sampleMetrics = drawingContext.measureText(lines[0] || 'Mg');
  let trueLineHeight = (sampleMetrics.fontBoundingBoxAscent !== undefined && sampleMetrics.fontBoundingBoxDescent !== undefined)
    ? sampleMetrics.fontBoundingBoxAscent + sampleMetrics.fontBoundingBoxDescent
    : fontSize * 1.2;

  let blockHeight = lines.length <= 1
    ? trueLineHeight
    : trueLineHeight + (lines.length - 1) * fontSize * lineHeight;

  return {
    lines,
    blockWidth: widest,
    blockHeight,
  };
}

function setup() {
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('canvas-holder');
  noStroke();
  randomSeed(Date.now());
  noiseSeed(Date.now());
  noLoop();

  let fontLoadPromises = fontPreloadList.map(f =>
    document.fonts.load(`${f.weight} 100px "${f.family}"`).catch(() => {})
  );

  Promise.all(fontLoadPromises)
    .then(() => document.fonts.ready)
    .then(() => {
      generateComposition();
      redraw();
    });
}

function windowResized() {
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  resizeCanvas(canvasW, canvasH);
  buildWindowLightBuffer();
  generateComposition();
  redraw();
}

function generateComposition() {
  papers = [];
  assetInstances = [];
  textInstances = [];
  tapes = [];

  let minSide = min(canvasW, canvasH);

  let colorPool = [...paperColors];
  shuffleArray(colorPool);
  function nextPaperColor() {
    if (colorPool.length === 0) {
      colorPool = [...paperColors];
      shuffleArray(colorPool);
    }
    return colorPool.pop();
  }

  let tapeColorPool = [...tapeColors];
  shuffleArray(tapeColorPool);
  function nextTapeColor() {
    if (tapeColorPool.length === 0) {
      tapeColorPool = [...tapeColors];
      shuffleArray(tapeColorPool);
    }
    return tapeColorPool.pop();
  }

  let colorPairPool = [...textColorPairs];
  shuffleArray(colorPairPool);
  function nextColorPair() {
    if (colorPairPool.length === 0) {
      colorPairPool = [...textColorPairs];
      shuffleArray(colorPairPool);
    }
    return colorPairPool.pop();
  }

  const baseLayer = [
    { cxF: 0.30, cyF: 0.32, wF: 0.48, hF: 0.52, col: null, pattern: null, angle: random(-10, -6), patternSpacing: null },
    { cxF: 0.70, cyF: 0.30, wF: 0.48, hF: 0.52, col: null, pattern: null, angle: random(4, 8), patternSpacing: null },
    { cxF: 0.29, cyF: 0.68, wF: 0.48, hF: 0.52, col: null, pattern: 'grid', angle: random(3, 7), patternSpacing: 0.07 },
    { cxF: 0.71, cyF: 0.70, wF: 0.48, hF: 0.52, col: null, pattern: null, angle: random(-12, -8), patternSpacing: null },
  ];

  let base = baseLayer.map(s => ({
    cx: s.cxF * canvasW,
    cy: s.cyF * canvasH,
    w: s.wF * canvasW,
    h: s.hF * canvasH,
    col: s.col,
    pattern: s.pattern,
    angle: s.angle,
    patternSpacing: s.patternSpacing,
  }));
  base.sort((a, b) => (b.w * b.h) - (a.w * a.h));
  for (let i = 0; i < base.length; i++) {
    let s = base[i];
    let angleDeg = (s.angle !== null && s.angle !== undefined) ? s.angle : random(-12, 12);
    let col = s.col || nextPaperColor();
    let spacingF = (s.patternSpacing !== null && s.patternSpacing !== undefined) ? s.patternSpacing : undefined;
    papers.push(createTornPaperData(s.cx - s.w / 2, s.cy - s.h / 2, s.w, s.h, col, angleDeg, s.pattern ?? undefined, spacingF));
  }

  const textLayer = [
    {
      text: "SDG 14: LIFE BELOW WATER",
      cxF: 0.2, cyF: 0.15,
      wrapWidthF: 0.31,
      angle: random(-2, 6),
      font: "Lumiare",
      fontWeight: 400,
      fontSizeF: 0.05,
      textColor: null,
      paperColor: null,
      padEm: 1.0,
      lineHeight: 0.7,
      letterSpacingPx: -1,
      align: 'left',
      pattern: null,
    },
    {
      text: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development",
      cxF: 0.6, cyF: 0.22,
      wrapWidthF: 0.68,
      angle: random(-2, -6),
      font: "Lumiare",
      fontWeight: 400,
      fontSizeF: 0.025,
      textColor: null,
      paperColor: null,
      padEm: 1.2,
      lineHeight: 1.3,
      letterSpacingPx: -1,
      align: 'left',
      pattern: null,
    },
    {
      text: "“There is no such thing as 'away'. When we throw anything away it must go somewhere.”",
      cxF: 0.4, cyF: 0.45,
      wrapWidthF: 0.68,
      angle: random(0, 3),
      font: "Lumiare",
      fontWeight: 400,
      fontSizeF: 0.03,
      textColor: null,
      paperColor: null,
      padEm: 1.1,
      lineHeight: 1,
      letterSpacingPx: -1,
      align: 'left',
      pattern: null,
    },
    {
      text: "- Annie Leonard",
      cxF: 0.76, cyF: 0.55,
      wrapWidthF: 0.68,
      angle: random(-6, 1),
      font: "Lumiare",
      fontWeight: 400,
      fontSizeF: 0.034,
      textColor: null,
      paperColor: null,
      padEm: 1.0,
      lineHeight: 0.7,
      letterSpacingPx: -1,
      align: 'left',
      pattern: null,
    },
    {
      text: "Annie Leonard's quote, “There is no such thing as 'away.' When we throw anything away it must go somewhere,” reminds us that waste we discard on land often ends up in the ocean, harming marine life and ecosystems, which is the exact concern at the heart of SDG 14: Life Below Water. Achieving this goal means recognizing that our trash doesn't disappear; it becomes someone else's or the ocean's problem. Pick up litter before it reaches the ocean, and start taking responsibility for where it truly goes.",
      cxF: 0.25, cyF: 0.75,
      wrapWidthF: 0.38,
      angle: random(-6, 6),
      font: "Lumiare",
      fontWeight: 400,
      fontSizeF: 0.018,
      textColor: null,
      paperColor: null,
      padEm: 2.0,
      lineHeight: 1.3,
      letterSpacingPx: -0.3,
      align: 'left',
      pattern: null,
    },
    {
      text: "Pick up litter before it reaches the ocean!",
      cxF: 0.75, cyF: 0.75,
      wrapWidthF: 0.38,
      angle: random(-6, 6),
      font: "Lumiare",
      fontWeight: 400,
      fontSizeF: 0.035,
      textColor: null,
      paperColor: null,
      padEm: 2.0,
      lineHeight: 0.5,
      letterSpacingPx: -0.3,
      align: 'left',
      pattern: null,
    },
  ];

  let textLayouts = textLayer.map(t => {
    let fontSize = t.fontSizeF * minSide;
    let maxWrapWidth = t.wrapWidthF * canvasW;
    let padPx = (t.padEm ?? 1.0) * fontSize;
    let lineHeight = t.lineHeight ?? 1.3;

    let measured = measureWrappedText(t.text, t.font, t.fontWeight, fontSize, maxWrapWidth, lineHeight, t.letterSpacingPx);
    let w = measured.blockWidth + padPx * 2;
    let h = measured.blockHeight + padPx * 2;

    let cx = t.cxF * canvasW;
    let cy = t.cyF * canvasH;
    let angleDeg = (t.angle !== null && t.angle !== undefined) ? t.angle : random(-8, 8);

    let wrap = rotatedWrapSize(w, h, angleDeg);

    return { t, fontSize, maxWrapWidth, padPx, lineHeight, w, h, cx, cy, angleDeg, halfW: wrap.halfW, halfH: wrap.halfH };
  });

  let textAvoidRects = textLayouts.map(l => ({ cx: l.cx, cy: l.cy, halfW: l.halfW, halfH: l.halfH }));

  let numMedium = floor(random(4, 6));
  let mediumAccents = [];
  for (let i = 0; i < numMedium; i++) {
    mediumAccents.push({ size: biasedRandomSize(minSide * 0.30, minSide * 0.50, 1.2) });
  }
  mediumAccents.sort((a, b) => b.size - a.size);
  for (let i = 0; i < mediumAccents.length; i++) {
    let a = mediumAccents[i];
    let cx = lerp(0, canvasW, centerBiasedPositioning(2));
    let cy = lerp(0, canvasH, centerBiasedPositioning(2));
    let w = a.size * random(0.85, 1.2);
    let h = a.size * random(0.65, 1.05);
    let angleDeg = random(-14, 14);
    papers.push(createTornPaperData(cx - w / 2, cy - h / 2, w, h, nextPaperColor(), angleDeg));
  }

  let numSmall = floor(random(0, 1));
  let smallAccents = [];
  for (let i = 0; i < numSmall; i++) {
    smallAccents.push({ size: biasedRandomSize(minSide * 0.05, minSide * 0.12, 1.3) });
  }
  smallAccents.sort((a, b) => b.size - a.size);
  for (let i = 0; i < smallAccents.length; i++) {
    let a = smallAccents[i];
    let cx = lerp(0, canvasW, centerBiasedPositioning(3));
    let cy = lerp(0, canvasH, centerBiasedPositioning(3));
    let w = a.size * random(0.85, 1.2);
    let h = a.size * random(0.65, 1.05);
    let angleDeg = random(-18, 18);
    papers.push(createTornPaperData(cx - w / 2, cy - h / 2, w, h, nextPaperColor(), angleDeg));
  }

  let blockedArea = [...textAvoidRects];

  {
    let groups = [...assetGroups];
    shuffleArray(groups);
    let numAssets = min(floor(random(numAssetsMin, numAssetsMax + 1)), groups.length);

    let variantDeck = [];
    function nextIsVariant() {
      if (variantDeck.length === 0) {
        variantDeck = [true, false];
        shuffleArray(variantDeck);
      }
      return variantDeck.pop();
    }

    for (let i = 0; i < numAssets; i++) {
      let group = groups[i];
      let entry;
      if (group.base && group.variant) {
        entry = nextIsVariant() ? group.variant : group.base;
      } else {
        entry = group.base || group.variant;
      }
      let img = assetImages[entry.src];
      if (!img) continue;

      let targetSize = (entry.sizeF !== null && entry.sizeF !== undefined)
        ? entry.sizeF * minSide
        : random(assetSizeMinF, assetSizeMaxF) * minSide;
      let aspect = img.width / img.height;
      let w, h;
      if (aspect >= 1) { w = targetSize; h = targetSize / aspect; }
      else { h = targetSize; w = targetSize * aspect; }

      let angleDeg = random(assetAngleMin, assetAngleMax);

      let padPaper = 1.12;
      let footprintW = entry.needsPaper ? w * padPaper : w;
      let footprintH = entry.needsPaper ? h * padPaper : h;

      let pos = findAllowedArea(footprintW, footprintH, angleDeg, blockedArea, assetTextMarginPx);

      let fpWrap = rotatedWrapSize(footprintW, footprintH, angleDeg);
      blockedArea.push({ cx: pos.cx, cy: pos.cy, halfW: fpWrap.halfW, halfH: fpWrap.halfH });

      let paperShape = null;
      if (entry.needsPaper) {
        let col = entry.paperColor || nextPaperColor();
        paperShape = createTornPaperData(pos.cx - footprintW / 2, pos.cy - footprintH / 2, footprintW, footprintH, col, angleDeg);
      }

      assetInstances.push({ img, cx: pos.cx, cy: pos.cy, w, h, angleDeg, paperShape });
    }
  }

  for (let i = 0; i < textLayer.length; i++) {
    let t = textLayer[i];
    let fontSize = t.fontSizeF * minSide;
    let maxWrapWidth = t.wrapWidthF * canvasW;
    let padPx = (t.padEm ?? 1.0) * fontSize;
    let lineHeight = t.lineHeight ?? 1.3;

    let measured = measureWrappedText(t.text, t.font, t.fontWeight, fontSize, maxWrapWidth, lineHeight, t.letterSpacingPx);
    let w = measured.blockWidth + padPx * 2;
    let h = measured.blockHeight + padPx * 2;

    let cx = t.cxF * canvasW;
    let cy = t.cyF * canvasH;
    let angleDeg = (t.angle !== null && t.angle !== undefined) ? t.angle : random(-8, 8);

    let col, textColor;
    if (!t.paperColor && !t.textColor) {
      let pair = nextColorPair();
      col = pair.paper;
      textColor = pair.text;
    } else {
      col = t.paperColor || nextPaperColor();
      textColor = t.textColor || [31, 41, 53];
    }

    textInstances.push(createTornPaperData(
      cx - w / 2, cy - h / 2, w, h, col, angleDeg,
      t.pattern ?? undefined, undefined,
      {
        text: t.text,
        font: t.font,
        fontWeight: t.fontWeight,
        fontSize,
        textColor: textColor,
        padPx,
        lineHeight,
        letterSpacingPx: t.letterSpacingPx || 0,
        align: t.align,
        wrapWidth: maxWrapWidth,
      },
      'full'
    ));
  }

  const tapeAvoidMarginPx = 10;
  let tapeBlockedArea = [...blockedArea];

  let numTapes = floor(random(minTapes, maxTapes + 1));
  for (let i = 0; i < numTapes; i++) {
    let w = random(canvasW * 0.06, canvasW * 0.13);
    let h = random(canvasH * 0.05, canvasH * 0.055);
    let angleDeg = random(-40, 40);
    let col = nextTapeColor();
    let alpha = random(0.7, 0.9);

    let pos = findAllowedArea(w, h, angleDeg, tapeBlockedArea, tapeAvoidMarginPx);
    let x = pos.cx - w / 2;
    let y = pos.cy - h / 2;

    let tapeWrap = rotatedWrapSize(w, h, angleDeg);
    tapeBlockedArea.push({ cx: pos.cx, cy: pos.cy, halfW: tapeWrap.halfW, halfH: tapeWrap.halfH });

    let tapeSteps = 5;
    let rightJagOffsets = [];
    let leftJagOffsets = [];
    for (let j = 0; j < tapeSteps; j++) {
      rightJagOffsets.push(random(-tapeJag, tapeJag));
      leftJagOffsets.push(random(-tapeJag, tapeJag));
    }

    let texture = tapeTextureImages.length > 0 ? random(tapeTextureImages) : null;
    let textureOpacity = random(tapeTextureOpacityMin, tapeTextureOpacityMax);

    tapes.push({ x, y, w, h, angleDeg, col, alpha, rightJagOffsets, leftJagOffsets, texture, textureOpacity });
  }

  buildWindowLightBuffer();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function draw() {
  if (backgroundImage) {
    let imgRatio = backgroundImage.width / backgroundImage.height;
    let canvasRatio = canvasW / canvasH;
    let drawW, drawH;
    if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
    }
    image(backgroundImage, (canvasW - drawW) / 2, (canvasH - drawH) / 2, drawW, drawH);
  } else {
    background(224, 218, 206);
  }

  for (let i = 0; i < papers.length; i++) {
    drawPaperPiece(papers[i]);
  }

  for (let i = 0; i < textInstances.length; i++) {
    drawPaperPiece(textInstances[i]);
  }

  for (let i = 0; i < assetInstances.length; i++) {
    drawAssetInstance(assetInstances[i]);
  }

  for (let i = 0; i < tapes.length; i++) {
    drawTape(tapes[i]);
  }

  if (windowLightBuffer) {
    push();
    blendMode(MULTIPLY);
    tint(255, 255, 255, windowLightOpacity * 255);
    image(windowLightBuffer, 0, 0, canvasW, canvasH);
    pop();
    blendMode(BLEND);
  }
}

function drawAssetInstance(a) {
  if (a.paperShape) {
    drawPaperPiece(a.paperShape);
  }

  push();
  translate(a.cx, a.cy);
  rotate(radians(a.angleDeg));

  let shadowScale = min(a.w, a.h);
  drawingContext.save();
  drawingContext.shadowColor = 'rgba(40, 40, 60, 0.30)';
  drawingContext.shadowBlur = shadowScale * 0.05;
  drawingContext.shadowOffsetX = shadowScale * 0.015;
  drawingContext.shadowOffsetY = shadowScale * 0.025;

  imageMode(CENTER);
  image(a.img, 0, 0, a.w, a.h);

  drawingContext.restore();
  imageMode(CORNER);
  pop();
}

const shapeModes = ['full', 'full', 'parallel', 'corner'];

function createTornPaperData(x, y, w, h, col, angleDeg, forcedPatternType, forcedSpacingF, textBlockDef, forcedShapeMode) {
  let cx = x + w / 2, cy = y + h / 2;
  let seedOffset = random(1000);
  let mode = forcedShapeMode || random(shapeModes);

  let corners, tornEdge;

  if (mode === 'corner') {
    let rect = [
      { x: x,     y: y     },
      { x: x + w, y: y     },
      { x: x + w, y: y + h },
      { x: x,     y: y + h },
    ];
    let cutCornerIdx = floor(random(4));
    let prev = rect[(cutCornerIdx + 3) % 4];
    let next = rect[(cutCornerIdx + 1) % 4];
    let cut = rect[cutCornerIdx];
    let tA = random(0.4, 0.7);
    let tB = random(0.4, 0.7);
    let pA = { x: lerp(cut.x, prev.x, tA), y: lerp(cut.y, prev.y, tA) };
    let pB = { x: lerp(cut.x, next.x, tB), y: lerp(cut.y, next.y, tB) };
    let other1 = rect[(cutCornerIdx + 2) % 4];
    corners = [pA, pB, next, other1, prev];
    tornEdge = [true, false, false, false, false];
  } else if (mode === 'parallel') {
    let corners0 = [
      { x: x,     y: y     },
      { x: x + w, y: y     },
      { x: x + w, y: y + h },
      { x: x,     y: y + h },
    ];
    let axis = random(['horizontal', 'vertical']);
    let subtype = random(['parallelogram', 'trapezoid']);

    if (axis === 'horizontal') {
      tornEdge = [false, true, false, true];
      if (subtype === 'parallelogram') {
        let skew = random(-w * 0.15, w * 0.15);
        corners0[0].x += skew;
        corners0[1].x += skew;
      } else {
        let insetL = random(-w * 0.12, w * 0.22);
        let insetR = random(-w * 0.12, w * 0.22);
        corners0[0].x += insetL;
        corners0[1].x -= insetR;
      }
    } else {
      tornEdge = [true, false, true, false];
      if (subtype === 'parallelogram') {
        let skew = random(-h * 0.15, h * 0.15);
        corners0[1].y += skew;
        corners0[2].y += skew;
      } else {
        let insetT = random(-h * 0.12, h * 0.22);
        let insetB = random(-h * 0.12, h * 0.22);
        corners0[1].y += insetT;
        corners0[2].y -= insetB;
      }
    }
    corners = corners0;
  } else {
    corners = [
      { x: x,     y: y     },
      { x: x + w, y: y     },
      { x: x + w, y: y + h },
      { x: x,     y: y + h },
    ];
    for (let i = 0; i < corners.length; i++) {
      corners[i].x += random(-w * 0.03, w * 0.03);
      corners[i].y += random(-h * 0.03, h * 0.03);
    }
    tornEdge = [true, true, true, true];
  }

  let roughness = min(w, h) * edgeRoughnessRatio;

  let hasWhiteEdge = !isNearWhiteColor(col);
  let whiteBaseWidth = roughness * whiteEdgeWidthFactor;

  let pts = [];
  let isTornPt = [];
  let whiteEdgePts = [];
  for (let i = 0; i < corners.length; i++) {
    let a = corners[i];
    let b = corners[(i + 1) % corners.length];
    let isTorn = tornEdge[i];

    let dx = b.x - a.x, dy = b.y - a.y;
    let edgeLen = sqrt(dx * dx + dy * dy) || 1;
    let nx = -dy / edgeLen, ny = dx / edgeLen;

    let segs = isTorn ? max(6, round(edgeLen / jagPointSpacing)) : 1;

    for (let s = 0; s < segs; s++) {
      let t = s / segs;
      let px = lerp(a.x, b.x, t);
      let py = lerp(a.y, b.y, t);

      if (isTorn) {
        let coarse = (noise(i * 8 + t * 6 + seedOffset, 100) - 0.5) * roughness * 1.8;
        let fine = (noise(i * 8 + t * 16 + seedOffset, 400) - 0.5) * roughness * 1.0;
        let jag = coarse + fine;
        px += nx * jag;
        py += ny * jag;
      }

      pts.push({ x: px, y: py });
      isTornPt.push(isTorn);

      if (isTorn && hasWhiteEdge) {
        let wCoarse = noise(i * 8 + t * 11 + seedOffset + 900, 150);
        let wFine = noise(i * 8 + t * 23 + seedOffset + 900, 550);
        let wAmount = max(0, wCoarse * 0.65 + wFine * 0.35 - 0.15) * whiteBaseWidth * 2.2;
        let outDx = px - cx, outDy = py - cy;
        let sign = (nx * outDx + ny * outDy) >= 0 ? 1 : -1;
        whiteEdgePts.push({ x: px + nx * wAmount * sign, y: py + ny * wAmount * sign });
      } else {
        whiteEdgePts.push({ x: px, y: py });
      }
    }
  }

  let patternType = forcedPatternType !== undefined ? forcedPatternType : random(patternTypes);
  let pattern = null;
  if (patternType !== 'none') {
    let minSide = min(w, h);
    let spacing = forcedSpacingF !== undefined
      ? minSide * forcedSpacingF
      : (patternType === 'grid'
        ? random(minSide * gridSpacingMin, minSide * gridSpacingMax)
        : random(minSide * linesSpacingMin, minSide * linesSpacingMax));
    let strokeW = max(1, minSide * 0.0035);
    pattern = {
      type: patternType,
      col: getPatternColor(col),
      alpha: random(0.35, 0.6),
      spacing,
      strokeW,
      bx: x, by: y, bw: w, bh: h,
    };
  }

  let texture = textureImages.length > 0 ? random(textureImages) : null;
  let textureOpacity = random(textureOpacityMin, textureOpacityMax);

  let textBlock = textBlockDef ? { ...textBlockDef } : null;

  return { pts, isTornPt, whiteEdgePts, cx, cy, col, angleDeg, pattern, texture, textureOpacity, textBlock, bbox: { x, y, w, h }, hasWhiteEdge };
}

function drawPaperPiece(s) {
  push();
  translate(s.cx, s.cy);
  rotate(radians(s.angleDeg));
  translate(-s.cx, -s.cy);

  let shadowScale = min(s.bbox.w, s.bbox.h);
  drawingContext.save();
  drawingContext.shadowColor = 'rgba(40, 40, 60, 0.55)';
  drawingContext.shadowBlur = shadowScale * 0.07;
  drawingContext.shadowOffsetX = shadowScale * 0.010;
  drawingContext.shadowOffsetY = shadowScale * 0.018;

  if (s.hasWhiteEdge) {
    fill(whiteEdgeColor[0], whiteEdgeColor[1], whiteEdgeColor[2]);
    beginShape();
    for (let i = 0; i < s.whiteEdgePts.length; i++) {
      vertex(s.whiteEdgePts[i].x, s.whiteEdgePts[i].y);
    }
    endShape(CLOSE);
  } else {
    fill(s.col[0], s.col[1], s.col[2]);
    beginShape();
    for (let i = 0; i < s.pts.length; i++) {
      vertex(s.pts[i].x, s.pts[i].y);
    }
    endShape(CLOSE);
  }

  drawingContext.restore();

  if (s.hasWhiteEdge) {
    fill(s.col[0], s.col[1], s.col[2]);
    beginShape();
    for (let i = 0; i < s.pts.length; i++) {
      vertex(s.pts[i].x, s.pts[i].y);
    }
    endShape(CLOSE);
  }

  if (s.pattern) {
    drawClippedPattern(s);
  }

  if (s.textBlock) {
    drawClippedText(s);
  }

  if (s.texture) {
    drawClippedTexture(s);
  }

  pop();
}

function drawClippedText(s) {
  let tb = s.textBlock;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(s.pts[0].x, s.pts[0].y);
  for (let i = 1; i < s.pts.length; i++) {
    drawingContext.lineTo(s.pts[i].x, s.pts[i].y);
  }
  drawingContext.closePath();
  drawingContext.clip();

  drawingContext.font = `${tb.fontWeight} ${tb.fontSize}px ${tb.font}`;
  drawingContext.letterSpacing = `${tb.letterSpacingPx || 0}px`;
  drawingContext.fillStyle = `rgb(${tb.textColor[0]}, ${tb.textColor[1]}, ${tb.textColor[2]})`;
  drawingContext.textAlign = tb.align;
  drawingContext.textBaseline = 'top';

  let measured = measureWrappedText(tb.text, tb.font, tb.fontWeight, tb.fontSize, tb.wrapWidth, tb.lineHeight, tb.letterSpacingPx);
  let lines = measured.lines;

  let b = s.bbox;
  let startX = tb.align === 'right' ? b.x + b.w - tb.padPx
    : tb.align === 'center' ? b.x + b.w / 2
    : b.x + tb.padPx;
  let startY = b.y + tb.padPx;
  let lineHeightPx = tb.fontSize * tb.lineHeight;

  for (let i = 0; i < lines.length; i++) {
    drawingContext.fillText(lines[i], startX, startY + i * lineHeightPx);
  }

  drawingContext.restore();
}

function drawClippedTexture(s) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(s.pts[0].x, s.pts[0].y);
  for (let i = 1; i < s.pts.length; i++) {
    drawingContext.lineTo(s.pts[i].x, s.pts[i].y);
  }
  drawingContext.closePath();
  drawingContext.clip();

  blendMode(MULTIPLY);
  tint(255, s.textureOpacity * 255);

  let b = s.bbox;
  let padX = b.w * 0.15;
  let padY = b.h * 0.15;
  image(s.texture, b.x - padX, b.y - padY, b.w + padX * 2, b.h + padY * 2);
  noTint();
  blendMode(BLEND);

  drawingContext.restore();
}

function drawClippedPattern(s) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(s.pts[0].x, s.pts[0].y);
  for (let i = 1; i < s.pts.length; i++) {
    drawingContext.lineTo(s.pts[i].x, s.pts[i].y);
  }
  drawingContext.closePath();
  drawingContext.clip();

  let p = s.pattern;
  stroke(p.col[0], p.col[1], p.col[2], p.alpha * 255);
  strokeWeight(p.strokeW);
  noFill();

  let padX = p.bw * 0.15;
  let padY = p.bh * 0.15;
  let startX = p.bx - padX, endX = p.bx + p.bw + padX;
  let startY = p.by - padY, endY = p.by + p.bh + padY;

  for (let ly = startY; ly <= endY; ly += p.spacing) {
    line(startX, ly, endX, ly);
  }
  if (p.type === 'grid') {
    for (let lx = startX; lx <= endX; lx += p.spacing) {
      line(lx, startY, lx, endY);
    }
  }

  drawingContext.restore();
  noStroke();
}

function buildTapePolygonPts(w, h, rightJagOffsets, leftJagOffsets) {
  let steps = rightJagOffsets.length;
  let pts = [];
  pts.push({ x: 0, y: 0 });
  pts.push({ x: w, y: 0 });
  for (let i = 0; i < steps; i++) {
    let ny = (h / steps) * (i + 1);
    let nx = w + rightJagOffsets[i];
    pts.push({ x: nx, y: ny });
  }
  pts.push({ x: 0, y: h });
  for (let i = steps - 1; i >= 0; i--) {
    let ny = (h / steps) * i;
    let nx = leftJagOffsets[i];
    pts.push({ x: nx, y: ny });
  }
  return pts;
}

function drawTape(t) {
  push();
  translate(t.x + t.w / 2, t.y + t.h / 2);
  rotate(radians(t.angleDeg));
  translate(-t.w / 2, -t.h / 2);

  let pts = buildTapePolygonPts(t.w, t.h, t.rightJagOffsets, t.leftJagOffsets);

  fill(t.col[0], t.col[1], t.col[2], t.alpha * 255);
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    vertex(pts[i].x, pts[i].y);
  }
  endShape(CLOSE);

  if (t.texture) {
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      drawingContext.lineTo(pts[i].x, pts[i].y);
    }
    drawingContext.closePath();
    drawingContext.clip();

    blendMode(MULTIPLY);
    tint(255, t.textureOpacity * 255);

    let padX = tapeJag * 2.5;
    let padY = tapeJag * 2.5;
    image(t.texture, -padX, -padY, t.w + padX * 2, t.h + padY * 2);

    noTint();
    blendMode(BLEND);
    drawingContext.restore();
  }

  pop();
}
