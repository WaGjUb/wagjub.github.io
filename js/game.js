'use strict'
//tille sprite
//JOGO SLITHER.IO LIKE


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 
    'game-container', {
        preload: preload, 
        create: create,
        update: update, 
        render: render
    }
)

//var enemy
var snk

var snake = {}
var background
const INIT_SPEED = 100
const MAX_SPEED = 500
const RUN_SPEED = 300
var keys
var snake_space = 10
var ideal_distance = 15
var error = 2
var calibrate_speed = Math.trunc(snake_space / (RUN_SPEED/INIT_SPEED))
var max_distance = ideal_distance + error
var min_distance = ideal_distance - error
var init = 0

function preload() {
	
	game.load.image('food', 'assets/food.png')
	game.load.image('background', 'assets/grass.jpg')
    game.load.image('head', 'assets/s_head2_square.png')
    game.load.image('body', 'assets/s_body.png')
    game.load.spritesheet('tongue', 'assets/s_tongue.png', 128, 256)
    game.load.spritesheet('cut', 'assets/cut_enemy_animation.png', 340, 207)
    game.load.image('tail', 'assets/s_tail.png')
	game.load.image('bee', 'assets/bee.png')
}

function create() {

    game.renderer.roundPixels = true
    game.renderer.clearBeforeRender = false
    keys = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
		space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }

	//Start the physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE)

	//Create the background
    background = game.add.sprite(0, 0, 'background')
    background.scale.x = game.width/background.width
    background.scale.y = game.height/background.height

	//Create the player snake
	snake.group = game.add.group()
	snake["sprite"] = createSnake(game.width/2, game.height/2, [0.18,0.18])
	snake["size"] = 5
	snake["sections"] = new Array()
	snake.path = new Array()
	snake.run_path = new Array()
	snake.fat = new Array()

	for (var i = 0; i < snake.size; i++)
	{
		//snake.sections[i] = createSprite(game.width/2, game.height/2, [0.05,0.1], "body")
		snake.sections[i] = createSprite(game.width/2, game.height/2, [0.05,0.2], "body")
		snake.group.add(snake.sections[i])
	}

	for (var i = 0; i < snake.size * snake_space; i++)
	{
		snake.path[i] = new Phaser.Point(game.width/2, game.height/2)
		snake.path[i].rotation = snake.head.rotation
	}
	
//Create enemy
	game.enemy = new Enemy(game, game.add.group(), game.add.group(), game.add.group())


	game.wave = new Wave(game)
	game.wave.nextWave()

	//game.enemy.create_cut_enemy()

/*	for (var i=0; i<3; i++){
		let e = game.enemy.create_enemy()
		game.enemy.move_enemy(e,300) //velocidade do level
	}*/

	//Create snake to method gameover
	snk = new Snake()
}

function createSnake(x, y, size){
	let s_sprites = game.add.group()
	//Create the tongue animation
/*	let tongue = createSprite(x, y, size, "tongue", [-1,0.5])
	tongue.animations.add("lingua", [0,1], 2, true)
	tongue.animations.play("lingua")*/
	
	//Create the headSprite
	let head = createSprite(x-(0*size[0]), y, size, "head", [0.5,0.5])
	head.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(head.angle, 10));
	head.body.setSize(135,135,30,30)
	//head.body.setCircle()
	head.body.collideWorldBounds = true
	//head.scale.setTo(.10,.10)
	//tongue.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(head.angle, 10));
	//tongue.body.collideWorldBounds = true
	snake.head = head
//	s_sprites.add(tongue)
	s_sprites.add(head)
	return s_sprites
}

function createSprite(x, y, size, spName, anc=[0.5,0.5]){
	var sprite
	sprite = game.add.sprite(x, y, spName)
	sprite.anchor.setTo(anc[0], anc[1])
	sprite.scale.setTo(size[0],size[1])
	// controle polar
	game.physics.arcade.enable(sprite)
	sprite.moveDirecton = 0
	sprite.body.maxVelocity.set(MAX_SPEED)
	return sprite

}

function update() {
	

	//let speed = INIT_SPEED
	let speed = 100
	let last_index_path = 0 
	
	snake.sprite.setAll('body.angularVelocity', 0);
	snake.sprite.setAll("tint",0xffffff)
	//snake.group.setAll("tint",0xffffff)
	snake.sprite.setAll('body.velocity' ,game.physics.arcade.velocityFromAngle(snake.sprite.getFirstExists().angle, speed));

 	var part = snake.path.pop()
	part.setTo(snake.head.x, snake.head.y)
	part.rotation = snake.head.rotation
	snake.path.unshift(part)


	if (keys.left.isDown)
    {
        snake.sprite.setAll('body.angularVelocity', -300);
    }
    else if (keys.right.isDown)
    {
        snake.sprite.setAll('body.angularVelocity', 300);
    }


	if (keys.space.isDown)
	{
		//	grow(snake)

		snake.sprite.setAll('body.velocity' ,game.physics.arcade.velocityFromAngle(snake.sprite.getFirstExists().angle, 300));
		snake.sprite.setAll("tint", Math.random() * 0xffffff)
	//	snake.group.setAll("tint", Math.random() * 0xffffff)
		speed = 300
	}




	// rotaciona e altera a velocidade de cada sprite de corpo
	for (var i = 0; i < snake.sections.length; i++)
	{
				let path_idx = get_path(i, last_index_path)
				last_index_path = path_idx
				let path = snake.path[path_idx]
				snake.sections[i].path_idx = path_idx
				/*verifica se é o gordinho
				snake.fat.forEach(function(item){
					item
				})*/
		
				snake.sections[i].x = path.x
				snake.sections[i].y = path.y
				snake.sections[i].rotation = path.rotation
	}

	//colisão com a tesoura
	game.physics.arcade.collide(game.enemy.cut_g, snake.group, cutSnake)
	//colisão com a comida
	game.physics.arcade.collide(game.enemy.food_g, snake.head, game.enemy.killFood)
	//colisao de corpo com o inimigo
	game.physics.arcade.collide(game.enemy.group, snake.group, game.enemy.killEnemy)
	//colisao de cabeça com inimigo	
	game.physics.arcade.collide(game.enemy.group, snake.head, snk.killSnake)
	game.enemy.group.forEachDead(function (item) {
		item.destroy()
	})
}


function get_path(index, last_index){
	let d
	if (index == 0){
		for (let i=last_index; i<snake.path.length; i++){
			d = Math.trunc(distance(snake.head, snake.path[i]))
			if (d >= ideal_distance-error && d <= ideal_distance+error){
				return i
			}
		}
			return last_index
	}
	else{
		for (let i=last_index; i<snake.path.length; i++){
			d = Math.trunc(distance(snake.sections[index-1], snake.path[i]))
			if (d >= ideal_distance-error && d <= ideal_distance+error){
				return i
			}
		}
		return last_index
		
	}
}
	
/*	let p_idx = ((index+1) * 2) +2 //pop 
	let d

	if (index == 0){
		p_idx -= 1
		d = Math.trunc(distance(snake.head, snake.path[p_idx]))
	}
	else{
		d = Math.trunc(distance(snake.sections[index-1], snake.path[p_idx]))
	//	console.log(d, index)
	}

	if (d >= ideal_distance-error && d <= ideal_distance+error ){

		return(p_idx)
	}
	else
	{
		return(p_idx*3)
	}
}*/


//TODO não funciona (controlar os indices e o tamanho da cobra)
function grow(snk, qnt=1){

	//Cria o controlador do gordinho
	snk.fat.push(new Phaser.Point(snk.sections[0].x, snk.sections[0].y))

	let last_section = snk.sections[snk.sections.length-1]
	for (var i = 0; i < qnt; i++)
	{
		let sec = createSprite(last_section.x, last_section.y, [0.05,0.2], "body")
		snk.sections.push(sec)
		snk.group.add(sec)
	}
	console.log('passou primeiro for')
	for (var i = 0; i < qnt * snake_space; i++)
	{
		let p = new Phaser.Point(last_section.x,last_section.y)
		p.rotation = last_section.rotation
		snk.path.push(p)
	}
	console.log('passou segundo for')


}


function distance(sp1, sp2) {
	let d
	d = Math.pow(sp1.x - sp2.x, 2) + Math.pow(sp1.y - sp2.y, 2)
	d = Math.pow(d, 0.5)
	return d
}


function cutSnake(cut, body){
	
	let index = snake.sections.indexOf(body)
	let to_delete = snake.sections.length -  index
	console.log(index<snake.sections.length)

	for (let i = index; i < snake.sections.length; i++)
	{
		snake.sections[i].destroy()

	}

	for (var i = 0; i<to_delete; i++)
	{
		snake.sections.pop()
	}
	for (var i = 0; i<=to_delete*snake_space; i++ )
	{
		//snake.path.pop()
	}

}

function render() {
	//game.debug.body(snake.head)
}


