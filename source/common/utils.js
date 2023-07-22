export const randomIntFromInterval = (min, max) => min + Math.floor( Math.random() * (max - min + 1) )

export const checkCollision = (object1, object2) => {
    if (!object1 || !object2) return false
    
    const bounds1 = object1.getBounds()
    const bounds2 = object2.getBounds()

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.y < bounds2.y + bounds2.height
        && bounds2.x < bounds1.x + bounds1.width
        && bounds2.y < bounds1.y + bounds1.height
}

export const destroySprite = ( sprite ) => {
    sprite.parent.removeChild( sprite )
    sprite.destroy( {children : true} )
}