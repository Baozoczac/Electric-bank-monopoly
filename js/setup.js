const grid = document.getElementById("setupGrid");
const startBtn = document.getElementById("startGameBtn");

const colorPool = [
    "#ff1c1c",
    "#ffe600",
    "#3498db",
    "#2ecc71",
    "#9b59b6",
    "#e67e22"
];

const avatarList = [
"🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨",
"🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊",
"🐔","🐧","🐦","🦉","🦄","🐳","🐺"
];

let players = [];


/* =========================
   RANDOM AVATAR KHÔNG TRÙNG
========================= */
function getUniqueAvatar(){

    const used = players.map(p => p.avatar);
    const available = avatarList.filter(a => !used.includes(a));

    if(available.length === 0){
        return avatarList[Math.floor(Math.random()*avatarList.length)];
    }

    return available[Math.floor(Math.random()*available.length)];
}


/* =========================
   CREATE PLAYER
========================= */
function createPlayerCard(color="random"){

    if(color==="random"){
        const usedColors = players.map(p=>p.color);
        const available = colorPool.filter(c=>!usedColors.includes(c));
        if(available.length===0) return;
        color = available[Math.floor(Math.random()*available.length)];
    }

    players.push({
        name:"",
        color:color,
        avatar:getUniqueAvatar() // tự random ngay khi tạo
    });

    render();
}


/* =========================
   REMOVE PLAYER
========================= */
function removePlayer(index){
    players.splice(index,1);
    render();
}


/* =========================
   RENDER
========================= */
function render(){

    grid.innerHTML="";

    players.forEach((player,index)=>{

        const card = document.createElement("div");
        card.className="setupCard";
        card.style.background = `
        linear-gradient(
        to bottom,
        rgba(255,255,255,0.35),
        ${player.color}
        )
        `;

        card.innerHTML=`
        <div class="avatar">${player.avatar}</div>

        <button class="deleteBtn" onclick="removePlayer(${index})">✕</button>

        <input 
            type="text" 
            placeholder="Nhập tên"
            value="${player.name}"
            onchange="updateName(${index}, this.value)"
        >

        <button class="randomAvatarBtn" onclick="randomAvatar(${index})">
            🎲
        </button>
        `;

        grid.appendChild(card);
    });

    const addCard = document.createElement("div");
    addCard.className="setupCard addCard";
    addCard.innerHTML="+";
    addCard.onclick=()=>createPlayerCard();

    grid.appendChild(addCard);
}


/* =========================
   UPDATE NAME
========================= */
function updateName(index,value){
    players[index].name=value;
}


/* =========================
   RANDOM AVATAR BUTTON
========================= */
function randomAvatar(index){
    players[index].avatar = getUniqueAvatar();
    render();
}


/* =========================
   START GAME
========================= */
startBtn.onclick=()=>{

    const startMoney = parseInt(document.getElementById("startMoney").value);

    if(!startMoney || startMoney<=0){
        alert("Nhập tiền hợp lệ");
        return;
    }

    const validPlayers = players.filter(p=>p.name.trim()!=="");

    if(validPlayers.length<2){
        alert("Cần ít nhất 2 người chơi");
        return;
    }

    const finalPlayers = validPlayers.map((p,i)=>({
        id:i,
        name:p.name,
        balance:startMoney,
        color:p.color,
        avatar:p.avatar
    }));

    localStorage.setItem("players",JSON.stringify(finalPlayers));
    window.location.href="overview.html";
};


/* =========================
   INIT
========================= */
createPlayerCard();
createPlayerCard();