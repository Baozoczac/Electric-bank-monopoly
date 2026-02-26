const container = document.getElementById("detailContainer");

let players = JSON.parse(localStorage.getItem("players"));
const selectedIndex = parseInt(localStorage.getItem("selectedPlayer"));

if (!players || isNaN(selectedIndex)) {
    window.location.href = "index.html";
}

let player = players[selectedIndex];


/* =========================
   RENDER UI (chỉ gọi 1 lần)
========================= */
function render() {
    container.innerHTML = `
        <div class="playerCardDetail" style="
            background: linear-gradient(
                to bottom,
                rgba(255,255,255,0.25),
                ${player.color}
            );
        ">
            <div class="avatar">${player.avatar}</div>
            <div class="cardTitle">${player.name}</div>
            <div class="balanceText">${player.balance.toLocaleString()}$</div>
        </div>

        <div class="actionPanel">
            <h2 class="title">NGÂN HÀNG ĐIỆN TỬ</h2>

            <input type="number" id="amountInput" placeholder="Nhập số tiền">

            <div class="buttonRow">
                <button onclick="addMoney()">Cộng</button>
                <button onclick="subtractMoney()">Trừ</button>
            </div>

            <select id="receiverSelect">
                <option value="">-- Chọn người nhận --</option>
                ${players.map((p, i) => {
                    if (i !== selectedIndex) {
                        return `<option value="${i}">${p.name}</option>`;
                    }
                    return "";
                }).join("")}
            </select>

            <button class="transferBtn" onclick="transferMoney()">
                Chuyển tiền
            </button>

            <button onclick="goBack()">Quay lại</button>
        </div>
    `;
}


/* =========================
   SAVE
========================= */
function save() {
    players[selectedIndex] = player;
    localStorage.setItem("players", JSON.stringify(players));
}


/* =========================
   UTIL
========================= */
function getAmount() {
    const value = document.getElementById("amountInput").value;
    const amount = parseInt(value);

    if (!amount || amount <= 0) {
        alert("Nhập số tiền hợp lệ");
        return null;
    }

    return amount;
}


/* =========================
   COUNT-UP ANIMATION
========================= */
function animateBalance(element, start, end, duration = 500) {
    const startTime = performance.now();
    const difference = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(start + difference * progress);

        element.textContent = currentValue.toLocaleString() + "$";

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString() + "$";
        }
    }

    requestAnimationFrame(update);
}


/* =========================
   ADD MONEY
========================= */
function addMoney() {
    const amount = getAmount();
    if (!amount) return;

    const balanceEl = document.querySelector(".balanceText");
    const card = document.querySelector(".playerCardDetail");

    const oldBalance = player.balance;
    player.balance += amount;

    animateBalance(balanceEl, oldBalance, player.balance);

    save();

    // hiệu ứng
    balanceEl.classList.add("money-pop");
    card.classList.add("glow-green");

    setTimeout(() => {
        balanceEl.classList.remove("money-pop");
        card.classList.remove("glow-green");
    }, 500);
}


/* =========================
   SUBTRACT MONEY
========================= */
function subtractMoney() {
    const amount = getAmount();
    if (!amount) return;

    if (player.balance < amount) {
        alert("Không đủ tiền");
        return;
    }

    const balanceEl = document.querySelector(".balanceText");
    const card = document.querySelector(".playerCardDetail");

    const oldBalance = player.balance;
    player.balance -= amount;

    animateBalance(balanceEl, oldBalance, player.balance);

    save();

    // hiệu ứng
    card.classList.add("shake", "glow-red");
    balanceEl.classList.add("money-pop");

    setTimeout(() => {
        card.classList.remove("shake", "glow-red");
        balanceEl.classList.remove("money-pop");
    }, 500);
}


/* =========================
   TRANSFER
========================= */
function transferMoney() {
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

    const balanceEl = document.querySelector(".balanceText");
    const card = document.querySelector(".playerCardDetail");

    const oldBalance = player.balance;

    player.balance -= amount;
    players[receiverIndex].balance += amount;

    animateBalance(balanceEl, oldBalance, player.balance);

    localStorage.setItem("players", JSON.stringify(players));

    card.classList.add("glow-player");

    setTimeout(() => {
        card.classList.remove("glow-player");
    }, 600);
}


/* =========================
   BACK
========================= */
function goBack() {
    window.location.href = "overview.html";
}


/* =========================
   INIT
========================= */
render();