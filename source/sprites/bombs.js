import { Sprite, Container } from 'pixi.js'
import { getTexture } from '../common/assets'
import appConstants from '../common/constants'
import { allTextureKeys } from '../common/textures'
import { addExplosion } from './explosions'
import { destroySprite } from '../common/utils'
import { explosionBomb } from '../common/eventHub'

let app
let bombs
let rootContainer

const bombSpeed = 1

export const initBombs = ( currApp, root ) => {
    bombs = new Container()
    bombs.name = appConstants.containers.bombs
    app = currApp
    rootContainer = root
    return bombs
}

export const clearBombs = () => {
    bombs.children.forEach( (bomb) => {
        destroySprite( bomb )
    })
}

export const addBomb = ( position ) => {
    const bomb = new Sprite( getTexture(allTextureKeys.bomb) )
    bomb.scale.set( 0.3 )
    bomb.anchor.set( 0.5 )
    bomb.position.set(position.x, position.y)
    bomb.rotation = Math.PI
    bomb.destroyMe = function() {
        addExplosion( {x: this.position.x, y: this.position.y} )
        explosionBomb()
        destroySprite(this)
    }
    bombs.addChild( bomb )
}

export const bombTick = () => {
    bombs.children.forEach( ( bomb ) => {
        bomb.position.y += bombSpeed * 2
        if ( bomb.position.y > appConstants.size.HEIGHT) destroySprite( bomb )
    })
}