/**
 * Exporter.js
 * 変換済みデータを統合版(.mcaddon)として梱包・保存する専門家
 */
import JSZip from 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
import { saveAs } from 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';

export class ModExporter {
    constructor(addonName = "ConvertedAddon") {
        this.addonName = addonName;
        this.zip = new JSZip();
    }

    /**
     * 変換済みファイルリストをzipに詰め込む
     * @param {Array} fileList - [{path: string, blob: Blob}, ...]
     */
    async pack(fileList) {
        console.log(`[Exporter] パッケージング開始: ${this.addonName}`);

        // 各ファイルをZIPに追加
        for (const file of fileList) {
            this.zip.file(file.path, file.blob);
        }

        // manifest.json があれば追加（メタデータ専門家から受け取るのが理想）
        // ここでは簡易的に空のjsonを作成
        this.zip.file("manifest.json", JSON.stringify({
            "format_version": 2,
            "header": {
                "name": this.addonName,
                "description": "Converted from Java Mod",
                "uuid": crypto.randomUUID(),
                "version": [1, 0, 0]
            },
            "modules": [{
                "type": "resources",
                "uuid": crypto.randomUUID(),
                "version": [1, 0, 0]
            }]
        }, null, 4));

        console.log("[Exporter] zip圧縮準備完了");
    }

    /**
     * zipファイルをダウンロードさせる
     */
    async download() {
        const content = await this.zip.generateAsync({ type: "blob" });
        saveAs(content, `${this.addonName}.mcaddon`);
        console.log("[Exporter] ダウンロードを開始しました");
    }
}
