const btns = document.querySelectorAll('button');
const container = document.querySelector('#container');
const body = document.querySelector('body');
let flags = 0;
let interval;
let time = [0, 0];
let firstBlock;
let size;
let mines;
let isFirstClick = true;
let camp = [];

btns.forEach(btn => btn.addEventListener('click', startGame));

function reset(){
    let items = Array.from(container.children);
    items.forEach(item => {
        if(item.classList.contains('won') || item.classList.contains('end')){
            container.removeChild(item);
        }
    });
    
    let menu = document.querySelector('#menu');
    menu.style.display = 'none';

    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach(tile => container.removeChild(tile));

    let restart = document.querySelector('.restart');
    restart.removeEventListener('click', putWindow);

    let dificulty = document.querySelector('.dificulty');
    dificulty.removeEventListener('click', changeDificulty);

    window.clearInterval(interval);

    btns.forEach(btn => btn.style.display = 'initial');
    isFirstClick = true;
    camp = [];
    time = [0, 0];
    flags = 0;
}

function changeDificulty(){
    reset();

    container.style.display = 'flex';
    container.style.width =  '85vh';
    container.style.height =  '85vh';
    container.style.margin = 'auto 0';

    let timer = document.querySelectorAll('.timer');
    timer[1].textContent = '00:00';
}

function restartGame(){
    let h1 = container.lastChild;
    container.removeChild(h1);
    let tiles = Array.from(document.querySelectorAll('.tile'));
    let window = document.querySelector('.window');
    let numberFlags = document.querySelector('.flags');
    tiles.forEach(tile => container.removeChild(tile));
    isFirstClick = true;
    camp = [];
    makeGrid(size);
    time = [0, 0];
    flags = 0;
    numberFlags.textContent = `${flags}/${mines}`;
    window.style.display = 'none';
}

function putWindow(){
    let window = document.querySelector('.window');
    let yes = document.querySelector('.yes');
    let no = document.querySelector('.no');
    yes.addEventListener('click', restartGame);
    no.onclick = () => window.style.display = 'none';
    window.style.display = 'flex';
}

function getWinner(){
    if(container.lastChild.tagName == 'H1'){
        return;
    }
    let count = 0;
    let tiles = document.querySelectorAll('.tile');
    for(let i = 0; i < tiles.length; i++){
        if(!tiles[i].classList.contains('open')){
            count++;
        }
    }
    if(count == mines){
        tiles.forEach(tile => {
            tile.removeEventListener('click', click);
            tile.removeEventListener('mousedown', putFlag);
        });
        clearInterval(interval);
        let h1 = document.createElement('h1');
        h1.classList.add('won');
        h1.textContent = 'You Won!';
        h1.style.width = `${container.offsetWidth}px`;
        h1.style.left = `${container.offsetLeft}px`;
        container.appendChild(h1);
    }
} 

function changeDisplay(para){
    if(para.textContent != 0){
        para.style.display = 'initial';
        if(para.textContent < 0){
            para.style.backgroundImage = 'url("https://www.flaticon.com/svg/static/icons/svg/978/978623.svg")';
            para.textContent = '';
        }
    }
}

function putFlag(e){
    let numberFlags = document.querySelector('.flags')
    if(e.which === 3 && !this.classList.contains('open')){
        if(this.classList.contains('flag')){
            flags--;
            numberFlags.textContent = `${flags}/${mines}`;
            this.addEventListener('click', click);
            this.classList.remove('flag');
        }
        else{
            flags++;
            numberFlags.textContent = `${flags}/${mines}`;
            this.classList.add('flag');
            this.removeEventListener('click', click);
        }
    }
}

function openRange(index, area){
    let row = Math.floor(index / size[0]);
    let column = index % size[0];
    for(let i = row - 1; i < row + 2; i++){
        for(let j = column - 1; j < column + 2; j++){
            if(i >= 0 && i < size[1] && j >= 0 && j < size[0]){
                if(!area[i * size[0] + j].classList.contains('flag')){
                    let para = area[i * size[0] + j].children[0];
                    changeDisplay(para);
                    if(camp[i * size[0] + j] === 0){
                        clickZero([i * size[0] + j]);
                    }
                    else if(camp[i * size[0] + j] === -1){
                        isBomb();
                    }
                    area[i * size[0] + j].classList.add('open');
                }
            }
        }
    }
}

function checkFlag(tile){
    let count = 0;
    let number = tile.textContent
    let area = Array.from(document.querySelectorAll('.tile'));
    let index = area.indexOf(tile);
    let row = Math.floor(index / size[0]);
    let column = index % size[0];
    for(let i = row - 1; i < row + 2; i++){
        for(let j = column - 1; j < column + 2; j++){
            if(i >= 0 && i < size[1] && j >= 0 && j < size[0]){
                if(area[i * size[0] + j].classList.contains('flag')){
                    count++;
                }
            }
        }
    }
    if(count == number){
        openRange(index, area);
    }
    getWinner();
}

function click(){
    let area = Array.from(document.querySelectorAll('.tile'));
    let index = area.indexOf(this);
    let para = this.children[0];
    if(isFirstClick){
        isFirstClick = false;
        firstBlock = this;
        interval = setInterval(timer, 1000);
        putBomb(size[0] * size[1], mines);
    }
    getWinner();
    if(!this.classList.contains('open')){
        changeDisplay(para);
        if(camp[index] === 0){
            clickZero(index);
        }
        else if(camp[index] === -1){
            isBomb();
        }
        this.classList.add('open');
    }
    else{
        checkFlag(this);
    }
}

function openArea(index){
    let tiles = document.querySelectorAll('.tile');
    if(index[0] < 0 || index[0] >= size[1] || index[1] < 0 || index[1] >= size[0]){
        return;
    }
    if(tiles[index[0] * size[0] + index[1]].classList.contains('open')){
        return;
    }
    if(camp[index[0] * size[0] + index[1]] > 0){
        if(tiles[index[0] * size[0] + index[1]].classList.contains('flag')){
            return;
        }
        tiles[index[0] * size[0] + index[1]].classList.add('open');
        tiles[index[0] * size[0] + index[1]].children[0].style.display = 'initial';
        return;
    }
    if(!tiles[index[0] * size[0] + index[1]].classList.contains('flag')){
        tiles[index[0] * size[0] + index[1]].classList.add('open');
    }

    // X and Y

    openArea([index[0], (index[1] + 1)]);
    openArea([index[0], (index[1] - 1)]);
    openArea([(index[0] + 1), index[1]]);
    openArea([(index[0] - 1), index[1]]);

    // Diagonals

    openArea([(index[0] - 1), (index[1] + 1)]);
    openArea([(index[0] - 1), (index[1] - 1)]);
    openArea([(index[0] + 1), (index[1] + 1)]);
    openArea([(index[0] + 1), (index[1] - 1)]);
}

function clickZero(index){
    let i = Math.floor(index / size[0]);
    let j = index % size[0];
    openArea([i, j]);
    getWinner();
}

function isBomb(){
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach(tile => {
        tile.removeEventListener('click', click);
        tile.removeEventListener('mousedown', putFlag);
    });
    clearInterval(interval);
    let h1 = document.createElement('h1');
    h1.classList.add('end');
    h1.textContent = 'You lose!';
    h1.style.width = `${container.offsetWidth}px`;
    h1.style.left = `${container.offsetLeft}px`;
    container.appendChild(h1);
}

function increaseNumber(row, column){
    for(let i = row-1; i <= row + 1; i++){
        for(let j = column - 1; j <= column + 1; j++){
            if(i > -1 && i < size[1] && j > -1 && j < size[0]){
                if(camp[i * size[0] + j] === -1){
                    camp[row * size[0] + column]++;
                }
            }
        }
    }
}

function contBomb(){
    for(let i = 0; i < size[1]; i++){
        for(let j = 0; j < size[0]; j++){
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
    for(let i = 0; i < size[0] * size[1]; i++){
        tiles[i].children[0].textContent = camp[i];
    }
}

function timer(){
    let paragraph = document.querySelectorAll('.timer');
    if(time[1] >= 59){
        time[0]++;
        time[1] = 0;
    }
    else{
        time[1]++;
    }
    if(time[1] < 10 && time[0] < 10){
        paragraph[1].textContent = `0${time[0]}:0${time[1]}`;
    }
    else if(time[0] < 10 && time[1] > 10){
        paragraph[1].textContent = `0${time[0]}:${time[1]}`;
    }
    else if(time[0] > 10 && time[1] < 10){
        paragraph[1].textContent = `${time[0]}:0${time[1]}`;
    }
    else{
        paragraph[1].textContent = `${time[0]}:${time[1]}`;
    }
}

function makeGrid(grid){
    let columns = '';
    let rows = '';
    let fontSize = '3rem';
    container.style.display = 'grid';
    for(let i = 0; i < grid[0]; i++){
        columns += '1fr ';
    }
    for(let i = 0; i < grid[1]; i++){
        rows += '1fr ';
    }
    if(size[0] > size[1]){
        container.style.width = '80vw';
        container.style.margin = 'auto 0 auto -16vw';
        fontSize = '1.5rem';
    }
    else if(size[0] == 16){
        fontSize = '2rem';
    }
    for(let i = 0; i < grid[0] * grid[1]; i++){
        camp.push(0);
        let tile = document.createElement('div');
        let para = document.createElement('p');
        tile.classList.add('tile');
        tile.appendChild(para);
        tile.style.fontSize = fontSize;
        tile.addEventListener('click', click);
        tile.addEventListener('mousedown', putFlag);
        tile.addEventListener('contextmenu', e => e.preventDefault());
        container.appendChild(tile);
    }
    container.style.gridTemplateColumns = columns;
    container.style.gridTemplateRows = rows;
}

function startGame(){
    let restart = document.querySelector('.restart');
    restart.addEventListener('click', putWindow);

    let dificulty = document.querySelector('.dificulty');
    dificulty.addEventListener('click', changeDificulty);

    let menu = document.querySelector('#menu');
    menu.style.display = 'flex';

    let grid = this.firstChild.textContent.split('x');
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
    makeGrid(grid);
    let numberFlags = document.querySelector('.flags');
    numberFlags.textContent = `${flags}/${mines}`;
}