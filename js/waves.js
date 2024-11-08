function Wave (game){
	this.number = 0
	this.game = game
	this.frames = 0
	this.showed = false
	this.style = { font: "bold 50px Arial", fill: "#ff0000", boundsAlignH: "center", boundsAlignV: "middle"}
	this.text =  game.add.text(300, 300, "phaser 2.4 text bounds", this.style);	


	this.atual_speed = 300
	this.lock = true

	this.nextWave = function () {
		this.lock = true
		this.number += 1
		this.atual_speed += 25
		game.enemy.reset()
		this.text.setText("Wave "+ this.number);
		let textTween = game.add.tween(this.text).to({x: 300, y: 300})
		textTween.duration = 2500
		textTween.onComplete.add(this.create_enemies, this)
		textTween.start()
	}

	this.create_enemies = function(){
		this.text.setText("")
		for (let i = 0; i <= this.number; i++)
		{
			let e = game.enemy.create_enemy()
			game.enemy.move_enemy(e, (Math.random() * this.atual_speed) +10)
		}

	}

}
