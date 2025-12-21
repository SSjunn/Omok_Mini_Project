const statusEl = document.getElementById("status");
const countdownEl = document.getElementById("countdown");
const boardEl = document.getElementById("board");
const playerLeftEl = document.querySelector(".player-left");
const playerRightEl = document.querySelector(".player-right");
let gridLayer = null;
let myColor = null;
let myUserId = null;
// console.log("game_ui.js loaded", boardEl);

const messageHandlers = {
    JOIN: handleJoin,
    LEAVE: handleLeave,
    COUNTDOWN: handleCountdown,
    GAME_START: handleGameStart,
    MOVE_OK: handleMoveOk,
    ROOM_WAIT: handleRoomWait,
    GAME_END: handleGameEnd,
    CHAT: handleChat,
    ERROR: handleError,
    ROOM_MEMBERS: handleRoomMembers
};

function handleServerMessage(msg) {
    const handler = messageHandlers[msg.type];
    if (!handler) {
        console.warn("Unhandled message type:", msg.type, msg);
        return;
    }
    handler(msg.payload);
}

function handleJoin(payload) {
    // 아이디, 프로필 사진, 닉네임
    console.log("JOIN:", payload);
    myUserId = payload.userId;
    updatePlayerUI(payload);
}

function handleLeave(payload) {
    console.log("LEAVE:", payload);
}

function handleCountdown(payload) {
    showCountdown(payload.sec);
}

function handleGameStart(payload) {
    if (payload.myColor) {
        myColor = payload.myColor;
        console.log("내 색:", myColor);
    }
    // if(payload.myUserId){
    //     myUserId = payload.myUserId;
    // }

    startGame(payload.firstTurn);
}

function handleMoveOk(payload) {
    applyMove(payload.x, payload.y, payload.color);
}

function handleRoomWait(payload) {
    statusEl.innerText = "상대방을 기다리는 중...";
    countdownEl.innerText = "";
}

function handleGameEnd(payload) {
    // 타임아웃으로 인한 게임 종료 처리
    if(payload.reason === "TIMEOUT"){
        if (payload.winner === myUserId) {
            alert("상대가 시간 초과로 패배했습니다!");
        } else {
            alert("시간 초과로 패배했습니다.");
        }
        return;
    }

    if (payload.winner === myUserId) {
        alert("🎉 게임 종료! 승리하셨습니다!");
    } else if (payload.winner !== myUserId) {
        alert("게임에서 패배했습니다 :(")
    } else if(payload.winner){
        alert("게임 종료: " + payload.reason);
    }else{
        alert("게임이 종료되었습니다.");
    }

    // 잠깐 딜레이 주고 이동해도 좋음
    setTimeout(() => {
        location.href = "/omok/lobby";
    }, 300);
}

function handleChat(payload) {
    const { senderRole, playerIndex, message } = payload;

    if (senderRole === "PLAYER") {
        showPlayerBubble(playerIndex, message);
    } else {
        appendSpectatorChat(message);
    }
}


function showCountdown(sec) {
    // statusEl.innerText = "게임 준비 중...";
    // countdownEl.innerText = `시작까지 ${sec}초`;
}

function renderBoard() {
    boardEl.innerHTML = "";
    boardEl.className = "board";
    console.log("boardEl:", boardEl);

    gridLayer = document.createElement("div");
    gridLayer.className = "grid-layer";
    boardEl.appendChild(gridLayer);

    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            gridLayer.appendChild(cell);
            cell.onclick = () => {
                console.log("cell clicked:", x, y);
                placeStone(x, y);
            }
        }
    }
}

function drawStone(x, y, color) {
    const idx = y * BOARD_SIZE + x;
    const cell = gridLayer.children[idx];

    cell.classList.add(color === "BLACK" ? "black" : "white");
}

function showPlayerBubble(playerIndex, message) {
    const bubble = document.getElementById(
        playerIndex === 1 ? "bubble-p1" : "bubble-p2"
    );
    if (!bubble) return;

    const textEl = bubble.querySelector(".bubble-text");
    if (textEl) textEl.textContent = message;

    bubble.classList.add("show");

    clearTimeout(bubble._hideTimer);
    bubble._hideTimer = setTimeout(() => {
        bubble.classList.remove("show");
    }, 3000);
}



function appendSpectatorChat(message) {
    const chatLog = document.getElementById("chatLog");
    if (!chatLog) return;

    const div = document.createElement("div");
    div.innerText = message;
    chatLog.appendChild(div);

    // 자동 스크롤
    chatLog.scrollTop = chatLog.scrollHeight;
}

function handleError(payload) {
    const { code, message } = payload;
    console.warn("ERROR:", code, message);

    // 지금은 간단히 알림
    alert(message);
}

function updateActivePlayer(turnColor) {
    playerLeftEl.classList.remove("active");
    playerRightEl.classList.remove("active");

    if (turnColor === "BLACK") {
        playerLeftEl.classList.add("active");
    } else if (turnColor === "WHITE") {
        playerRightEl.classList.add("active");
    }
}

function handleRoomMembers(payload) {
    console.log("현재 방 멤버 리스트:", payload);
    payload.forEach(user => updatePlayerUI(user));
}

function updatePlayerUI(user) {
    const isOwner = String(user.userId) === String(OWNER_ID);
    const targetEl = isOwner ? playerLeftEl : playerRightEl;

    if (targetEl) {
        const imgEl = targetEl.querySelector(".profile-img");
        if (imgEl) {
            // 경로가 상위 폴더를 가리키고 있다면 contextPath 처리가 필요할 수 있음
            imgEl.src = user.profileImg;
        }
        // 닉네임 표시를 위한 엘리먼트가 있다면 여기서 업데이트 (예: targetEl.querySelector(".name").innerText = user.nickname)
    }
}