/**
 * app.js - Magic Mod Converter 統合スクリプト
 * 役割: UI制御・エンジン起動・各専門家の管理
 */

// --- 1. 【専門家】変換ロジック ---
class ModLoader {
    async load(file) {
        console.log(`[Loader] ${file.name} を解析中...`);
        return { assets: ["texture1.png", "recipe.json"], code: ["Main.class"] };
    }
}

class TextureConverter {
    async convert(name) {
        console.log(`[Texture] ${name} を変換中...`);
        return { path: `textures/${name}`, blob: new Blob(["data"]) };
    }
}

class Validator {
    validate(data) {
        return !!data;
    }
}

class ModExporter {
    async pack(list) { console.log("[Exporter] zip圧縮中..."); }
    async download() { alert("魔法の変換が完了しました！"); }
}

// --- 2. 【司令塔】ConversionEngine ---
class ConversionEngine {
    constructor(uiCallback) {
        this.loader = new ModLoader();
        this.texture = new TextureConverter();
        this.validator = new Validator();
        this.exporter = new ModExporter();
        this.onProgress = uiCallback;
    }

    async run(file) {
        try {
            this.onProgress("解析中...", 20);
            const structure = await this.loader.load(file);
            
            this.onProgress("テクスチャ変換中...", 50);
            const output = [];
            for (const asset of structure.assets) {
                const result = await this.texture.convert(asset);
                if (this.validator.validate(result)) output.push(result);
            }

            this.onProgress("出力準備中...", 80);
            await this.exporter.pack(output);
            await this.exporter.download();
            this.onProgress("完了！", 100);
        } catch (e) {
            this.onProgress("エラーが発生しました", 0);
            console.error(e);
        }
    }
}

// --- 3. 【UI管理者】イベント制御 ---
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const statusMsg = document.getElementById('statusMessage');
    const progBar = document.getElementById('progress-bar');
    const progFill = document.getElementById('progress-fill');

    // ファイル選択時の挙動
    fileInput.addEventListener('change', (e) => {
        if(e.target.files[0]) {
            statusMsg.innerText = `準備OK: ${e.target.files[0].name}`;
            convertBtn.disabled = false;
        }
    });

    // 変換ボタンクリック時の挙動
    convertBtn.addEventListener('click', async () => {
        progBar.style.display = 'block';
        convertBtn.disabled = true;

        const engine = new ConversionEngine((msg, percent) => {
            progFill.style.width = `${percent}%`;
            statusMsg.innerText = msg;
        });

        await engine.run(fileInput.files[0]);
        convertBtn.disabled = false;
    });
});
