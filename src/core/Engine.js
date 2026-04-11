/**
 * Engine.js
 * 全ての専門家を統括し、変換パイプラインを実行する心臓部
 */
import { ModLoader } from '../io/Loader.js';
import { TextureConverter } from '../converter/Texture.js';
import { Validator } from '../converter/Validator.js';
import { ModExporter } from '../io/Exporter.js';

export class ConversionEngine {
    constructor(uiUpdateCallback) {
        this.loader = new ModLoader();
        this.textureConverter = new TextureConverter();
        this.validator = new Validator();
        this.exporter = new ModExporter();
        
        // 変換状況を画面に通知するためのコールバック
        this.onProgress = uiUpdateCallback; 
    }

    async run(file) {
        try {
            this.onProgress("解析中...", 10);
            const structure = await this.loader.load(file);

            this.onProgress("変換中...", 30);
            const output = [];

            // 変換プロセス
            for (const entry of structure.assets) {
                const result = await this.textureConverter.convert(entry);
                
                // 変換成功かつ検証通過したものだけを梱包リストへ
                if (result && this.validator.validate({ type: 'texture', ...result })) {
                    output.push(result);
                }
            }

            this.onProgress("パッケージング中...", 80);
            await this.exporter.pack(output);
            
            this.onProgress("ダウンロード準備完了!", 100);
            await this.exporter.download();

        } catch (error) {
            this.onProgress(`エラー発生: ${error.message}`, 0);
            console.error(error);
        }
    }
}
