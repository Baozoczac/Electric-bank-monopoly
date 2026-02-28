const container = document.getElementById("detailContainer");

function loadGameData() {
    const players = JSON.parse(localStorage.getItem("players"));
    const selectedIndex = parseInt(localStorage.getItem("selectedPlayer"));
    if (!players || isNaN(selectedIndex)) return null;
    return { players, selectedIndex };
}

const data = loadGameData();

if (!data) {
    window.location.href = "overview.html";
}

let { players, selectedIndex } = data;
let player = players[selectedIndex];

/* ========================= SAVE ========================= */

function save() {
    players[selectedIndex] = player;
    localStorage.setItem("players", JSON.stringify(players));
}

/* ========================= UTIL ========================= */

function getAmount() {
    const value = document.getElementById("amountInput").value;
    const amount = parseInt(value);
    if (!amount || amount <= 0) {
        alert("Nhập số tiền hợp lệ");
        return null;
    }
    return amount;
}

function animateBalance(element, start, end, duration = 400) {
    const startTime = performance.now();
    const diff = end - start;

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + diff * progress);
        element.textContent = current.toLocaleString() + "$";
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ========================= ACTIONS ========================= */

function addMoney(balanceEl) {
    const amount = getAmount();
    if (!amount) return;

    const oldBalance = player.balance;
    player.balance += amount;

    animateBalance(balanceEl, oldBalance, player.balance);
    save();
}

function subtractMoney(balanceEl) {
    const amount = getAmount();
    if (!amount) return;
    if (player.balance < amount) {
        alert("Không đủ tiền");
        return;
    }

    const oldBalance = player.balance;
    player.balance -= amount;

    animateBalance(balanceEl, oldBalance, player.balance);
    save();
}

function transferMoney(balanceEl) {
    const receiverIndex = document.getElementById("receiverSelect").value;
    const amount = getAmount();

    if (receiverIndex === "" || !amount) {
        alert("Chọn người nhận và nhập tiền");
        return;
    }

    if (player.balance < amount) {
        alert("Không đủ tiền");
        return;
    }

    const oldBalance = player.balance;

    player.balance -= amount;
    players[receiverIndex].balance += amount;

    animateBalance(balanceEl, oldBalance, player.balance);
    localStorage.setItem("players", JSON.stringify(players));
}

/* ========================= RENDER ========================= */

function render() {
    container.innerHTML = `
        <div class="playerCardDetail" style="
            background: linear-gradient(to bottom, rgba(255,255,255,0.25), ${player.color});
        ">
            <div class="avatar">${player.avatar}</div>
            <div class="cardTitle">${player.name}</div>
            <div class="balanceText">${player.balance.toLocaleString()}$</div>
        </div>

        <div class="actionPanel">
            <h2 class="title">NGÂN HÀNG ĐIỆN TỬ</h2>
            <input type="number" id="amountInput" placeholder="Nhập số tiền">

            <div class="buttonRow">
                <button id="addBtn">Cộng</button>
                <button id="subBtn">Trừ</button>
            </div>

            <select id="receiverSelect">
                <option value="">-- Chọn người nhận --</option>
                ${players.map((p, i) => i !== selectedIndex ? `<option value="${i}">${p.name}</option>` : "").join("")}
            </select>

            <button id="transferBtn">Chuyển tiền</button>
            <button id="backBtn">Quay lại</button>
        </div>
    `;

    const balanceEl = document.querySelector(".balanceText");

    document.getElementById("addBtn").addEventListener("click", () => addMoney(balanceEl));
    document.getElementById("subBtn").addEventListener("click", () => subtractMoney(balanceEl));
    document.getElementById("transferBtn").addEventListener("click", () => transferMoney(balanceEl));
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "overview.html";
    });
}

render();