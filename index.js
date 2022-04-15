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

const key = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
};

decreateTimer();
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

  if (key.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
  } else if (key.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  //enemy movement
  if (key.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else if (key.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  //detect for collision
  if (
    rectangularCollision({ rectangular1: player, rectangular2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.takeHit();

    // document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    gsap.to("#enemyHealth", {
      width: enemy.health + "%"
    });
  }

  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }
  if (
    rectangularCollision({ rectangular1: enemy, rectangular2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    // document.querySelector("#playerHealth").style.width = player.health + "%";
    gsap.to("#playerHealth", {
      width: player.health + "%"
    });
  }

  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }
  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timeID });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    // console.log(event.key);w
    switch (event.key) {
      case "d":
        key.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        key.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        // key.w.pressed = true;
        player.velocity.y = -20;
        console.log(event.key);
        break;
      case " ":
        // key.w.pressed = true;
        player.attack();
        break;

      default:
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      //Enemy control
      case "ArrowRight":
        key.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        key.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
      default:
    }
  }
});

window.addEventListener("keyup", (event) => {
  console.log(event.key);
  //player key
  switch (event.key) {
    case "d":
      key.d.pressed = false;
      break;
    case "a":
      key.a.pressed = false;
      break;
    default:
  }
  //enemy key
  switch (event.key) {
    case "ArrowRight":
      key.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      key.ArrowLeft.pressed = false;
      break;
    default:
  }
});
