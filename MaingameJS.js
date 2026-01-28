var scene;
var player;
var floor;
var platforms = [];
var tmob;
var mobs = [];
var score = 0;
var timer;
var timeLeft = 300;
let isRunningAnimationActive = false;

function init() {
  // Initialize the scene
  scene = new Scene();
  scene.setSize(2030, 900);
  backgound = new Sprite(scene, "castle2.jpg", 2030, 900);
  backgound.setPosition(1015, 450);
  backgound.setSpeed(0);

  // Create the floor and player
  floor = new Sprite(scene, "walls.jpg", 4060, 40);
  floor.setPosition(0, 870);
  floor.setSpeed(0);

  player = new Player();
  timer = new Timer();

  createPlatforms();
  setUpMobs();
  startTimer();
  scene.start();
}

function Player() {
  var player = new Sprite(scene, "char_blue_1.png", 56, 56);
  player.setSpeed(0);
  player.setAngle(90);
  player.setPosition(100, 870);
  player.minspeed = -5;
  player.maxspeed = 10;
  player.health = 100;
  player.attackCooldown = 0;
  player.damageCooldown = 0;

  player.velocityY = 0;
  player.gravity = 1.5;
  player.jumpStrength = -20;
  player.jumping = false;
  player.onGround = false;

  player.loadAnimation(448, 616, 56, 56); // (sheetWidth, sheetHeight, frameWidth, frameHeight)
  player.generateAnimationCycles();
  player.renameCycles(["idle", "attack", "run", "jump"]); // Define the animation cycles
  player.setAnimationSpeed(1000);
  player.setCurrentCycle("idle");
  player.playAnimation();

  player.checkkey = function () {
    if (keysDown[K_LEFT]) {
      player.changeXby(-5); // Move right
    }

    if (keysDown[K_RIGHT]) {
      player.changeXby(5); // Move right
    }

    if (keysDown[K_UP] && !player.jumping && player.onGround) {
      player.velocityY = player.jumpStrength;
      player.jumping = true;
      player.onGround = false;
      player.setCurrentCycle("jump"); // You should define a "jump" cycle too (if needed)
    }
    if (keysDown[K_SPACE]) {
      console.log("Space Press");
      player.attack();
    }
  };

  player.attack = function () {
    if (player.attackCooldown <= 0) {
      console.log("Attack");
      swordAttackSound.play(); // Play the attack sound

      // Start cooldown after the attack
      player.setCurrentCycle("attack");
      player.attackCooldown = 14; // Set cooldown to 10 ticks (can be in seconds or frames based on your update frequency)

      // Apply damage to mobs in range
      mobs.forEach(function (mob) {
        if (player.distanceTo(mob) < 150) {
          mob.takeDamage(50);
        }
      });
    } else {
      // Optionally, you can add an effect or feedback here when the player is in cooldown
      console.log("Attack on cooldown");
    }
  };

  player.takeDamage = function (damage) {
    if (player.damageCooldown <= 0) {
      console.log("Player got hit!");
      this.health -= damage;
      this.damageCooldown = 30;
      hurtSound.play(); // Play the hurt sound

      if (this.health <= 0) {
        gameOver();
      }
    }
  };

  player.physic = function () {
    player.velocityY += player.gravity;
    player.changeYby(player.velocityY);
    player.onGround = false;

    platforms.forEach(function (platform) {
      if (player.collidesWith(platform) && player.velocityY > 0) {
        player.setPosition(player.x, platform.y - player.height / 2);
        player.velocityY = 0;
        player.jumping = false;
        player.onGround = true;
      }
    });

    if (player.collidesWith(floor) && player.velocityY > 0) {
      player.setPosition(player.x, floor.y - player.height / 2);
      player.velocityY = 0;
      player.jumping = false;
      player.onGround = true;
    }
  };

  player.changeAnimation = function () {
    // Check if the player is on the ground and running
    if (player.onGround === true && player.jumping === false) {
      // If the player is running and animation hasn't been set yet, change animation to "run"
      if (!isRunningAnimationActive) {
        player.setCurrentCycle("run");
        isRunningAnimationActive = true; // Mark the animation as active
      }
    }

    // Check if the player is jumping
    if (player.onGround === false && player.jumping === true) {
      // If the player is jumping, set the jumping animation and mark it as active
      if (isRunningAnimationActive) {
        player.setCurrentCycle("jump"); // You can add the jump animation here
        isRunningAnimationActive = false; // Reset running animation flag since jumping is different
      }
    }

    // If the player is on the ground and not jumping, set idle animation (if no movement)
    if (
      player.onGround === true &&
      player.jumping === false &&
      !keysDown[K_LEFT] &&
      !keysDown[K_RIGHT]
    ) {
      if (isRunningAnimationActive) {
        player.setCurrentCycle("idle"); // Set idle animation if not moving
        isRunningAnimationActive = false; // Reset flag
      }
    }
  };

  return player;
}

function Mob() {
  var tmob = new Sprite(scene, "ghost.png", 150, 150);
  tmob.setSpeed(4);
  tmob.health = 100; // Add mob health
  tmob.attackCooldown = 30;
  tmob.changeAngleBy(90);

  // Function to make the mob follow the player
  tmob.followPlayer = function () {
    var dx = player.x - this.x;
    var dy = player.y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    var detectionRadius = 2000; // Detection range
    var moveSpeed = 4; // Speed of movement

    if (distance < detectionRadius) {
      this.setAngle(Math.atan2(dy, dx) * (180 / Math.PI)); // Rotate towards player
      this.changeXby((dx / distance) * moveSpeed);
      this.changeYby((dy / distance) * moveSpeed);
    }
  };

  // Function to take damage
  tmob.takeDamage = function (damage) {
    console.log("mob get hit " + damage);
    this.health -= damage;

    // Apply knockback effect
    var knockbackForce = 100; // The strength of the knockback
    var dx = this.x - player.x; // Horizontal distance to player
    var dy = this.y - player.y; // Vertical distance to player
    var distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction and apply knockback
    if (distance !== 0) {
      var knockbackX = (dx / distance) * knockbackForce;
      var knockbackY = (dy / distance) * knockbackForce;
      this.changeXby(knockbackX);
      this.changeYby(knockbackY);
    }

    if (this.health <= 0) {
      this.reset(); // Remove the mob when HP is 0
      score = score + 1;
      console.log(score);
    }
  };

  tmob.attack = function () {
    var distance = this.distanceTo(player);
    if (distance < 20 && this.attackCooldown <= 0) {
      console.log("take damge");
      // Check if within range and cooldown is over
      player.takeDamage(10); // Apply damage to player
      this.attackCooldown = 30; // Set attack cooldown to prevent spamming
    }
  };

  tmob.reset = function () {
    var newX = Math.random() * this.cWidth;
    var newY = Math.random() * this.cHeight;
    tmob.health = 100;
    this.setPosition(newX, newY);
  };

  tmob.reset();
  return tmob;
}

function setUpMobs() {
  mobs = new Array(5);
  for (i = 0; i < 5; i++) {
    mobs[i] = new Mob();
  }
}

function createPlatforms() {
  // Create and position platforms in the scene
  var platform1 = new Sprite(scene, "plat2.png", 100, 20);
  platform1.setPosition(200, 760);
  platform1.setSpeed(0);
  platforms.push(platform1);

  var platform2 = new Sprite(scene, "plat.png", 100, 20);
  platform2.setPosition(600, 760);
  platform2.setSpeed(0);
  platforms.push(platform2);

  var platform3 = new Sprite(scene, "plat2.png", 100, 20);
  platform3.setPosition(400, 690);
  platform3.setSpeed(0);
  platforms.push(platform3);

  var platform4 = new Sprite(scene, "plat.png", 100, 20);
  platform4.setPosition(200, 570);
  platform4.setSpeed(0);
  platforms.push(platform4);

  var platform5 = new Sprite(scene, "plat2.png", 100, 20);
  platform5.setPosition(600, 570);
  platform5.setSpeed(0);
  platforms.push(platform5);

  var platform55 = new Sprite(scene, "plat.png", 100, 20);
  platform55.setPosition(800, 470);
  platform55.setSpeed(0);
  platforms.push(platform55);

  var platform6 = new Sprite(scene, "plat.png", 100, 20);
  platform6.setPosition(1000, 760);
  platform6.setSpeed(0);
  platforms.push(platform6);

  var platform7 = new Sprite(scene, "plat2.png", 100, 20);
  platform7.setPosition(1400, 760);
  platform7.setSpeed(0);
  platforms.push(platform7);

  var platform8 = new Sprite(scene, "plat.png", 100, 20);
  platform8.setPosition(1200, 690);
  platform8.setSpeed(0);
  platforms.push(platform8);

  var platform9 = new Sprite(scene, "plat2.png", 100, 20);
  platform9.setPosition(1000, 570);
  platform9.setSpeed(0);
  platforms.push(platform9);

  var platform10 = new Sprite(scene, "plat.png", 100, 20);
  platform10.setPosition(1400, 570);
  platform10.setSpeed(0);
  platforms.push(platform10);

  var platform100 = new Sprite(scene, "plat2.png", 100, 20);
  platform100.setPosition(1600, 470);
  platform100.setSpeed(0);
  platforms.push(platform100);

  var platform11 = new Sprite(scene, "plat2.png", 100, 20);
  platform11.setPosition(1800, 570);
  platform11.setSpeed(0);
  platforms.push(platform11);

  var platform12 = new Sprite(scene, "plat2.png", 100, 20);
  platform12.setPosition(1800, 760);
  platform12.setSpeed(0);
  platforms.push(platform12);

  var platform13 = new Sprite(scene, "plat.png", 100, 20);
  platform13.setPosition(1600, 690);
  platform13.setSpeed(0);
  platforms.push(platform13);
}

const hurtSound = new Audio("hurt.mp3");
const swordAttackSound = new Audio("swordAttack.mp3");
const backgoundSong = new Audio("loop2.mp3");
let hasStartedMusic = false; // Variable to check if the music has started

// Function to start the music when specific keys are pressed
document.addEventListener("keydown", function (event) {
  if (
    event.key === "x" || // For 'x' key
    event.key === "X" || // For 'X' key
    event.key === "ArrowUp" || // For arrow up key
    event.key === "ArrowDown" || // For arrow down key
    event.key === "ArrowLeft" || // For arrow left key
    event.key === "ArrowRight" || // For arrow right key
    event.key === " " // For spacebar key (space)
  ) {
    if (!hasStartedMusic) {
      backgoundSong.play(); // Start playing the background music
      backgoundSong.loop = true; // Loop the music
      hasStartedMusic = true; // Mark the music as started
    }
  }
});

// Function to start the music on left click
document.addEventListener("click", function (event) {
  if (event.button === 0) {
    // 0 refers to the left mouse button
    if (!hasStartedMusic) {
      backgoundSong.play(); // Start playing the background music
      backgoundSong.loop = true; // Loop the music
      hasStartedMusic = true; // Mark the music as started
    }
  }
});

function update() {
  scene.clear();
  backgound.update();
  floor.update();
  platforms.forEach(function (platform) {
    platform.update();
  });

  if (player.attackCooldown > 0) {
    player.attackCooldown--;
  }
  if (player.damageCooldown > 0) {
    player.damageCooldown--;
  }
  player.checkkey();
  player.changeAnimation();
  player.physic();
  player.update();

  for (i = 0; i < 5; i++) {
    if (mobs[i].attackCooldown > 0) {
      mobs[i].attackCooldown--;
    }
    mobs[i].followPlayer();
    mobs[i].attack();
    mobs[i].update();
  }
  updateHealthBar();
  updateScore();
}

function updateHealthBar() {
  document.getElementById("player-health-bar").style.width =
    player.health + "%";
}

function updateScore() {
  document.getElementById("score").innerHTML = "Score: " + score;
}

function startTimer() {
  // Update the timer every 1000ms (1 second)
  setInterval(function () {
    if (timeLeft > 0) {
      timeLeft--;
      document.getElementById("timer").innerHTML = "Time Left: " + timeLeft; // Update timer display
    } else {
      // Optionally, you can call an end game function when the timer hits 0
      gameOver();
    }
  }, 1000); // Run every second
}

function gameOver() {
  alert("Game Over!");

  // Check if current score is higher than saved highest score
  let highestScore = localStorage.getItem("highestScore");
  if (highestScore === null || score > highestScore) {
    localStorage.setItem("highestScore", score);
    console.log("New high score: " + score);
  }

  window.location.href = "Index.html";
}

function restartGame() {
  score = 0;
  timeLeft = 300;
  player.health = 100;

  // Reset player position
  player.setPosition(100, 530);

  mobs = [];
  setUpMobs(); // Recreate the mobs

  // Restart the game
  scene.stop();
  scene.start();
}

function goBack() {
  window.location.href = "index.html"; // Replace 'index.html' with your actual main menu URL
}
