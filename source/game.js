import * as PIXI from 'pixi.js'
import { loadAssets, getTexture } from './common/assets'
import { allTextureKeys } from "./common/textures"
import appConstants from './common/constants'
import { addPlayer, getPlayer, lockPlayer, playerShoots, playerTick } from './sprites/player'
import { bulletTick, clearBullets, initBullets } from './sprites/bullets'
import { initPeople, peopleTick, restorePeople } from './sprites/people'
import { initEnemies, addEnemy, enemyTick } from './sprites/enemy'
import { initBombs, bombTick, clearBombs } from './sprites/bombs'
import { checkCollision } from './common/utils'
import { initExplosions, explosionTick } from './sprites/explosions'
import { initInfo } from './sprites/infoPanel'
import { EventHub } from './common/eventHub'
import { play } from './common/sound'
import { getStart, getGameOver, getPlayerWin } from './sprites/messages'

const WIDTH = appConstants.size.WIDTH
const HEIGHT = appConstants.size.HEIGHT

const gameState = {
    isActive: true,
    app: null
}

let rootContainer

const createScene = () => {
    const app = new PIXI.Application({
        background: '#000000',
        antialias: 'true', /* сглаживание */
        width: WIDTH,
        height: HEIGHT,
    })

    document.body.append( app.view )
    gameState.app = app

    rootContainer = app.stage
    rootContainer.eventMode = 'static'

    rootContainer.hitArea = app.screen

    const background = new PIXI.Sprite( getTexture( allTextureKeys.background ) )
    background.anchor.set( 0.5 )
    background.name = 'background'
    background.x = appConstants.size.WIDTH / 2
    background.y = appConstants.size.HEIGHT / 2
    rootContainer.addChild( background )

    const bullets = initBullets( app, rootContainer )
    rootContainer.addChild( bullets )

    const player = addPlayer( app, rootContainer )
    rootContainer.addChild( player )

    const people = initPeople( app, rootContainer )
    restorePeople()
    rootContainer.addChild( people )

    const enemies = initEnemies( app, rootContainer )
    addEnemy()
    rootContainer.addChild( enemies )

    const bombs = initBombs( app, rootContainer )
    rootContainer.addChild( bombs )

    const explosions = initExplosions( app, rootContainer )
    rootContainer.addChild( explosions )

    const infoPanel = initInfo( app, rootContainer )
    rootContainer.addChild( infoPanel )

    return app
}

const checkAllCollisions = () => {
    const enemies = rootContainer.getChildByName( appConstants.containers.enemies )
    const bullets = rootContainer.getChildByName( appConstants.containers.bullets )
    const bombs = rootContainer.getChildByName( appConstants.containers.bombs )
    const people = rootContainer.getChildByName( appConstants.containers.people )
    const player = rootContainer.getChildByName( appConstants.containers.player )

    let spritesToDestroy

    if ( enemies && bullets ) {
        spritesToDestroy = []

        bullets.children.forEach( ( bullet ) => {
            enemies.children.forEach( ( enemy ) => {
                if ( checkCollision( bullet, enemy ) ) {
                    if ( spritesToDestroy.indexOf( bullet ) === -1 ) spritesToDestroy.push( bullet )
                    if ( spritesToDestroy.indexOf( enemy ) === -1 ) spritesToDestroy.push( enemy )
                }
            })
        })

        spritesToDestroy.forEach( (sprite) => {
            sprite.destroyMe()
        })
    }

    if ( bombs && bullets ) {
        spritesToDestroy = []

        bullets.children.forEach( ( bullet ) => {
            bombs.children.forEach( ( bomb ) => {
                if ( checkCollision( bullet, bomb ) ) {
                    if ( spritesToDestroy.indexOf( bullet ) === -1 ) spritesToDestroy.push( bullet )
                    if ( spritesToDestroy.indexOf( bomb ) === -1 ) spritesToDestroy.push( bomb )
                }
            })
        })

        spritesToDestroy.forEach( (sprite) => {
            sprite.destroyMe()
        })
    }

    if ( !player.isLocked && bombs && player ) {
        bombs.children.forEach( ( bomb ) => {
            if ( checkCollision( player, bomb ) ) {
                lockPlayer()
                bomb.destroyMe()
            }
        })
    }

    if ( bombs && people ) {
        spritesToDestroy = []

        people.children.forEach( ( person ) => {
            bombs.children.forEach( ( bomb ) => {
                if ( checkCollision( person, bomb ) ) {
                    if ( spritesToDestroy.indexOf( person ) === -1 ) spritesToDestroy.push( person )
                    if ( spritesToDestroy.indexOf( bomb ) === -1 ) spritesToDestroy.push( bomb )
                }
            })
        })

        spritesToDestroy.forEach( (sprite) => {
            sprite.destroyMe()
        })
    }
}

const initInteraction = () => {
    gameState.mousePosition = getPlayer().position.x

    gameState.app.stage.addEventListener("pointermove", ( event ) => {
        gameState.mousePosition = event.global.x
    })

    document.addEventListener("keydown", ( event ) => {
        if (event.code === 'Space') playerShoots()
    })

    gameState.app.ticker.add( (delta) => {
        playerTick(gameState)
        bulletTick()
        peopleTick()
        enemyTick()
        bombTick()
        checkAllCollisions()
        explosionTick()
    })
}

export const initGame = () => {

    loadAssets( (progress) => {
        if( progress === 'done') {
            createScene()
            rootContainer.addChild( getStart( rootContainer ) )
        } else {
            console.log('progress:', (progress * 100).toFixed() )
        }
    })
}

const restartGame = () => {
    clearBombs()
    clearBullets()
    restorePeople()
}

EventHub.on( appConstants.events.startGame, ( event ) => {
    initInteraction()
})

EventHub.on( appConstants.events.playerWin, () => {
    gameState.app.ticker.stop()
    rootContainer.addChild( getPlayerWin( rootContainer ) )
    setTimeout( () => {
        play( appConstants.sounds.playerWin )
    }, 300 )
})

EventHub.on( appConstants.events.gameOver, () => {
    gameState.app.ticker.stop()
    rootContainer.addChild( getGameOver( rootContainer ) )
    setTimeout( () => {
        play( appConstants.sounds.gameOver )
    }, 300 )
})

EventHub.on( appConstants.events.restartGame, ( event ) => {
    restartGame()
    gameState.app.ticker.start()
})