const btns = document.querySelectorAll('button');
const container = document.querySelector('#container');
let area;
let firstBlock;
let size;
let mines;
let isFirstClick = true;
let camp = [];

btns.forEach(btn => btn.addEventListener('click', startGame))

function changeDisplay(para){
    if(para.textContent != 0){
        para.style.display = 'initial';
        if(para.textContent < 0){
            para.style.backgroundImage = 'url("https://www.flaticon.com/svg/static/icons/svg/978/978623.svg")';
            para.textContent = '';
        }
    }
}

function move(){
    let area = Array.from(document.querySelectorAll('.tile'));
    let index = area.indexOf(this);
    let para = this.children[0];
    if(isFirstClick){
        isFirstClick = false;
        firstBlock = this;
        putBomb(size[0] * size[1], mines);
    }
    changeDisplay(para);
    if(camp[index] === 0){
        clickZero(index);
    }
    this.classList.add('open');
}


function getOpenArea(index){
    if(index[0] < 0 || index[0] > (size[0] - 1) || index[1] < 0 || index[1] > (size[1] - 1)){
        return;
    }
    else if(camp[index[0] * size[0] + index[1]] != 0){
        area[index[0] * size[0] + index[1]].classList.add('open');
        area[index[0] * size[0] + index[1]].children[0].style.display = 'initial';
        return;
    }
    else if(camp[index[0] * size[0] + index[1]] == 0){
        area[index[0] * size[0] + index[1]].classList.add('open');
    }
    getOpenArea([index[0], (index[1] + 1)]);
}

function clickZero(index){
    area = Array.from(document.querySelectorAll('.tile'));
    let i = Math.floor(index / size[0]);
    let j = index % size[1];
    getOpenArea([i, j]);
}

function isBomb(){

}

function increaseNumber(row, column){
    for(let i = row-1; i <= row + 1; i++){
        for(let j = column - 1; j <= column + 1; j++){
            if(i > -1 && i < size[0] && j > -1 && j < size[1]){
                if(camp[i * size[0] + j] === -1){
                    camp[row * size[0] + column]++;
                }
            }
        }
    }
}

function contBomb(){
    for(let i = 0; i < size[0]; i++){
        for(let j = 0; j < size[1]; j++){
            if(camp[i * size[0] + j] !== -1){
                increaseNumber(i, j);
            }
        }
    } 
}

function putBomb(sizeCamp, numberMines){
    let tiles = document.querySelectorAll('.tile');
    for(let i = 0; i < numberMines; i++){
        let bombPlace = Math.floor(Math.random() * sizeCamp);
        if(camp[bombPlace] === -1 || tiles[bombPlace] === firstBlock){
            i--;
        }
        else{
            tiles[bombPlace].style.color = 'red';
            camp[bombPlace] = -1;
        }
    }
    contBomb();
    for(let i = 0; i < size[0]**2; i++){
        tiles[i].children[0].textContent = camp[i];
    }
}

function startGame(){
    let grid = this.firstChild.textContent.split('x');
    let columns = '';
    let rows = '';
    grid = Array.from(grid);
    let quantityMines = Array.from(this.lastChild.textContent).filter(number =>{
        if(number.match(/[0-9]/g)){
            return number;
        }
    });
    quantityMines = +quantityMines.join('');
    mines = quantityMines;
    size = grid;
    btns.forEach(btn => btn.style.display = 'none');
    container.style.display = 'grid';
    for(let i = 0; i < grid[0]; i++){
        columns += '1fr ';
    }
    for(let i = 0; i < grid[1]; i++){
        rows += '1fr ';
    }
    for(let i = 0; i < grid[0] * grid[1]; i++){
        camp.push(0);
        let tile = document.createElement('div');
        let para = document.createElement('p');
        tile.classList.add('tile');
        tile.appendChild(para);
        tile.addEventListener('click', move);
        container.appendChild(tile);
    }
    container.style.gridTemplateColumns = columns;
    container.style.gridTemplateRows = rows;
}