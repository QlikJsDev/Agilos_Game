
var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var Fruit;
var Ghost;
var Ghost2;
var GhostSpeed=100;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var GameOverText;
var range=5;

var game = new Phaser.Game(config);

function preload ()
  {
  this.load.image('Background', 'assets/Background.jpg');
  this.load.image('Hwall', 'assets/Hwall.png');
  this.load.image('Vwall', 'assets/Vwall.png');
  this.load.image('Hwall_small', 'assets/Hwall_small.png');
  this.load.image('Vwall_small', 'assets/Vwall_small.png');
  this.load.image('Hwall_Xsmall', 'assets/Hwall_small.png');
  this.load.image('Vwall_Xsmall', 'assets/Vwall_small.png');
  this.load.image('Block_130x180', 'assets/Block_130x180.png');
  this.load.image('Block_200x600', 'assets/Block_200x600.png');
  this.load.image('Fruit', 'assets/Fruit.png');
  this.load.image('Ghost', 'assets/Ghost.png');
  this.load.image('Ghost2', 'assets/Ghost.png');
  this.load.spritesheet('Pacman', 'assets/Sprite_Pacman.png', { frameWidth: 40.5, frameHeight: 48 });

  }


function create ()
  {

  this.add.image(400, 300, 'Background');
  player = this.physics.add.sprite(60, 60, 'Pacman');
  Ghost = this.physics.add.sprite(840, 60, 'Ghost').setScale(0.2);
  Ghost2 = this.physics.add.sprite(840, 840, 'Ghost2').setScale(0.2);
  //Ghost2 = this.physics.add.sprite(600, 300, 'Ghost').setScale(0.2);
  //Ghosts = this.physics.add.group();
  //var Ghost = Ghosts.create(400, 200, 'Ghost');
  Fruit = this.physics.add.sprite(450, 450, 'Fruit').setScale(0.1);

  player.setCollideWorldBounds(true);
  Ghost.setCollideWorldBounds(true);
  Ghost2.setCollideWorldBounds(true);


  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(450, 900, 'Hwall').setScale(2).refreshBody();
  platforms.create(450, 0, 'Hwall').setScale(2).refreshBody();
  platforms.create(0, 450, 'Vwall').setScale(2).refreshBody();
  platforms.create(900, 450, 'Vwall').setScale(2).refreshBody();

  platforms.create(300, 140, 'Vwall_Xsmall').refreshBody();
  platforms.create(600, 140, 'Vwall_Xsmall').refreshBody();
  platforms.create(300, 760, 'Vwall_Xsmall').refreshBody();
  platforms.create(600, 760, 'Vwall_Xsmall').refreshBody();

  platforms.create(160, 180, 'Block_130x180').refreshBody();
  platforms.create(450, 180, 'Block_130x180').refreshBody();
  platforms.create(745, 180, 'Block_130x180').refreshBody();
  platforms.create(160, 720, 'Block_130x180').refreshBody();
  platforms.create(450, 720, 'Block_130x180').refreshBody();
  platforms.create(745, 720, 'Block_130x180').refreshBody();

  platforms.create(250, 450, 'Block_200x600').refreshBody();
  platforms.create(650, 450, 'Block_200x600').refreshBody();

  this.physics.add.collider(player, platforms);
  //this.physics.add.collider(Fruit, platforms);
  this.physics.add.collider(Ghost, platforms);
  this.physics.add.collider(Ghost2, platforms);
  this.physics.add.collider(Ghost, Ghost2);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('Pacman', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'Pacman', frame: 2 } ],
      frameRate: 5
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('Pacman', { start: 3, end: 4 }),
      frameRate: 5,
      repeat: -1
  });

  this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('Pacman', { start: 5, end: 6 }),
      frameRate: 5,
      repeat: -1
  });
  this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('Pacman', { start: 7, end: 8 }),
      frameRate: 5,
      repeat: -1
  });
  this.anims.create({
      key: 'GameOverFace',
      frames: [ { key: 'Pacman', frame: 9 } ],
      frameRate: 5
  });


  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();


  this.physics.add.overlap(player, Fruit, collectFruit, null, this);
  this.physics.add.overlap(player, Ghost, GameOver, null, this);
  this.physics.add.overlap(player, Ghost2, GameOver, null, this);
  this.physics.add.overlap(Fruit, platforms, MoveFruit, null, this);


scoreText = this.add.text(0, 0, 'Score: 0', { fontSize: '32px', backgroundColor:'black', font: 'bold 20pt Arial', fill: '#f4e242' });
  }


function update ()
{

//Player moves
  if (cursors.left.isDown)
  {
      player.setVelocityY(0);
      player.setVelocityX(-300);

      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityY(0);
      player.setVelocityX(300);

      player.anims.play('right', true);
  }
  else if (cursors.up.isDown )//&& player.body.touching.down
  {
      player.setVelocityX(0);
      player.setVelocityY(-300);

      player.anims.play('up', true);
  }
  else if (cursors.down.isDown )//&& player.body.touching.down
  {
      player.setVelocityX(0);
      player.setVelocityY(300);

      player.anims.play('down', true);
  }


  GhostMove(Ghost);
  GhostMove(Ghost2);

  //this.physics.add.overlap(platforms, Fruit, MoveFruit, null, this);

}


//Ghost moves
function GhostMove(Ghost) {
  var RandMove=Math.round(Math.random());

if(player.y>=Ghost.y-range && player.y<=Ghost.y+range && player.x<Ghost.x)
{
  Ghost.setVelocityX(-GhostSpeed);
  Ghost.setVelocityY(0);
}

else if(player.y>=Ghost.y-range && player.y<=Ghost.y+range && player.x>Ghost.x)
{
  Ghost.setVelocityX(GhostSpeed);
  Ghost.setVelocityY(0);
}

else if(player.y<Ghost.y && player.x>=Ghost.x-range && player.x<=Ghost.x+range)
{
  Ghost.setVelocityX(0);
  Ghost.setVelocityY(-GhostSpeed);
}

else if(player.y>Ghost.y && player.x>=Ghost.x-range && player.x<=Ghost.x+range)
{
  Ghost.setVelocityX(0);
  Ghost.setVelocityY(GhostSpeed);
}


  else if(player.y>Ghost.y && player.x>Ghost.x)
  {
    Ghost.setVelocityX(GhostSpeed);
    Ghost.setVelocityY(GhostSpeed);
  }

  else if(player.y>Ghost.y && player.x<Ghost.x)
  {
    Ghost.setVelocityX(-GhostSpeed);
    Ghost.setVelocityY(GhostSpeed);
  }

  else if(player.y<Ghost.y && player.x>Ghost.x)
  {
    Ghost.setVelocityX(GhostSpeed);
    Ghost.setVelocityY(-GhostSpeed);
  }

  else if(player.y<Ghost.y && player.x<Ghost.x)
  {
    Ghost.setVelocityX(-GhostSpeed);
    Ghost.setVelocityY(-GhostSpeed);
  }
}



function GameOver(player,Ghost)
{
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('GameOverFace');

  gameOver = true;
  GameOverText = this.add.text(400, 200, 'Game Over', { fontSize: '32px', backgroundColor:'black', font: 'bold 20pt Arial', fill: '#f4e242' });
  GameOverText.setText('Game Over');
}




function MoveFruit (Fruit,platforms )
{
    Fruit.disableBody(true, true);
    Fruit = this.physics.add.sprite(Phaser.Math.Between(50, 900), Phaser.Math.Between(50, 900), 'Fruit').setScale(0.1);
    this.physics.add.overlap(Fruit, platforms, MoveFruit, null, this);
    //this.physics.add.overlap(player, Fruit, collectFruit, null, this);
}



function collectFruit (player, Fruit)
{
    Fruit.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);


    //  A new batch of stars to collect

    Fruit = this.physics.add.sprite(Phaser.Math.Between(60, 840), Phaser.Math.Between(60, 840), 'Fruit').setScale(0.1);
    this.physics.add.overlap(Fruit, platforms, MoveFruit, null, this);
    this.physics.add.overlap(player, Fruit, collectFruit, null, this);

}


document.addEventListener('keydown', RefreshPage);
function RefreshPage(e){
  var x = e.keyCode;
  if(x==13)
  location.reload();
}
