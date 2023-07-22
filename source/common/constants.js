const viewWidth = window.innerWidth ? window.innerWidth : 800
const viewHeight = window.innerHeight ? window.innerHeight : 600

const peopleGap = (29 + 10)
const people = Math.floor(viewWidth / peopleGap)
const peopleStartX = 15 + Math.floor( (viewWidth - (people * peopleGap) ) / 2)

console.log('people:', people, '; peopleStartX:', peopleStartX)

const appConstants = {
    size: {
        WIDTH: viewWidth,
        HEIGHT: viewHeight,
    },
    containers: {
        player: 'player',
        bullets: 'bullets',
        people: 'people',
        enemies: 'enemies',
        bombs: 'bombs',
        explosions: 'explosions',
        infoPanel: 'infoPanel',
    },
    timeouts: {
        playerLock: 2000,
        playerShoots: 1000,
        addNewEnemy: 1000,
    },
    count: {
        peopleGap: peopleGap,
        people: people,
        peopleStartX: peopleStartX,
    },
    probability: {
        enemyChangeDirection: 0.01,
        bomb: 0.05,
    },
    events: {
        startGame: 'startGame',
        updateInfo: 'updateInfo',
        deleteUFO: 'deleteUFO',
        killPerson: 'killPerson',
        explosionBomb: 'explosionBomb',
        playerWin: 'playerWin',
        gameOver: 'gameOver',
        restartGame: 'restartGame',
    },
    sounds: {
        shut: 'shut',
        miss: 'miss',
        explosion: 'explosion',
        gameOver: 'gameOver',
        playerWin: 'playerWin',
        background: 'background',
    },
}

export default appConstants