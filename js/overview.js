const grid = document.getElementById("playersGrid");

const players = JSON.parse(localStorage.getItem("players"));

if(!players){
    window.location.href = "setup.html";
}

players.forEach((player,setup)=>{

    const card = document.createElement("div");
card.className = "bankCard";
card.style.background = `
    linear-gradient(
        to bottom,
        rgba(255,255,255,0.35),
        ${player.color}
    )
`;

card.innerHTML = `

    <div class="avatar">${player.avatar}</div>
    <div class="nameBox">${player.name}</div>
    <div class="money">${player.balance.toLocaleString()}$</div>
`;

    card.onclick = ()=>{
        localStorage.setItem("selectedPlayer", setup);
        window.location.href = "detail.html";
    };

    grid.appendChild(card);
});

function goBack(){
    window.location.href = "setup.html";
}