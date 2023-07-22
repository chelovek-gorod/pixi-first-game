import { AnimatedSprite, Texture, Container } from 'pixi.js' /* , filters */
import { ColorMatrixFilter } from '@pixi/filter-color-matrix'
import appConstants from '../common/constants'
import { play } from '../common/sound'
import { randomIntFromInterval, destroySprite } from '../common/utils'

let app
let bullets
let timeout

const bulletTypes = ['Bullet_Sequence1', 'Bullet_Sequence2']

const bulletSpeed = 1

const allTextures = {}

export const initBullets = ( currApp, root ) => {
    bullets = new Container()
    bullets.name = appConstants.containers.bullets
    app = currApp
    return bullets
}

export const clearBullets = () => {
    bullets.children.forEach( (bullet) => {
        destroySprite( bullet )
    })
}

export const addBullet = (position) => {
    if (timeout) {
        play( appConstants.sounds.miss )
        return
    }

    const bulletType = bulletTypes[ randomIntFromInterval( 0, bulletTypes.length - 1 ) ]
    let textures = []

    if ( allTextures[bulletType] ) {
        textures = allTextures[bulletType]
    }
    else {
        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`${bulletType} ${i + 1}.png`)
            textures.push(texture)
            allTextures[bulletType] = textures
        } 
    }

    const bullet = new AnimatedSprite(textures)
    const filter = new ColorMatrixFilter()
    bullet.loop = false
    const { matrix } = filter
    matrix[1] = Math.sin( Math.random() * 10 )
    matrix[2] = Math.cos( Math.random() * 10 )
    matrix[3] = Math.cos( Math.random() * 10 )
    matrix[4] = Math.sin( Math.random() * 10 )
    matrix[5] = Math.sin( Math.random() * 10 )
    matrix[6] = Math.sin( Math.random() * 10 )
    bullet.filters = [filter]
    bullet.animationSpeed = 0.2
    bullet.anchor.set( 0.5 )
    bullet.position.set( position.x, position.y - 10 )
    bullet.destroyMe = function() {
        destroySprite(this)
    }
    bullets.addChild(bullet)
    bullet.play()
    play( appConstants.sounds.shut )

    timeout = setTimeout( () => {
        timeout = null
    }, appConstants.timeouts.playerShoots)
}

export const bulletTick = () => {
    bullets.children.forEach( (bullet) => {
        bullet.position.y -= bulletSpeed * 2
        if ( bullet.position.y < 0) destroySprite( bullet )
    })
}