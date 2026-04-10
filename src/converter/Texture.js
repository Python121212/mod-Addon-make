/**
 * Texture.js
 * Java版テクスチャを統合版のテクスチャ形式にマッピングする専門家
 */
export class TextureConverter {
    constructor() {
        // Java版のパスから統合版のパスへの変換ルール辞書
        this.mapping = {
            "assets/minecraft/textures/block/": "textures/blocks/",
            "assets/minecraft/textures/item/": "textures/items/",
            "assets/minecraft/textures/entity/": "textures/entity/"
        };
    }

    /**
     * テクスチャファイルのパスを統合版用に変換する
     * @param {string} originalPath 
     * @returns {string|null}
     */
    resolvePath(originalPath) {
        for (const [javaPath, bedrockPath] of Object.entries(this.mapping)) {
            if (originalPath.startsWith(javaPath)) {
                return originalPath.replace(javaPath, bedrockPath);
            }
        }
        return null; // 変換対象外
    }

    /**
     * テクスチャファイルを実際に変換・準備する
     * @param {Object} fileEntry (JSZipEntry)
     * @returns {Promise<Object>}
     */
    async convert(fileEntry) {
        const newPath = this.resolvePath(fileEntry.path);
        
        if (!newPath) {
            console.warn(`[Texture] スキップ対象: ${fileEntry.path}`);
            return null;
        }

        console.log(`[Texture] 変換: ${fileEntry.path} -> ${newPath}`);
        
        // バイナリデータとして取得
        const blob = await fileEntry.entry.async("blob");
        
        return {
            path: newPath,
            blob: blob
        };
    }
}

