/**
 * Validator.js
 * 変換後のデータが「魔法として成立しているか」を検証する専門家
 */
export class Validator {
    constructor() {
        this.errors = [];
    }

    /**
     * Java版のデータが統合版で再現可能かチェックする
     * @param {Object} data 
     * @returns {boolean}
     */
    validate(data) {
        console.log("[Validator] 検証プロセス開始...");
        
        // 例: モデルの頂点数が統合版の制限を超えていないか？
        if (data.type === 'model' && data.vertexCount > 10000) {
            this._addError("モデルが複雑すぎます。統合版では描画制限を超えています。");
            return false;
        }

        // 例: 指定されたテクスチャパスが存在するか？
        if (data.type === 'texture' && !data.blob) {
            this._addError("テクスチャデータが空です。ソースファイルを確認してください。");
            return false;
        }

        return true;
    }

    _addError(message) {
        this.errors.push(message);
        console.error(`[Validator] 警告: ${message}`);
    }

    getReport() {
        return this.errors;
    }
}

