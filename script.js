

const offsetFromDate = new Date(2022, 2, 9)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
var namePlayer = targetWords[Math.floor(dayOffset)];
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;
let statsPlayer = namePlayer[1];
let trys = 1;
let finished = false;

    createTiles();
    checkStorage();
    showStats();
    

function createTiles(){
    const amount = namePlayer[0].length;
    document.querySelector('.guess-grid').style.gridTemplateColumns = 'repeat('+amount+', 4em)';
    for(let i = 1; i <= amount; i++){
        console.log(i)
        document.querySelector('[data-guess-grid]').innerHTML += '<div class="tile" ></div>';
    }
}

function showStats(){
    const statsContainer = document.querySelector('[data-player]');
    const statsBody = statsContainer.querySelector('.player-stats-body')
    statsBody.innerHTML += '<span><b>2021 Season: </b></span>'
    statsPlayer.forEach((element, index, array) => {
        statsBody.innerHTML += `<span>${element}</span> `;
    })
}

function checkStorage(){
    if(!localStorage.getItem('trys')) {
        localStorage.setItem('trys', trys)
        console.log(localStorage.getItem('trys'));
        startInteraction()
        return
    }
    if(Number(localStorage.getItem('trys')) <= 3){
        console.log(localStorage.getItem('trys'));
        console.log('You can try again', localStorage.getItem('trys'));
        startInteraction()
    }
    else if(Number(localStorage.getItem('trys')) == 6){
        console.log(localStorage.getItem('trys'));
        showAlert('You already won, try your skills again tomorrow', null)
    }
    else{
        console.log(localStorage.getItem('trys'));
        showAlert('You already played 3 times, try again tomorrow', null)
    }
}


function startInteraction() {
    document.addEventListener('click', handleMouseClick);
    document.addEventListener('keydown', handleKeyPress);
}

function removeInteraction(){
   
        document.removeEventListener('click', handleMouseClick);
        document.removeEventListener('keydown', handleKeyPress);

}

function handleKeyPress(e) {
    if(e.key == ' '){
        spaceKey()
        return
    }
    if(e.key == 'Enter'){
        submitGuess()
        return
    }
    if(e.key == 'Backspace' || e.key == 'Delete'){
        deleteKey()
        return
    }
    if(e.key.match(/^[a-z]$/)){
        pressKey(e.key)
        return
    }

}

function handleMouseClick(e) {
    console.log(e.target)
    if(e.target.matches('[data-space]')){
        spaceKey()
        return 
    }
    if(e.target.matches('[data-key]')){
        pressKey(e.target.dataset.key);
        return 
    }
    if(e.target.matches('[data-enter]')) {
        submitGuess();
        return
    }
    if(e.target.matches('[data-delete]')){
        deleteKey()
        return
    }

}

function pressKey(key) {
    const activeTiles = getActiveTiles()
    if(activeTiles.length >= namePlayer[0].length) return
    const guessGrid = document.querySelector('.guess-grid');
    const nextTile = guessGrid.querySelector(':not([data-letter])');
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = 'active'
}
function spaceKey() {
    const activeTiles = getActiveTiles()
    if(activeTiles.length >= namePlayer[0].length) return
    const guessGrid = document.querySelector('.guess-grid');
    const nextTile = guessGrid.querySelector(':not([data-letter])');
    nextTile.dataset.letter = ' ';
    nextTile.textContent = ' ';
    nextTile.dataset.state = 'active'
    nextTile.classList.add('spaceTile');
}
function deleteKey(){
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length -1]
    if (lastTile==null) return
    lastTile.textContent = '';
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}

function submitGuess() {
    const activeTiles = [...getActiveTiles()]

    
        if (activeTiles.length !== namePlayer[0].length && finished==false){
            showAlert('Not enough letters')
            shakeTiles(activeTiles)
            return
        }

        const guess = activeTiles.reduce((word, tile) => {
            return word + tile.dataset.letter
        }, "")


       tryAgain()
       
        activeTiles.forEach((...params) => {
            flipTiles(...params,guess)

            
        });
    



}
function flipTiles(tile, index, array, guess) {
    const keyboard = document.querySelector('[data-keyboard]')
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    
    setTimeout(() => {
        tile.classList.add('flip')
    }, index * FLIP_ANIMATION_DURATION / 2) 
    tile.addEventListener('transitionend', () => {
        
            tile.classList.remove('flip')
            tile.classList.remove('spaceTile')
            if (namePlayer[0][index].toLocaleLowerCase() == letter){
                tile.dataset.state = 'correct'
                key.classList.add('correct')
            }
            else if (namePlayer[0].toLocaleLowerCase().includes(letter)){
                tile.dataset.state = 'wrong-location'
                key.classList.add('wrong-location')
            }
            else{
                tile.dataset.state = 'wrong'
                key.classList.add('wrong')
            }
        
            if(index == array.length - 1){
        
                checkWinLose(guess, array)
            }
        
    }, {once: true})
}

function getActiveTiles(){
    const guessGrid = document.querySelector('.guess-grid');
    return guessGrid.querySelectorAll('[data-state="active"]')
}
function getAllTiles(){
    const guessGrid = document.querySelector('.guess-grid');
    return guessGrid.querySelectorAll('[data-state]')
}

function showAlert(message, duration = 1000) {
    const alertContainer = document.querySelector('[data-alert-container]')
    const alert = document.createElement('div')
    alert.textContent = message
    alert.classList.add('alert')
    alertContainer.prepend(alert)
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add('hide')
        alert.addEventListener('transitionend', () => {
            alert.remove()
        })
    }, duration)
}

function shakeTiles(tiles){
    tiles.forEach(tile => {
        tile.classList.add('shake')
        tile.addEventListener('animationend', () => {
            tile.classList.remove('shake')
        }, { once: true })
    })
}

function checkWinLose(guess, tiles) {
    localStorage.setItem('trys', Number(localStorage.getItem('trys')) + 1);
        console.log(Number(localStorage.getItem('trys')))
    if (guess == namePlayer[0].toLocaleLowerCase()){
        showAlert('You got it! The player is '+namePlayer[0], 5000)
        danceTiles(tiles)
        localStorage.setItem('trys',6);
        removeInteraction()
        return
    }
    else if (guess != namePlayer[0].toLocaleLowerCase()){
        if(Number(localStorage.getItem('trys')) > 3){
            showAlert('You already played 3 times, try again tomorrow', null)
            showAlert('You lose!', null)
            
        }
        else{
        showAlert('Try again by pressing Enter', null)
        showAlert('You lose!', null)
        }
            finished=true;
            startInteraction()
    }
}

function danceTiles(tiles){
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('dance')
            tile.addEventListener('animationend', () => {
                tile.classList.remove('dance')
            }, { once: true })
        }, index * DANCE_ANIMATION_DURATION / 5)

    })
}
function tryAgain(){
    var AllTiles = [...getAllTiles()]
   
    if(Number(localStorage.getItem('trys')) <= 3 && finished==true) {
                AllTiles.forEach((tile, index) => {
                tile.classList.remove('wrong')
                tile.classList.remove('correct')
                tile.classList.remove('wrong-location')
                delete tile.dataset.letter
                tile.textContent = '';
                delete tile.dataset.state
            });
            document.querySelector('[data-alert-container]').innerHTML=''
            finished=false;

        
        
    }
    else{

        
        removeInteraction()
        return
    }
}



