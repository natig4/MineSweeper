'use strict'

var gBoardSize = 16;
var gBoard = [];
var gInterval;
var gScore = -Infinity;
var gBestScore;
var gLives = 3;
var gStartingTime;
var gFinishingTime;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
};
var smiley = '😀';
const MINE = '💣';
const FLAG = '🚩'
const gLife = '♥'



var gTime = {
        milisec: 0,
        sec: 0,
        /* holds incrementing value */
        min: 0,
        hour: 0
    }
    /* Contains and outputs returned value of  function checkTime */
var gTimeOut = {
        miliSecOut: 0,
        secOut: 0,
        minOut: 0,
        hourOut: 0
    }
    /* Output variable End */

var gLevel = {
    Size: Math.sqrt(gBoardSize),
    MINES: minesAmount()
};



function init() {
    newGame();
    resetTimer()
}

function newGame() {
    stop();
    buildBoard();
    renderBoard(gBoard);
    document.querySelector('.game-button').innerText = smiley;
    resetTimer();
    gLives = 3
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
    }
    gLevel = {
        Size: Math.sqrt(gBoardSize),
        MINES: minesAmount(),
        gPossibleFlags: gLevel.MINES
    };
    renderPossibleFlagsAmount()
    changeLives()
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.Size; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.Size; j++) {
            strHTML += `<td class="cell cell-${i}-${j}"
             onclick="renderCell(this,${i},${j})" oncontextmenu="markCell(event,this,${i},${j})" >`;
            strHTML += '</td>'
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function renderCell(elCell, i, j) {

    if (gBoard[i][j].isVisiable === true) return;
    if (gGame.shownCount === gBoardSize - gLevel.MINES) {
        stop()
    }
    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        gGame.isOn = true
        start()
        if ((gBoard[i][j].type === 'mine') || (gBoard[i][j].isMarked)) return;
    }

    if (gGame.isOn === false) return;
    var type = gBoard[i][j].type;
    var strHTML = ''
    switch (type) {
        case 'mine':
            strHTML = MINE;
            break;
        case 'neg':
            strHTML = gBoard[i][j].minesAroundCount
            break;
        case 'empty':
            break;
    }
    gBoard[i][j].isVisiable = true;
    gGame.shownCount++;
    gameOver(elCell, i, j)
    showCell(elCell, strHTML)
    if (gBoard[i][j].type === 'empty') {
        findNegsToOpen(i, j, gBoard)
    }


}

function findNegsToOpen(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var cell = board[i][j];
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            if (cell.type !== 'mine' || cell.isVisiable === false) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                renderCell(elCell, i, j)
                if (cell === false) return;
            }
        }
    }
}

function markCell(e, elCell, i, j) {
    if (gGame.shownCount === 0 && gGame.markedCount === 0) start();
    e.preventDefault();
    if (!gGame.isOn) { return }
    var cell = gBoard[i][j];
    if (!cell.isMarked) {
        if (cell.isVisiable) return;
        elCell.classList.add('flag')
        elCell.innerText = FLAG;
        gGame.markedCount++;
    } else {
        elCell.classList.remove('flag')
        gGame.markedCount--
            elCell.innerText = '';
    }
    cell.isMarked = !cell.isMarked;
    renderPossibleFlagsAmount()
}

function renderScore() {
    gScore = gFinishingTime - gStartingTime
}

function gameOver(elCell, i, j) {
    var action = ''
    if (gBoard[i][j].type === 'mine') {
        action = 'lifeLost';
        gLevel.MINES--;
        gLives--;
        changeLives()
        elCell.innerText = ''
        if (gLives === 0) {
            action = 'gameLost'
            stop()
            gGame.isOn = false;
        }
    }
    if (gGame.shownCount + gGame.markedCount === gBoardSize - gLevel.MINES) {
        gGame.isOn = false;
        action = 'won'
    }
    var elBtn = document.querySelector('.game-button');
    switch (action) {
        case 'lifeLost':
            break;
        case 'gameLost':
            elBtn.innerText = '🤯'
            stop();
            break;
        case 'won':
            elBtn.innerText = '😎'
            stop()
            break;
    }

}



function changeLives() {
    var elLivesBox = document.querySelector('.lives-box');
    elLivesBox.innerText = ''
    for (var i = 0; i < gLives; i++) {
        elLivesBox.innerText += gLife;
    }
    elLivesBox.style.color = 'red'
}

function changeLevel(elBtn) {
    var buttons = document.querySelectorAll('.level')
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        (elBtn.dataset.level === button.dataset.level) ? button.classList.add('choosen'): button.classList.remove('choosen');
    }
    // console.log(button, 'button')
    gBoardSize = +elBtn.dataset.level;
    gLevel = {
        Size: Math.sqrt(gBoardSize),
        MINES: minesAmount()
    }
    init()

}

function renderPossibleFlagsAmount() {
    var elMinesLeft = document.querySelector('.table-footer span')
    gLevel.gPossibleFlags = gLevel.MINES - gGame.markedCount;
    elMinesLeft.innerText = gLevel.gPossibleFlags
}