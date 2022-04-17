const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: "./img/background.png"
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 120
  },
  scale: 2.75,
  imageSrc: "./img/shop.png",
  frameMax: 6
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 217,
    y: 157
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  frameMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      frameMax: 8
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frameMax: 8
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      frameMax: 2
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      frameMax: 2
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      frameMax: 6
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      frameMax: 4
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      frameMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
});

player.draw();
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: "blue",
  offset: {
    x: 217,
    y: 167
  },
  imageSrc: "./img/kenji/Idle.png",
  frameMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      frameMax: 4
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      frameMax: 8
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      frameMax: 2
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      frameMax: 2
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      frameMax: 4
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      frameMax: 3
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      frameMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
});

enemy.draw();

function animateAction({ character, leftKey, rightKey }) {
  if (character.action.left && character.lastKey === leftKey) {
    if (character.position.x > 0) {
      character.velocity.x = -5;
    }
    character.switchSprites("run");
  } else if (character.action.right && character.lastKey === rightKey) {
    if (character.position.x + character.width < 1024) {
      character.velocity.x = 5;
    }
    character.switchSprites("run");
  } else {
    character.switchSprites("idle");
  }
  if (character.velocity.y < 0) {
    character.switchSprites("jump");
  } else if (character.velocity.y > 0) {
    character.switchSprites("fall");
  }
}
function dropHP({ rectangular1, rectangular2, rectangular2HPBarID }) {
  if (
    rectangularCollision({
      rectangular1: rectangular1,
      rectangular2: rectangular2
    }) &&
    rectangular1.isAttacking &&
    rectangular1.frameCurrent === 2
  ) {
    rectangular2.takeHit();
    rectangular1.isAttacking = false;

    gsap.to(rectangular2HPBarID, {
      width: rectangular2.health + "%"
    });
  }

  if (rectangular1.isAttacking && rectangular1.frameCurrent === 4) {
    rectangular1.isAttacking = false;
  }
}
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.udpate();
  shop.udpate();
  c.fillStyle = "rgba(255,255,255,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.udpate();
  enemy.udpate();
  //stop the movement

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player movement
  animateAction({ character: player, leftKey: "a", rightKey: "d" });
  //enemy movement
  animateAction({
    character: enemy,
    leftKey: "ArrowLeft",
    rightKey: "ArrowRight"
  });

  //detect for collision
  //player movement
  dropHP({
    rectangular1: player,
    rectangular2: enemy,
    rectangular2HPBarID: "#enemyHealth"
  });
  //enemy movement
  dropHP({
    rectangular1: enemy,
    rectangular2: player,
    rectangular2HPBarID: "#playerHealth"
  });

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timeID });
  }
}
decreateTimer();
animate();

window.addEventListener("keydown", (event) => {
  // if (event.key === "r") {
  //   timer = 10;
  // }
  if (!player.dead && timer > 0) {
    switch (event.key) {
      case "d":
        player.action.right = true;
        player.lastKey = "d";
        break;
      case "a":
        player.action.left = true;
        player.lastKey = "a";
        break;
      case "w":
        // key.w.pressed = true;
        if (player.velocity.y === 0) {
          player.velocity.y = -20;
        }

        break;
      case " ":
        // key.w.pressed = true;
        player.attack();
        break;

      default:
    }
  }
  if (!enemy.dead && timer > 0) {
    switch (event.key) {
      //Enemy control
      case "ArrowRight":
        enemy.action.right = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        enemy.action.left = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.velocity.y === 0) {
          enemy.velocity.y = -20;
        }
        break;
      case "ArrowDown":
        enemy.attack();
        break;
      default:
    }
  }
});

window.addEventListener("keyup", (event) => {
  //player key
  switch (event.key) {
    case "d":
      player.action.right = false;
      break;
    case "a":
      player.action.left = false;
      break;
    default:
  }
  //enemy key
  switch (event.key) {
    case "ArrowRight":
      enemy.action.right = false;
      break;
    case "ArrowLeft":
      enemy.action.left = false;
      break;
    default:
  }
});
