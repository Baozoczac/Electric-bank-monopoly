const grid = document.getElementById("setupGrid");
const startBtn = document.getElementById("startGameBtn");
const startMoneyInput = document.getElementById("startMoney");

const colorPool = ["#ff1c1c","#ffe600","#3498db","#2ecc71","#9b59b6","#e67e22"];
const avatarList = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🦉","🦄","🐳","🐺"];

let players = [];

/* ========================= UTIL ========================= */

function getUniqueAvatar() {
    const used = players.map(p => p.avatar);
    const available = avatarList.filter(a => !used.includes(a));
    const pool = available.length ? available : avatarList;
    return pool[Math.floor(Math.random() * pool.length)];
}

function getUniqueColor() {
    const used = players.map(p => p.color);
    const available = colorPool.filter(c => !used.includes(c));
    if (!available.length) return null;
    return available[Math.floor(Math.random() * available.length)];
}

/* ========================= PLAYER ========================= */

function addPlayer() {
    const color = getUniqueColor();
    if (!color) return;

    players.push({
        name: "",
        color,
        avatar: getUniqueAvatar()
    });

    render();
}

function removePlayer(index) {
    players.splice(index, 1);
    render();
}

function updateName(index, value) {
    players[index].name = value;
}

function randomAvatar(index) {
    players[index].avatar = getUniqueAvatar();
    render();
}

/* ========================= RENDER ========================= */

function createPlayerCard(player, index) {
    const card = document.createElement("div");
    card.className = "setupCard";
    card.style.background = `
        linear-gradient(to bottom, rgba(255,255,255,0.35), ${player.color})
    `;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = player.avatar;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => removePlayer(index));

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nhập tên";
    input.value = player.name;
    input.addEventListener("input", e => updateName(index, e.target.value));

    const randomBtn = document.createElement("button");
    randomBtn.className = "randomAvatarBtn";
    randomBtn.textContent = "🎲";
    randomBtn.addEventListener("click", () => randomAvatar(index));

    card.append(avatar, deleteBtn, input, randomBtn);
    return card;
}

function render() {
    grid.innerHTML = "";

    players.forEach((player, index) => {
        grid.appendChild(createPlayerCard(player, index));
    });

    const addCard = document.createElement("div");
    addCard.className = "setupCard addCard";
    addCard.textContent = "+";
    addCard.addEventListener("click", addPlayer);

    grid.appendChild(addCard);
}

/* ========================= START GAME ========================= */

function startGame() {
    const startMoney = parseInt(startMoneyInput.value);

    if (!startMoney || startMoney <= 0) {
        alert("Nhập tiền hợp lệ");
        return;
    }

    const validPlayers = players.filter(p => p.name.trim() !== "");

    if (validPlayers.length < 2) {
        alert("Cần ít nhất 2 người chơi");
        return;
    }

    const finalPlayers = validPlayers.map((p, i) => ({
        id: i,
        name: p.name,
        balance: startMoney,
        color: p.color,
        avatar: p.avatar
    }));

    localStorage.setItem("players", JSON.stringify(finalPlayers));
    window.location.href = "overview.html";
}

startBtn.addEventListener("click", startGame);

/* ========================= INIT ========================= */

addPlayer();
addPlayer();