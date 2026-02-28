    const grid = document.getElementById("playersGrid");

    function loadPlayers() {
        const data = localStorage.getItem("players");
        if (!data) return null;
        return JSON.parse(data);
    }

    function redirectToSetup() {
        window.location.href = "setup.html";
    }

    function createCard(player, index) {
        const card = document.createElement("div");
        card.className = "bankCard";
        card.style.background = `
            linear-gradient(to bottom, rgba(255,255,255,0.35), ${player.color})
        `;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = player.avatar;

        const name = document.createElement("div");
        name.className = "nameBox";
        name.textContent = player.name;

        const money = document.createElement("div");
        money.className = "money";
        money.textContent = player.balance.toLocaleString() + "$";

        card.append(avatar, name, money);

        card.addEventListener("click", () => {
            localStorage.setItem("selectedPlayer", index);
            window.location.href = "detail.html";
        });

        return card;
    }

    function render(players) {
        grid.innerHTML = "";
        players.forEach((player, index) => {
            grid.appendChild(createCard(player, index));
        });
    }

    const players = loadPlayers();

    if (!players) {
        redirectToSetup();
    } else {
        render(players);
    }

    function goBack() {
        redirectToSetup();
    }