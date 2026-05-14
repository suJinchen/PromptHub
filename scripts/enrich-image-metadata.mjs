import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const promptsPath = path.join(root, "src/data/prompts.json");
const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));

const commonRatios = [
  { label: "1:1", value: 1 / 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
  { label: "4:3", value: 4 / 3 },
  { label: "5:4", value: 5 / 4 },
];

function parsePng(buffer) {
  if (buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function parseJpeg(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function parseWebp(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  if (chunk === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  return null;
}

function parseDimensions(buffer) {
  return parsePng(buffer) ?? parseJpeg(buffer) ?? parseWebp(buffer);
}

function ratioLabel(width, height) {
  const ratio = width / height;
  const nearest = commonRatios
    .map((item) => ({ ...item, diff: Math.abs(item.value - ratio) / item.value }))
    .sort((a, b) => a.diff - b.diff)[0];
  if (nearest && nearest.diff < 0.08) return nearest.label;
  return `约 ${ratio.toFixed(2)}:1`;
}

async function fetchBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

const warnings = [];
let updated = 0;

for (const prompt of prompts) {
  try {
    const buffer = await fetchBuffer(prompt.coverImage);
    const dimensions = parseDimensions(buffer);
    if (!dimensions?.width || !dimensions?.height) throw new Error("unsupported image format");
    prompt.imageWidth = dimensions.width;
    prompt.imageHeight = dimensions.height;
    prompt.aspectRatioLabel = ratioLabel(dimensions.width, dimensions.height);
    prompt.aspectRatio = prompt.aspectRatioLabel;
    prompt.ratio = prompt.aspectRatioLabel;
    updated += 1;
  } catch (error) {
    warnings.push(`${prompt.slug}: ${error.message}`);
  }
}

fs.writeFileSync(promptsPath, `${JSON.stringify(prompts, null, 2)}\n`, "utf8");
console.log(`Enriched image metadata for ${updated}/${prompts.length} prompts.`);
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
