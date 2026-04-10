/**
 * Engine.js
 * Mod変換パイプラインの司令塔
 */
import { ModLoader } from '../io/Loader.js';
import { TextureConverter } from '../converter/Texture.js';

export class ConversionEngine {
    constructor() {
        this.loader = new ModLoader();
        this.textureConverter = new TextureConverter();
        this.output = []; // 変換後のファイル群をここに貯める
    }

    /**
     * 変換プロセスを順次実行する
     * @param {File} file 
     */
    async start(file) {
        console.log("[Engine] 変換プロセス開始");

        // 1. ファイルを解析
        const structure = await this.loader.load(file);

        // 2. テクスチャの変換処理 (専門家に丸投げ)
        console.log("[Engine] テクスチャ変換中...");
        for (const entry of structure.assets) {
            const result = await this.textureConverter.convert(entry);
            if (result) {
                this.output.push(result);
            }
        }

        // 3. 次のフェーズへ... (次はレシピやモデルを追加予定)
        console.log("[Engine] 変換完了: ", this.output);
        return this.output;
    }
}

