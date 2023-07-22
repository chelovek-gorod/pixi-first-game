import { Sprite } from 'pixi.js'
import { getTexture } from '../common/assets'
import appConstants from '../common/constants'
import { allTextureKeys } from '../common/textures'
import { addBullet } from './bullets'

let player
let app
let lockTimeout

export const addPlayer = (currApp, root) => {
    if ( player ) return player

    app = currApp
    player = new Sprite( getTexture( allTextureKeys.spaceShip ) )
    player.name = appConstants.containers.player
    player.scale.set(0.3)
    player.anchor.set(0.5)
    player.position.x = appConstants.size.WIDTH / 2
    player.position.y = appConstants.size.HEIGHT - 200
    return player
}

export const getPlayer = () => player

export const lockPlayer = () => {
    if ( lockTimeout ) return

    player.isLocked = true
    lockTimeout = setTimeout( () => {
        lockTimeout = null
        player.isLocked = false
    }, appConstants.timeouts.playerLock )
}

export const playerShoots = () => {
    if ( !player.isLocked ) {
        addBullet({x: player.position.x, y: player.position.y})
    }
}

export const playerTick = (state) => {
    if ( player.isLocked ) player.alpha = 0.5
    else player.alpha = 1

    const playerPosition = player.position.x
    player.position.x = state.mousePosition
    if (player.position.x < playerPosition) {
        if (player.rotation > -0.3) player.rotation -= 0.02
    }
    else if (player.position.x > playerPosition) {
        if (player.rotation < 0.3) player.rotation += 0.02
    }
    else {
        if (player.rotation > 0) player.rotation -= 0.02
        else if (player.rotation < 0) player.rotation += 0.02
        else player.rotation = 0
    }
}