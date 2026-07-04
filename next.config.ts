import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

try {
  const oldPath = path.resolve(process.cwd(), "old-curriculum.json");
  const newPath = path.resolve(process.cwd(), "src/data/curriculum.json");
  if (fs.existsSync(oldPath)) {
    let raw = fs.readFileSync(oldPath, "utf-8");
    if (raw.charCodeAt(0) === 0xFEFF) {
      raw = raw.slice(1);
    }
    raw = raw.replace(/\u0097/g, "—")
             .replace(/\u0092/g, "'")
             .replace(/\u0093/g, '"')
             .replace(/\u0094/g, '"')
             .replace(/ΓÇö/g, "—")
             .replace(/≡ƒò░/g, "⌛")
             .replace(/≡ƒÄ»/g, "🎯")
             .replace(/≡ƒôû/g, "📖")
             .replace(/≡ƒºá/g, "🧠")
             .replace(/ΓÜÖ∩╕Å/g, "⚙️")
             .replace(/≡ƒôà/g, "📅")
             .replace(/≡ƒîì/g, "🌍")
             .replace(/≡ƒöÉ/g, "🔒")
             .replace(/≡ƒÆ╝/g, "💼")
             .replace(/≡ƒö║/g, "🔺")
             .replace(/≡ƒÆ⌐ΓÇì≡ƒÆ╗/g, "👩‍💻")
             .replace(/≡ƒôö/g, "📓")
             .replace(/≡ƒÆ░/g, "💰");
    const parsed = JSON.parse(raw);
    fs.writeFileSync(newPath, JSON.stringify(parsed, null, 2), "utf-8");
    console.log("Successfully cleaned and updated src/data/curriculum.json");
  }
} catch (e) {
  console.error("Failed to clean curriculum JSON in next.config.ts:", e);
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/1.png",
      },
    ];
  },
};

export default nextConfig;
