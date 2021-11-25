'use strict'

function minesAmount() {
    var minesCount = 0;
    switch (gBoardSize) {
        case 16:
            minesCount = 2;
            break;
        case 64:
            minesCount = 12;
            break;
        case 144:
            minesCount = 30;
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
    return board
}

function buildBoard() {
    gBoard = createMat()
    for (var i = 0; i < gLevel.MINES; i++) {
        var cell = getEmptyCell()
        gBoard[cell.i][cell.j].type = 'mine'
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

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function showCell(elCell, strHTML) {
    elCell.innerText = strHTML;
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
    if (!gGame.isOn) return;
    gInterval = setInterval(time, 10);
}

function stop() {
    clearInterval(gInterval);
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