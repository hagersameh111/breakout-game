

const topScoreEl = document.getElementById('topScore');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

const config = {
    pointsPerBrick: 10,
    startingLives: 3,
    localStorageKey: 'breakout-game'
};

const state = {
    score: 0,
    lives: config.startingLives,
    topScore: localStorage.getItem(config.localStorageKey)

}

function saveTopScore() {
    localStorage.setItem(config.localStorageKey, state.topScore);

}

function loadTopScore() {
    topScoreEl.textContent = localStorage.getItem(config.localStorageKey);
}

function resetState() {
    state.score = 0;
    state.lives = config.startingLives;
    state.topScore = localStorage.getItem(config.localStorageKey) || 0;
    updateState();
}

function updateState() {
    scoreEl.textContent = state.score;
    livesEl.textContent = state.lives;
    // topScoreEl.textContent = localStorage.getItem(config.localStorageKey);

    

    if (state.score > state.topScore) {
    state.topScore = state.score;
    saveTopScore();
    topScoreEl.textContent = state.topScore;
}
``
}

export { config, state, updateState, loadTopScore, saveTopScore }