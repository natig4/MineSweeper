'use strict'

function minesAmount() {
    var elModal = document.querySelector('.modal')
    var minesCount = 0;
    switch (gBoardSize) {
        case 16:
            minesCount = 2;
            elModal.style.width = elModal.style.height = 248 + 'px'
            break;
        case 64:
            minesCount = 12;
            elModal.style.width = elModal.style.height = 524 + 'px'
            break;
        case 144:
            minesCount = 30;
            elModal.style.width = elModal.style.height = 800 + 'px'
            break;

    }
    return minesCount
}

function createMat() {
    var board = [];
    for (var i = 0; i < gLevel.Size; i++) {
        var row = []
        for (var j = 0; j < gLevel.Size; j++) {
            row.push({
                minesAroundCount: 0,
                isVisiable: false,
                isMarked: false,
                type: 'empty'
            })
        }
        board.push(row)
    }
    return board;
}

function buildBoard() {
    gBoard = createMat()
    for (var i = 0; i < gLevel.MINES; i++) {
        var cell = getEmptyCell()
        gBoard[cell.i][cell.j].type = 'mine'
        gLevel.minesLocations.push(cell);
    }

    for (var i = 0; i < gLevel.Size; i++) {
        for (var j = 0; j < gLevel.Size; j++) {
            cell = gBoard[i][j];
            buildNegs(gBoard, i, j)
        }
    }
}

function getEmptyCell() {
    var emptyCells = [];
    for (var i = 0; i < gLevel.Size; i++) {
        for (var j = 0; j < gLevel.Size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.type === 'empty') {
                var emptyCellPos = { i, j };
                emptyCells.push(emptyCellPos)
            }
        }
    }
    var randomIdx = getRandomInt(0, emptyCells.length)
    var emptyCell = emptyCells[randomIdx];
    return emptyCell;
}

function openNegs(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            if (cell !== mine) {
                // Update the Model:
                board[i][j].isVisible = true;
                console.log(gBoard[i][j], i, j)
                    // Update the Dom:
                var elCell = document.querySelector(`.cell-${i}-${j}`)

                elCell.classList.add('occupied');

            }
        }
    }

}

function openMines() {
    for (var i = 0; i < gLevel.minesLocations.length; i++) {
        var mine = gLevel.minesLocations[i];
        var elCell = document.querySelector(`.cell-${mine.i}-${mine.j}`)
        var strHTML = MINE;
        showCell(elCell, strHTML);
    }
}

function showCell(elCell, strHTML) {
    // console.log(elCell)
    elCell.innerText = strHTML;
    switch (strHTML) {
        case 1:
            elCell.style.color = 'blue'
            break;
        case 2:
            elCell.style.color = 'green'
            break;
        case 3:
            elCell.style.color = 'red'
            break;
        case 4:
            elCell.style.color = 'navy'
            break;
        case 5:
            elCell.style.color = 'maroon'
            break;
        case 6:
            elCell.style.color = 'mediumorchid'
            break;
        case 7:
            elCell.style.color = 'olive'
            break;
        case 8:
            elCell.style.color = 'orchid'
            break;
        case 9:
            elCell.style.color = 'pink'
            break;
    }
    elCell.classList.add('occupied');
}

function countNegs(cellI, cellJ, mat) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].type === 'mine') negsCount++;
        }
    }
    return negsCount;
}

function buildNegs(board, i, j) {
    board[i][j].minesAroundCount = countNegs(i, j, board);
    if (board[i][j].type !== 'mine' && board[i][j].minesAroundCount > 0) board[i][j].type = 'neg';
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function start() {
    gInterval = setInterval(time, 10);
    gGame.isOn = true;
    gGame.firstClick = false;
    gLevel.startTime = Date.now();
}

function stop() {
    clearInterval(gInterval);
}

function openModal(isVictory) {
    var elModal = document.querySelector('.modal');
    var elSpan = document.querySelector('.modal span')
    var elTimer = document.querySelector('.stopwatch')
    var elScore = document.querySelector('score-span')
    elTimer.style.display = 'none';
    elSpan.innerText = (isVictory) ? ' Winner' : ' Loser';
    elModal.style.display = 'block';
    var text = gTimeOut.hourOut + ':' + gTimeOut.minOut + ':' + gTimeOut.secOut + ':' + gTimeOut.miliSecOut
    elScore.innerText = text;
}

function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    var elTimer = document.querySelector('.stopwatch')
    elTimer.style.display = 'block';
    init();
}

function time() {
    /* Main Timer */


    gTimeOut.miliSecOut = checkTime(gTime.milisec);
    gTimeOut.secOut = checkTime(gTime.sec);
    gTimeOut.minOut = checkTime(gTime.min);
    gTimeOut.hourOut = checkTime(gTime.hour);

    gTime.milisec = ++gTime.milisec;

    if (gTime.milisec === 100) {
        gTime.milisec = 0;
        gTime.sec = ++gTime.sec;
    }

    if (gTime.sec == 60) {
        gTime.min = ++gTime.min;
        gTime.sec = 0;
    }

    if (gTime.min == 60) {
        gTime.min = 0;
        gTime.hour = ++gTime.hour;

    }
    document.getElementById("milisec").innerHTML = gTimeOut.miliSecOut;
    document.getElementById("sec").innerHTML = gTimeOut.secOut;
    document.getElementById("min").innerHTML = gTimeOut.minOut;
    document.getElementById("hour").innerHTML = gTimeOut.hourOut;


}


function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function resetTimer() {


    /*Reset*/

    gTime.milisec = 0;
    gTime.sec = 0;
    gTime.min = 0
    gTime.hour = 0;

    document.getElementById("milisec").innerHTML = "00";
    document.getElementById("sec").innerHTML = "00";
    document.getElementById("min").innerHTML = "00";
    document.getElementById("hour").innerHTML = "00";

}