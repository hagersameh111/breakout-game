export const sounds = {
    paddleHit: new Audio ("./assets/sounds/brick-paddle-hit.mp3"),
    brickHit: new Audio ("./assets/sounds/brick-paddle-hit.mp3"),
    gameOver: new Audio ('./assets/sounds/gameover.mp3'),
    loseLife: new Audio ('./assets/sounds/loselife.mp3'),
    bgMusic: new Audio ('./assets/sounds/bgmusic.mp3'),
};

// loop background music
sounds.bgMusic.loop = true;
sounds.bgMusic.volume = 0.3;

// function to play sound effects w/out overlapping
export function playSound(sound){
    sound.currentTime = 0; //rewind to start
    sound.play();
}