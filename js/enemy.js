Enemy = function(game, group, food_g, cut_g){
	this.game = game
	this.group = group
	this.food_g = food_g 
	this.cut_g = cut_g
	this.tweens = []


	this.randomize_bound = function(){
		let x, y
		// x aleatorio e y algum canto
		if (Math.random() >= 0.5){
			x = Math.random() * game.width
			if (Math.random() >= 0.5){
				y = game.height-1
			}
			else{
				y = 10
			}
		}
		// y aleatorio e x algum canto
		else{
			y = Math.random() * game.height
			if (Math.random() >= 0.5){
				x = game.width-1
			}
			else{
				x = 10
			}
		}
		return new Phaser.Point(x, y)
	}


	this.create_cut_enemy = function(){
		let p,p2,d
		do{
			p = this.randomize_bound()
			p2 = this.randomize_bound()
			d = distance(p, p2)
		}while(d < game.width/1.5)
		let cut = createSprite(p.x, p.y, [.2,.2], "cut")
		cut.tint = 0x000000
		cut.animations.add("tesoura",[0,1,2,3,4,5,6], 60, true)
		cut.animations.play("tesoura")
		cut_g.add(cut)
		l = new Phaser.Line(p.x, p.y, p2.x, p2.y)
		cut.angle = Phaser.Math.radToDeg(l.angle)


		let c_tween = game.add.tween(cut).to({x: p2.x, y: p2.y}, d/100 * 1000, 'Linear')

		c_tween.onComplete.add(()=>cut.destroy(),cut)

		c_tween.start()
	}

	this.create_enemy = function(){
		let x, y
		// x aleatorio e y algum canto
		if (Math.random() >= 0.5){
			x = Math.random() * game.width
			if (Math.random() >= 0.5){
				y = game.height-1
			}
			else{
				y = 1
			}
		}
		// y aleatorio e x algum canto
		else{
			y = Math.random() * game.height
			if (Math.random() >= 0.5){
				x = game.width-1
			}
			else{
				x = 1
			}
		}

		return createSprite(x, y, [0.3, 0.3], "bee")
	}
	//////////////////

	this.move_enemy = function(enemy, speed){
		let d
		do{
		toX = Math.random() * game.width
		toY = Math.random() * game.height
		d = distance(new Phaser.Point(toX,toY), enemy)}while (d < 100)
		tween = game.add.tween(enemy).to({x: toX, y: toY, angle: +50}, d/speed * 1000, 'Linear', true, 0, -1)
		this.tweens.push(tween)
		tween.yoyo(true,1000)
		tween.start()
		enemy.tween = tween
		group.add(enemy)
	}

	///////////////////
	
	this.drop_item = function(place, qntd, to_grow){
		console.log(place, qntd, to_grow)
		for (let i=0; i<qntd; i++)
		{		
			let k_x
			let k_y
				
			if (Math.random() >= 0.5){
				k_x = 1
			}
			else{
				k_x = -1
			}

			if (Math.random() >= 0.5){
				k_y = 1
			}
			else{
				k_y = -1
			}

			k_x = k_x*Math.random()*10
			k_y = k_y*Math.random()*10

			sp = createSprite(place.x+k_x, place.y+k_y, [0.2,0.2], "food")
			sp.tint = Math.random()*0xffffff 
			sp.to_grow = to_grow
			food_g.add(sp)
		}	
	}

	//////////////////

	this.killFood= function(snakeHead, food){
		
		food.kill()
		grow(snake)
	}

	this.killEnemy = function(enemy, snakeBody){
		if (group.children.indexOf(enemy)!= -1)
		{
							

			if (enemy.alive){
				enemy.tween.stop()
				enemy.kill()
				game.enemy.drop_item(new Phaser.Point(enemy.x, enemy.y), 4, 0.5)
			}
		}
		
		if (group.children.indexOf(snakeBody)!= -1)
		{
				console.log("algo errado ocorreu nessa colisao")
		}

		if (group.getFirstAlive() == null)
		{
			console.log("---\nnextwave---\n")
			game.wave.nextWave()
		}
	}

	////////////////
	this.reset = function(){
		//Remove os tweens existentes
		game.tweens.removeAll()
		/*group.forEach(function(item, index){
			
		let toX = Math.random() * game.width
		let toY = Math.random() * game.height
		let d = distance(new Phaser.Point(toX,toY), enemy)
		tween = game.add.tween(enemy).to({x: toX, y: toY, angle: +50}, d/speed * 1000, 'Linear', true, 0, -1)
		})

		tween.forEach(function(item, index){
		item.to({x: toX, y: toY, angle: +50}, d/speed * 1000, 'Linear', true, 0, -1)
		})
		group.setAll('revive', true)

	}*/
		//grow(snake)
	}
}
