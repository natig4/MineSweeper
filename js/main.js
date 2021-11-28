'use strict'

var gBoardSize = 16;
var gBoard = [];
var gInterval;
var gScore = -Infinity;
var gBestScore;
var gLives;
var gGame = {};
var gLevel = {};
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




function init() {
    gLives = 3;
    newGame();
    resetTimer();
}

function newGame() {
    stop();
    gLevel = {
        Size: +Math.sqrt(gBoardSize),
        MINES: minesAmount(),
        gPossibleFlags: gLevel.MINES,
        minesLocations: [],
        startTime: 0,
        gameTime: []
    };
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        firstClick: true
    };
    changeLives();
    buildBoard();
    renderBoard(gBoard);
    document.querySelector('.game-button').innerText = smiley;
    renderPossibleFlagsAmount();
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
        strHTML += '</tr>'

    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function renderCell(elCell, i, j) {
    if ((gBoard[i][j].isVisiable)) return;
    if (gGame.firstClick) {
        start();
    }
    if (!gGame.isOn || gBoard[i][j].isMarked || (gBoard[i][j].type === 'mine' && gGame.markedCount + gGame.shownCount === 0)) return;
    var strHTML = ''
    switch (gBoard[i][j].type) {
        case 'mine':
            strHTML = MINE;
            break;
        case 'neg':
            strHTML = gBoard[i][j].minesAroundCount;
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
            if (cell.type !== 'mine' || !cell.isVisiable) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                renderCell(elCell, i, j)
                if (cell === false) return;
            }
        }
    }
}

function markCell(e, elCell, i, j) {
    if (gGame.firstClick) start();
    e.preventDefault();
    var cell = gBoard[i][j];
    if ((!gGame.isOn) || cell.isVisiable) return;
    if (!cell.isMarked) {
        if (gGame.markedCount >= gLevel.MINES) return
        elCell.classList.add('flag')
        elCell.innerText = FLAG;
        gGame.markedCount++;
        cell.isMarked = true;
        gameOver(elCell, i, j)
    } else {
        elCell.classList.remove('flag')
        gGame.markedCount--
            elCell.innerText = '';
        cell.isMarked = false;
    }
    renderPossibleFlagsAmount();
}

function gameOver(elCell, i, j) {
    var action = ''
    if (gBoard[i][j].type === 'mine' && gBoard[i][j].isMarked === false) {
        action = 'lifeLost';
        gLevel.MINES--;
        gLives--;
        changeLives();
        stop();
        gGame.isOn = false;
        elCell.innerText = '';
        if (gLives === 0) {
            action = 'gameLost'
        }
    } else if ((gGame.shownCount === gBoardSize - gLevel.MINES) && (gGame.markedCount === gLevel.MINES)) {
        gGame.isOn = false;
        action = 'won'
    }
    var elBtn = document.querySelector('.game-button');
    switch (action) {
        case 'lifeLost':
            elBtn.innerText = '🤯'
            openMines()
            break;
        case 'gameLost':
            elBtn.innerText = '🤯'
            openMines()
            openModal(false)
            break;
        case 'won':
            elBtn.innerText = '😎'
            openModal(true)
            break;
    }
}



function changeLives() {
    var elLivesBox = document.querySelector('.lives-box');
    elLivesBox.innerText = ''
    for (var i = 0; i < gLives; i++) {
        elLivesBox.innerText += gLife;
    }
    elLivesBox.style.color = 'red';
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
    closeModal();
    init();
}

function renderPossibleFlagsAmount() {
    var elMinesLeft = document.querySelector('.table-footer span')
    gLevel.gPossibleFlags = gLevel.MINES - gGame.markedCount;
    elMinesLeft.innerText = gLevel.gPossibleFlags;
}