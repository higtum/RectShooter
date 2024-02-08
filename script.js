// Gets the HTML elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
//-----------------------------------------------------------------------------------------

// Sets the variables for the game
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gravity = 1

let groundHeight = 150
let groundY = canvas.height - groundHeight
let bullets = []
let attack1 = false
let temp
let damaged = false
let bullets2 = []
let damaged2 = false
let health1 = 180
let gameOver1 = false
let gameOver2 = false
let health2 = 180
let health1Width = 240
let health2Width = 240
let healthHeight = 35
let level2 = false
//-----------------------------------------------------------------------------------------

// These variabes make key pressed more efficient if used
const keys = {
    a: {
        pressed: false
    },
    w: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
const keys2 = {
    right: {
        pressed: false
    },
    up: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let lastKey = ''
let lastKey2 = ''
//-----------------------------------------------------------------------------------------

// Makes a base class that the player can reference off of
class Player
{
    constructor({position, velocity, size, color})
    {
        this.position = position
        this.velocity = velocity
        this.size = size
        this.color = color
    }
    draw()
    {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
    update()
    {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        // Checks to see if player should add gravity to it
        /*if (this.position.y + this.size.height > canvas.height) {
            this.velocity.y = 0
        }
        else {
            this.velocity.y += gravity
        }*/

        if (this.position.y + this.size.height + this.velocity.y > groundY)
        {
            this.velocity.y = 0
        }

        else if (this.position.y + this.size.height + this.velocity.y < groundY)
        {
            this.velocity.y += gravity
        }
        //---------------------------------------------------------------------------------

        // Checks for a wall on the side
        if (this.position.x < 0)
        {
            this.position.x = 0
        }
        else if (this.position.x + this.size.width > canvas.width)
        {
            this.position.x = canvas.width - this.size.width
        }
        //---------------------------------------------------------------------------------
        /*
        // Checks if player is at the top of the frame
        if (this.position.y < 0)
        {
            this.position.y = 0
        }*/
        //---------------------------------------------------------------------------------
    }
}
//-----------------------------------------------------------------------------------------

// Creates the players and the width / height properties
let width = 50
let height = 200

const player1 = new Player({
    position : {
        x: 150,
        y: 10
    },
    velocity : {
        x: 0,
        y: 0
    },
    size : {
        width: width,
        height: height
    },
    color : 'red'
})

const player2 = new Player({
    position : {
        x: canvas.width - width - 150,
        y: 10
    },
    velocity : {
        x: 0,
        y: 0
    },
    size : {
        width: width,
        height: height
    },
    color : 'blue'
})
//-----------------------------------------------------------------------------------------
/*
//Creates a class for the bullets
class Bullets{
    constructor({position, color, velocity})
    {
        this.position = position
        this.color = color
        this.velocity = velocity
    }
    draw()
    {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, 20, 20)
    }
    update()
    {
        this.draw()
        this.position.x += this.velocity
    }
}
//-----------------------------------------------------------------------------------------
*/
// This is the animation loop to draw everything over and over again
function animate()
{
    requestAnimationFrame(animate)
    if(!gameOver1 && !gameOver2 & !level2)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        //Sky
        ctx.fillStyle = 'cyan'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        //---------------------------------------------------------------------------------

        //Ground
        ctx.fillStyle = 'green'
        ctx.fillRect(0, groundY, canvas.width, height)

        //---------------------------------------------------------------------------------

        //Checks if a keys.example.pressed is true so you can move
        if (keys.w.pressed && lastKey == 'w')
        {
            player1.velocity.y = -15
        }
        else if (keys.a.pressed && lastKey == 'a')
        {
            player1.velocity.x = -5
        }
        else if (keys.d.pressed && lastKey == 'd')
        {
            player1.velocity.x = 5
        }

        if (keys2.up.pressed && lastKey2 == 'up')
        {
            player2.velocity.y = -15
        }
        else if (keys2.left.pressed && lastKey2 == 'left')
        {
            player2.velocity.x = -5
        }
        else if (keys2.right.pressed && lastKey2 == 'right')
        {
            player2.velocity.x = 5
        }
        //-------------------------------------------------------------------------------------

        // Checks for attack
        /*if (attack1)
        {   
            bullet.update()
        }
        */

        for (let i = 0; i < bullets.length; i++)
        {
            let bulletI = bullets[i]

            bulletI.x += bulletI.velocity

            ctx.fillStyle = bulletI.color
            ctx.fillRect(bulletI.x, bulletI.y, bulletI.width, bulletI.height)

            /*if (bulletI.x + bulletI.width > canvas.width)
            {
                bullets[i].used = false
                bullets.shift()
            }*/

            if (bulletI.x + bulletI.width > canvas.width)
            {
                bullets.shift()
            }

            if (bullets[i].used == false && 
                bulletI.x + bulletI.width > player2.position.x && 
                bulletI.x < player2.position.x + player2.size.width && 
                bulletI.y + bulletI.height > player2.position.y && 
                bulletI.y < player2.position.y + player2.size.height && 
                damaged == true)
            {
                health2 -= 15
                if (health2 <= 0)
                {
                    gameOver1 = true
                }
                damaged = false
                bullets[i].used = true
                bullets.shift()
                health2Width -= 20
            }
        }

        damaged = true

        for (let b = 0; b < bullets2.length; b++)
        {
            let bulletB = bullets2[b]

            bulletB.x += bulletB.velocity

            ctx.fillStyle = bulletB.color

            ctx.fillRect(bulletB.x, bulletB.y, bulletB.width, bulletB.height)

            if (bullets2[b].used == false &&
                bulletB.x < player1.position.x + player1.size.width &&
                bulletB.x + bulletB.width > player1.position.x &&
                bulletB.y < player1.position.y + player1.size.height &&
                bulletB.y + bulletB.height > player1.position.y &&
                damaged2 == true)
                {
                    health1 -= 15
                    if (health1 <= 0)
                    {
                        gameOver2 = true
                    }
                    damaged2 = false
                    bullets2[b].used = true
                    bullets2.shift()
                    health1Width -= 20
                }
            
            if (bulletB.x < 0)
            {
                bullets2.shift()
            }

        }

        damaged2 = true
        //---------------------------------------------------------------------------------
        
        //Guns
        ctx.fillStyle = 'black'
        ctx.fillRect(player1.position.x + width, player1.position.y + width, 75, 20)
        ctx.fillRect(player1.position.x + width, player1.position.y + width + 20, 20, 35)

        ctx.fillRect(player2.position.x - width - 25, player2.position.y + width, 75, 20)
        ctx.fillRect(player2.position.x - width + 30, player2.position.y + width + 20, 20, 35)
        //---------------------------------------------------------------------------------

        //Health Bar
        ctx.fillRect(50, 40, 250, 35)
        ctx.fillRect(canvas.width - 250 - 50, 40, 250, 35)
        ctx.fillStyle = 'red'
        ctx.fillRect(55, 45, health1Width, 25)
        ctx.fillStyle = 'blue'
        ctx.fillRect((canvas.width - 250 - 50) + 5, 45, health2Width, 25)
        //---------------------------------------------------------------------------------

        player1.update()
        player2.update()
}

    else if (gameOver1 == true)
    {
        ctx.fillStyle = 'red'
        ctx.font = '50px Arial'
        ctx.fillText("Player 1 Wins!", canvas.width/2 - 170, 75)

        bullets = []
        bullets2 = []
        gameOver1 = false
        gameOver2 = false
        health1 = 180
        health2 = 180
        health1Width = 240
        health2Width = 240
        level2 = true
        
    }
    else if (gameOver2 == true)
    {
        ctx.fillStyle = 'blue'
        ctx.font = '50px Arial'
        ctx.fillText("Player 2 Wins!", canvas.width/2 - 170, 75)
        
        gameOver1 = false
        gameOver2 = false
        health1 = 180
        health2 = 180
        health1Width = 240
        health2Width = 240
        bullets = []
        bullets2 = []
        level2 = true
    }
    else if (level2)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let newX = canvas.width/2 - 25

        //Sky
        ctx.fillStyle = 'cyan'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        //---------------------------------------------------------------------------------

        //Ground
        ctx.fillStyle = 'green'
        ctx.fillRect(0, groundY, canvas.width, groundHeight)
        //---------------------------------------------------------------------------------

        //Guns
        ctx.fillStyle = 'black'
        ctx.fillRect(player1.position.x + width, player1.position.y + width, 75, 20)
        ctx.fillRect(player1.position.x + width, player1.position.y + width + 20, 20, 35)

        ctx.fillRect(player2.position.x - width - 25, player2.position.y + width, 75, 20)
        ctx.fillRect(player2.position.x - width + 30, player2.position.y + width + 20, 20, 35)
        //---------------------------------------------------------------------------------
        
        //---------------------------------------------------------------------------------

        //Movement
        if (keys.w.pressed && lastKey == 'w')
        {
            player1.velocity.y = -15
        }
        else if (keys.a.pressed && lastKey == 'a')
        {
            player1.velocity.x = -5
        }
        else if (keys.d.pressed && lastKey == 'd')
        {
            player1.velocity.x = 5
        }

        if (keys2.up.pressed && lastKey2 == 'up')
        {
            player2.velocity.y = -15
        }
        else if (keys2.left.pressed && lastKey2 == 'left')
        {
            player2.velocity.x = -5
        }
        else if (keys2.right.pressed && lastKey2 == 'right')
        {
            player2.velocity.x = 5
        }
        //---------------------------------------------------------------------------------

        //Shoot Bullets
        for (let i = 0; i < bullets.length; i++)
        {
            let bulletI = bullets[i]

            bulletI.x += bulletI.velocity

            ctx.fillStyle = bulletI.color
            ctx.fillRect(bulletI.x, bulletI.y, bulletI.width, bulletI.height)

            /*if (bulletI.x + bulletI.width > canvas.width)
            {
                bullets[i].used = false
                bullets.shift()
            }*/

            if (bulletI.x + bulletI.width > canvas.width)
            {
                bullets.shift()
            }

            if (bulletI.x + bulletI.width > newX && bulletI.y + bulletI.height > groundY - 400)
            {
                bullets.shift()
            }

            if (bullets[i].used == false && 
                bulletI.x + bulletI.width > player2.position.x && 
                bulletI.x < player2.position.x + player2.size.width && 
                bulletI.y + bulletI.height > player2.position.y && 
                bulletI.y < player2.position.y + player2.size.height && 
                damaged == true)
            {
                health2 -= 15
                if (health2 <= 0)
                {
                    gameOver1 = true
                }
                damaged = false
                bullets[i].used = true
                bullets.shift()
                health2Width -= 20
            }
        }

        damaged = true

        for (let b = 0; b < bullets2.length; b++)
        {
            let bulletB = bullets2[b]

            bulletB.x += bulletB.velocity

            ctx.fillStyle = bulletB.color

            ctx.fillRect(bulletB.x, bulletB.y, bulletB.width, bulletB.height)

            if (bullets2[b].used == false &&
                bulletB.x < player1.position.x + player1.size.width &&
                bulletB.x + bulletB.width > player1.position.x &&
                bulletB.y < player1.position.y + player1.size.height &&
                bulletB.y + bulletB.height > player1.position.y &&
                damaged2 == true)
                {
                    health1 -= 15
                    if (health1 <= 0)
                    {
                        gameOver2 = true
                    }
                    damaged2 = false
                    bullets2[b].used = true
                    bullets2.shift()
                    health1Width -= 20
                }
            
            if (bulletB.x < 0)
            {
                bullets2.shift()
            }
            if (bulletB.x < newX + 50 && bulletB.y + bulletB.height > groundY - 400)
            {
                bullets2.shift()
            }

        }

        damaged2 = true
        //---------------------------------------------------------------------------------

        //New Obstacle
        ctx.fillStyle = 'black'
        ctx.fillRect(newX, groundY - 400, 50, 400)
        //---------------------------------------------------------------------------------

        player1.update()
        player2.update()

    }

}
animate()
//-----------------------------------------------------------------------------------------

//Player movement
addEventListener('keydown', movePlayer)
addEventListener('keyup', stopPlayer)

function movePlayer(e)
{
    switch(e.code)
    {
        case 'KeyA':
            keys.a.pressed = true
            temp = player1.position.x
            lastKey = 'a'
            break
        case 'KeyW':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'KeyD':
            keys.d.pressed = true
            temp = player1.position.x
            lastKey = 'd'
            break
        case 'KeyQ':
            let bullet = {
                x : player1.position.x + width + 75,
                y : player1.position.y + width,
                velocity : 17,
                color : 'red',
                width : 20,
                height : 23,
                used : false
            }

            damaged = true

            bullets.push(bullet)
            break
    }
    switch(e.code)
    {
        case 'KeyJ':
            keys2.left.pressed = true
            lastKey2 = 'left'
            break
        case 'KeyI':
            keys2.up.pressed = true
            lastKey2 = 'up'
            break
        case 'KeyL':
            keys2.right.pressed = true
            lastKey2 = 'right'
            break
        case 'KeyO':
            let bullet2 = {
                x : player2.position.x - 75,
                y : player2.position.y + width,
                velocity : -23,
                color : 'blue',
                width : 20,
                height : 20,
                used : false
            }

            damaged2 = true

            bullets2.push(bullet2)
            break
    }
}

function stopPlayer(e)
{
    switch (e.code)
    {
        case 'KeyA':
            keys.a.pressed = false
            player1.velocity.x = 0
            break
        case 'KeyD':
            keys.d.pressed = false
            player1.velocity.x = 0
            break 
        case 'KeyW':
            keys.w.pressed = false
            break
    }
    switch(e.code)
    {
        case 'KeyJ':
            keys2.left.pressed = false
            player2.velocity.x = 0
            break
        case 'KeyI':
            keys2.up.pressed = false
            break
        case 'KeyL':
            keys2.right.pressed = false
            player2.velocity.x = 0
            break
    }
}
//-----------------------------------------------------------------------------------------