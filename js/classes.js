class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frameMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameMax = frameMax;
    this.frameCurrent = 0;
    this.frameElapse = 0;
    this.frameHold = 5;
    this.offset = offset;
  }
  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameMax) * this.scale,
      this.image.height * this.scale
    );
  }
  animateFrames() {
    this.frameElapse++;
    if (this.frameElapse % this.frameHold === 0) {
      if (this.frameCurrent < this.frameMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }
  udpate() {
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    frameMax = 1,
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
    super({
      position,
      imageSrc,
      scale,
      frameMax,
      offset
    });

    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    };
    this.lastKey;
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.frameElapse = 0;
    this.frameHold = 5;
    this.sprites = sprites;
    this.dead = false;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  // draw() {
  //   c.fillStyle = this.color;
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height);

  //   if (this.isAttacking) {
  //     c.fillStyle = "green";
  //     c.fillRect(
  //       this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     );
  //   }
  // }
  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprites("death");
    } else this.switchSprites("takeHit");
  }
  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 100);
  }

  udpate() {
    this.draw();
    if (!this.dead) this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    // this.velocity.y += gravity;
    //draw attack box
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }
  switchSprites(sprite) {
    //overrided all action when death
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.frameMax - 1)
        this.dead = true;
      return;
    }

    //overrided all action when attack
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.frameMax - 1
    )
      return;
    //overrided all action when takehit
    if (
      this.image === this.sprites.takeHit.image &&
      this.frameCurrent < this.sprites.takeHit.frameMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frameMax = this.sprites.idle.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frameMax = this.sprites.run.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frameMax = this.sprites.jump.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frameMax = this.sprites.fall.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frameMax = this.sprites.attack1.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.frameMax = this.sprites.takeHit.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.frameMax = this.sprites.death.frameMax;
          this.frameCurrent = 0;
        }
        break;
      default:
        break;
    }
  }
}
