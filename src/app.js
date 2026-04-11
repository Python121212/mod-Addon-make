
/**
 * app.js
 * ユーザーの操作を受け取り、変換エンジンを駆動する管理者
 */
import { ConversionEngine } from './core/Engine.js';

// DOMの読み込み完了を待機
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');

    // 進捗表示を更新するコールバック関数
    const updateUI = (message, percent) => {
        console.log(`[UI] ${message}`);
        progressBar.style.display = 'block';
        progressFill.style.width = `${percent}%`;
        // ここにログ出力エリアへのDOM追加処理を書いてもOK
    };

    // 変換エンジンのインスタンス化
    const engine = new ConversionEngine(updateUI);

    // 変換ボタンのイベントリスナー
    convertBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("まず .jar ファイルを選択してください！");
            return;
        }

        try {
            convertBtn.disabled = true; // 二重クリック防止
            convertBtn.innerText = "魔法を実行中...";
            
            await engine.run(file);
            
            convertBtn.innerText = "変換完了！";
        } catch (err) {
            alert("変換エラー: " + err.message);
            convertBtn.disabled = false;
            convertBtn.innerText = "変換エンジンを再起動";
        }
    });
});
