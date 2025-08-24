document.addEventListener('DOMContentLoaded', () => {
    // データをlocalStorageから読み込む、なければ初期データを作成
    let roster = JSON.parse(localStorage.getItem('roster')) || [
        { name: '山田 太郎', grade: '中2', attendance: '出席' },
        { name: '佐藤 花子', grade: '高1', attendance: '欠席' },
        { name: '田中 健太', grade: '小5', attendance: '未確認' },
    ];
    let absentReports = JSON.parse(localStorage.getItem('absentReports')) || [];

    // **【追加】名簿を毎日リセットする機能**
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString(); // "Tue Apr 20 2025"のような形式

    if (lastResetDate !== today) {
        // 日付が変わっていれば、出欠をリセット
        roster.forEach(student => {
            student.attendance = '未確認';
        });
        // 欠席連絡リストもクリア
        absentReports = [];

        // localStorageを更新
        localStorage.setItem('roster', JSON.stringify(roster));
        localStorage.setItem('absentReports', JSON.stringify(absentReports));
        localStorage.setItem('lastResetDate', today);
        console.log('名簿の出欠をリセットしました。');
    }

    // 各要素を取得
    const rosterTableBody = document.querySelector('#roster-table tbody');
    const absentList = document.getElementById('absent-list');
    const attendanceList = document.getElementById('attendance-list');
    const studentSelect = document.getElementById('student-select');
    const deleteBtn = document.getElementById('delete-btn');

    // セクション表示を切り替える関数
    window.showSection = function (sectionId) {
        document.querySelectorAll('.admin-content').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        if (sectionId === 'roster') {
            renderRoster();
        } else if (sectionId === 'absent-check') {
            renderAbsentReports();
        } else if (sectionId === 'attendance-check') {
            renderAttendanceList();
        } else if (sectionId === 'delete-student') {
            renderStudentSelect();
        }
    }

    // 名簿を表示する関数
    function renderRoster() {
        rosterTableBody.innerHTML = '';
        roster.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.grade}</td>
                <td>${student.attendance}</td>
            `;
            rosterTableBody.appendChild(row);
        });
    }

    // 新規登録フォームの処理
    document.getElementById('register-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('reg-name').value;
        const grade = document.getElementById('reg-grade').value;
        if (name && grade) {
            roster.push({ name: name, grade: grade, attendance: '未確認' });
            localStorage.setItem('roster', JSON.stringify(roster));
            alert(`${name}さんの新規登録が完了しました。`);
            document.getElementById('register-form').reset();
            renderRoster(); // 名簿を更新
            renderStudentSelect(); // 削除リストを更新
        }
    });

    // 欠席報告リストを表示する関数
    function renderAbsentReports() {
        absentReports = JSON.parse(localStorage.getItem('absentReports')) || [];
        absentList.innerHTML = '';
        if (absentReports.length === 0) {
            absentList.innerHTML = '<li>現在、欠席連絡はありません。</li>';
        } else {
            absentReports.forEach(report => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><strong>${report.name}</strong>: ${report.reason}</span>
                    <button data-name="${report.name}">名簿に反映</button>
                `;
                li.querySelector('button').addEventListener('click', () => {
                    updateAttendance(report.name, '欠席');
                    absentReports = absentReports.filter(r => r.name !== report.name);
                    localStorage.setItem('absentReports', JSON.stringify(absentReports));
                    renderAbsentReports();
                });
                absentList.appendChild(li);
            });
        }
    }

    // 出席確認リストを表示する関数
    function renderAttendanceList() {
        attendanceList.innerHTML = '';
        roster.forEach(student => {
            const li = document.createElement('li');
            const isChecked = student.attendance === '出席' ? 'checked' : '';
            li.innerHTML = `
                <span><strong>${student.name}</strong> (${student.grade})</span>
                <input type="checkbox" ${isChecked} data-name="${student.name}">
            `;
            li.querySelector('input').addEventListener('change', (event) => {
                const newStatus = event.target.checked ? '出席' : '未確認';
                updateAttendance(student.name, newStatus);
            });
            attendanceList.appendChild(li);
        });
    }

    // 出欠情報を更新する関数
    function updateAttendance(name, status) {
        const student = roster.find(s => s.name === name);
        if (student) {
            student.attendance = status;
            localStorage.setItem('roster', JSON.stringify(roster));
            renderRoster();
            renderAbsentReports();
            renderAttendanceList();
        }
    }

    // 生徒削除用セレクトボックスを生成する関数
    function renderStudentSelect() {
        studentSelect.innerHTML = '';
        if (roster.length === 0) {
            const option = document.createElement('option');
            option.text = "生徒がいません";
            studentSelect.appendChild(option);
            deleteBtn.disabled = true;
        } else {
            roster.forEach((student, index) => {
                const option = document.createElement('option');
                option.text = `${student.name} (${student.grade})`;
                option.value = index; // 配列のインデックスを値として設定
                studentSelect.appendChild(option);
            });
            deleteBtn.disabled = false;
        }
    }

    // 削除ボタンのイベントリスナー
    deleteBtn.addEventListener('click', () => {
        const selectedIndex = studentSelect.value;
        if (selectedIndex !== null && confirm(`本当に${roster[selectedIndex].name}さんを削除しますか？`)) {
            roster.splice(selectedIndex, 1); // 配列から生徒を削除
            localStorage.setItem('roster', JSON.stringify(roster)); // ローカルストレージを更新
            alert('生徒を削除しました。');
            showSection('roster'); // 名簿画面に遷移して更新
        }
    });

    // 最初に名簿を表示
    showSection('roster');
});