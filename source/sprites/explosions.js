import { Container, Texture, AnimatedSprite } from 'pixi.js'
import appConstants from '../common/constants'
import { play } from '../common/sound'
import { randomIntFromInterval, destroySprite } from '../common/utils'

let app
let explosions
let rootContainer

const explosionTypes = ['Explosion_Sequence', 'Explosion_Sequence1', 'Explosion_Sequence2', 'Explosion_Sequence3']

const explosionTextures = {}

export const initExplosions = (currApp, root) => {
    explosions = new Container()
    explosions.name = appConstants.containers.explosions
    app = currApp
    rootContainer = root
    return explosions
}

export const addExplosion = ( position ) => {
    const explosionType = explosionTypes[ randomIntFromInterval( 0, explosionTypes.length - 1 ) ]
    let textures
    if (explosionTextures[explosionType]) {
        textures = explosionTextures[explosionType]
    }
    else {
        textures = []
        for(let i = 0; i < 12; i++) {
            const texture = Texture.from(`${explosionType} ${i + 1}.png`)
            textures.push(texture)
        }
        explosionTextures[explosionType] = textures
    }

    const explosion = new AnimatedSprite(textures)
    explosion.loop = false
    explosion.animationSpeed = 0.3
    explosion.anchor.set( 0.5 )
    explosion.position.set( position.x, position.y )
    explosion.rotation = Math.random() * (Math.PI * 2)
    explosions.addChild(explosion)
    explosion.play()
    play( appConstants.sounds.explosion )
}

export const explosionTick = () => {
    explosions.children.forEach( ( explosion ) => {
        if ( !explosion.playing ) destroySprite( explosion )
    })
}