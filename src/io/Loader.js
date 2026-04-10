/**
 * Loader.js
 * Modファイル（.jar/.zip）を解析し、ディレクトリ構造とファイルデータを抽出する専門家
 */
import JSZip from 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

export class ModLoader {
    constructor() {
        this.zip = null;
        this.structure = {
            assets: [], // テクスチャやモデル
            data: [],   // レシピやワールド生成
            code: [],   // Javaクラスファイル
            meta: []    // 設定ファイル
        };
    }

    /**
     * ファイルを読み込み、内部構造を解析・インデックス化する
     * @param {File} file 
     * @returns {Promise<Object>}
     */
    async load(file) {
        try {
            console.log(`[Loader] 解析開始: ${file.name}`);
            const arrayBuffer = await file.arrayBuffer();
            this.zip = await JSZip.loadAsync(arrayBuffer);

            // zip内の全ファイルを走査して分類
            this.zip.forEach((relativePath, zipEntry) => {
                if (zipEntry.dir) return;

                const categorized = this._categorize(relativePath);
                this.structure[categorized].push({
                    path: relativePath,
                    entry: zipEntry
                });
            });

            console.log(`[Loader] 解析完了:`, this.structure);
            return this.structure;
        } catch (error) {
            console.error("[Loader] 解析失敗:", error);
            throw new Error("Modファイルの読み込みに失敗しました。");
        }
    }

    /**
     * パスに基づいてファイルをカテゴリ分けする内部メソッド
     */
    _categorize(path) {
        if (path.startsWith('assets/')) return 'assets';
        if (path.startsWith('data/')) return 'data';
        if (path.endsWith('.class') || path.endsWith('.java')) return 'code';
        if (path.includes('mcmod.info') || path.includes('fabric.mod.json')) return 'meta';
        return 'assets'; // デフォルト
    }

    /**
     * 特定のパスのファイルデータを取得する
     */
    async getFileContent(path, type = "string") {
        const entry = this.zip.file(path);
        if (!entry) return null;
        return type === "string" ? await entry.async("string") : await entry.async("blob");
    }
}
