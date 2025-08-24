// 全てのHTML要素が読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得
    const absentContactBtn = document.getElementById('absent-contact-btn');
    const officialSiteBtn = document.getElementById('official-site-btn');
    const downloadBtn = document.getElementById('download-btn');
    const adminCodeInput = document.getElementById('admin-code-input');
    const checkCodeBtn = document.getElementById('check-code-btn');
    const adminBtn = document.getElementById('admin-btn');

    // 定義: 正しい管理者コード
    const correctAdminCode = '6234';

    // 欠席連絡ボタンのイベント
    if (absentContactBtn) {
        absentContactBtn.addEventListener('click', () => {
            window.location.href = 'absent_contact.html';
        });
    }

    // 公式サイトボタンのイベント
    if (officialSiteBtn) {
        officialSiteBtn.addEventListener('click', () => {
            window.location.href = 'https://maegumataiko.jimdofree.com/'; // 適切なURLに置き換えてください
        });
    }

    // 資料ダウンロードボタンのイベント
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            window.location.href = 'download.html';
        });
    }

    // 管理者コード確認ボタンのイベント
    if (checkCodeBtn) {
        checkCodeBtn.addEventListener('click', () => {
            if (adminCodeInput.value === correctAdminCode) {
                alert('管理者コードが正しく入力されました。');
                adminBtn.style.display = 'block';
            } else {
                alert('管理者コードが間違っています。');
                adminBtn.style.display = 'none';
                adminCodeInput.value = ''; // 入力欄をクリア
            }
        });
    }

    // 管理者画面ボタンのイベント
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }
});