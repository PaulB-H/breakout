import Phaser from "phaser";

import { Ball, iBall } from "./objects/Ball";
import { iBlockSprite, iBlock } from "./objects/Block";
import { CloudTimer } from "./objects/Deco/Clouds";
import { iPlayer } from "./objects/Player";
import Power from "./objects/Power";
import { AUDIO, FONT_KEYS } from "./constants";

import { FireBall, LaserBeam, LightningBolt } from "./objects/Projectiles";

export default class DemoScene extends Phaser.Scene {
  balls = 0;
  blocks = 0;
  lives = 3;
  heartSprites: Phaser.GameObjects.Sprite[] = [];
  clamped = true;

  ai: {
    active: boolean;
    lastUpdate: null | number;
    x: number;
  } = {
    active: false,
    lastUpdate: null,
    x: 0,
  };

  touchListener!: (event: TouchEvent) => void;
  clickListener!: (event: MouseEvent) => void;

  player!: Phaser.Physics.Arcade.Sprite;
  newBall!: Phaser.Physics.Arcade.Sprite | null;

  ballGroup!: Phaser.Physics.Arcade.Group;
  blockGroup!: Phaser.Physics.Arcade.Group;
  powerGroup!: Phaser.Physics.Arcade.Group;

  constructor() {
    super("game");
  }

  preload() {
    this.load.spritesheet("tiles", "assets/breakout-extruded.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 2,
      margin: 1,
    });

    this.load.tilemapTiledJSON("map", "assets/breakout.json");

    const fonts = [
      {
        key: FONT_KEYS.VCR_WHITE,
        png: "assets/font/vcr-white/vcr-white.png",
        xml: "assets/font/vcr-white/vcr-white.xml",
      },
      {
        key: FONT_KEYS.VCR_BLACK,
        png: "assets/font/vcr-black/vcr-black.png",
        xml: "assets/font/vcr-black/vcr-black.xml",
      },
    ];

    for (const font of fonts) {
      this.load.bitmapFont(font.key, font.png, font.xml);
    }

    this.load.audio([
      { key: AUDIO.FIRE, url: "assets/sounds/fire.mp3" },
      { key: AUDIO.BUBBLE, url: "assets/sounds/bubble.mp3" },
      { key: AUDIO.LEAF, url: "assets/sounds/leaf.mp3" },
      { key: AUDIO.ELECTRIC, url: "assets/sounds/electric.mp3" },
      { key: AUDIO.KISS, url: "assets/sounds/kiss.mp3" },
      { key: AUDIO.LASER, url: "assets/sounds/laser.mp3" },
      { key: AUDIO.HURT, url: "assets/sounds/hurt.mp3" },
      { key: AUDIO.PLANK, url: "assets/sounds/planks.mp3" },
      { key: AUDIO.BEEP, url: "assets/sounds/beep.mp3" },
    ]);

    this.load.atlas(
      "cloud-atlas",
      "assets/clouds/cloud-atlas.png",
      "assets/clouds/cloud-atlas.json"
    );
  }

  create() {
    /**********************************************/
    // Set/Re-Set Default Values
    /**********************************************/
    this.blocks = 0;
    this.balls = 0;
    this.lives = 3;
    this.heartSprites = [];
    this.clamped = true;
    this.ai = {
      active: false,
      lastUpdate: null,
      x: 0,
    };

    // add heart sprites for every life...
    for (let i = 1; i < this.lives + 1; i++) {
      this.heartSprites.push(this.add.sprite(16 * i - 1, 8, "tiles", 32));
    }

    /**********************************************/
    // Sound & Music
    /**********************************************/

    // Already loaded in preload!
    // However, If we needed to check / do something
    // with background music we could do it here

    /**********************************************/
    // Particles
    /**********************************************/

    // Create particle emitter - Will be re-used for each effect
    const puffEmitter = this.add
      .particles("tiles")
      .setDepth(100)
      .createEmitter({
        x: 0,
        y: 0,
        speed: { min: -100, max: 100 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        // blendMode: "ADD",
        blendMode: "NORMAL",
        lifespan: 750,
        frequency: 50,
        frame: 36, // Change depending on particle needed
        quantity: 10,
      })
      .stop();

    // Make a puff of particles
    function createPuff(x: number, y: number, frame: number) {
      puffEmitter.setPosition(x, y);
      puffEmitter.setFrame(frame);
      puffEmitter.emitParticle();
      puffEmitter.stop();
    }

    /**********************************************/
    // Physics groups & Colliders
    /**********************************************/
    const blockGroup = this.physics.add.group({
      immovable: true,
    });
    this.blockGroup = blockGroup;

    const ballGroup = this.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
      maxVelocityX: 199,
      maxVelocityY: 200,
    });
    this.ballGroup = ballGroup;

    const playerGroup = this.physics.add.group({
      immovable: true,
    });

    const powerGroup = this.physics.add.group({
      collideWorldBounds: true,
    });
    this.powerGroup = powerGroup;

    this.physics.add.collider(playerGroup, ballGroup, (player, ball) => {
      const playerSprite = player as Phaser.Physics.Arcade.Sprite;
      const ballSprite = ball as Phaser.Physics.Arcade.Sprite;

      this.sound.play(AUDIO.BEEP, { volume: 0.75 });

      // Only proceed with custom re-direction logic if ball bottom hits platform
      if (!ballSprite.body.blocked.down) return;

      const halfVelocity = Math.floor(
        (Math.abs(ballSprite.body.velocity.x) +
          Math.abs(ballSprite.body.velocity.y)) /
          2
      );

      const playerWidth = playerSprite.width;

      const leftTip = playerSprite.x - playerWidth / 2 + 2;
      const rightTip = playerSprite.x + playerWidth / 2 - 2;

      if (ballSprite.x < playerSprite.x - 2) {
        if (ballSprite.x < leftTip) {
          // ("left tip hit");
          ballSprite.setVelocityX(-(halfVelocity + halfVelocity / 2));
          ballSprite.setVelocityY(-(halfVelocity / 2));
        } else {
          // ("left hit");
          ballSprite.setVelocityX(-halfVelocity);
          ballSprite.setVelocityY(-halfVelocity);
        }
      } else if (ballSprite.x > playerSprite.x + 2) {
        if (ballSprite.x > rightTip) {
          // ("right tip hit");
          ballSprite.setVelocityX(halfVelocity + halfVelocity / 2);
          ballSprite.setVelocityY(-(halfVelocity / 2));
        } else {
          // ("right hit");
          ballSprite.setVelocityX(halfVelocity);
          ballSprite.setVelocityY(-halfVelocity);
        }
      } else {
        // ("center hit");
        ballSprite.setVelocityY(-halfVelocity * 2);
        ballSprite.setVelocityX(0);
      }
    });

    // We haven't enabled multiple-ball powers yet, but I think I want them to collide with each other
    this.physics.add.collider(ballGroup, ballGroup);

    this.physics.add.collider(blockGroup, ballGroup, (block, ball) => {
      const myBall = ball as Ball;

      const myBlock = block as iBlockSprite;

      const color = myBlock.properties.color;

      // Create sound and spawn particles
      // depending on block color / properties
      switch (color) {
        case "green":
          createPuff(myBlock.x, myBlock.y, 35);
          this.sound.play(AUDIO.LEAF);
          break;
        case "red":
          createPuff(myBlock.x, myBlock.y, 42);
          this.sound.play(AUDIO.FIRE);
          new FireBall(this, myBlock.x, myBlock.y);
          break;
        case "blue":
          createPuff(myBlock.x, myBlock.y, 44);
          this.sound.play(AUDIO.BUBBLE, {
            name: "bubbleSound",
            start: 0.5,
          });
          break;
        case "yellow":
          createPuff(myBlock.x, myBlock.y, 53);
          this.sound.play(AUDIO.ELECTRIC);
          new LightningBolt(this, myBlock.x, myBlock.y);
          break;
        case "pink":
          createPuff(myBlock.x, myBlock.y, 41);
          this.sound.play(AUDIO.KISS, { volume: 2 });
          break;
        case "purple":
          createPuff(myBlock.x, myBlock.y, 5);
          this.sound.play(AUDIO.LASER);
          new LaserBeam(this, myBlock.x, myBlock.y);
          break;
        case "wood":
          createPuff(myBlock.x, myBlock.y, 19);
          this.sound.play(AUDIO.PLANK);
          break;
        default:
          break;
      }

      // 10%-ish chance of spawning power
      if (Math.random() <= 0.1) {
        new Power(
          this,
          myBlock.x,
          myBlock.y,
          undefined,
          Math.floor(Math.random() * 4) + 12,
          tileset
        );
      }

      // this.player.scaleX += 0.1;

      const speedIncrease = 25;

      if (ball.body.velocity.x > 0) {
        myBall.setVelocityX(myBall.body.velocity.x + speedIncrease);
      } else {
        myBall.setVelocityX(myBall.body.velocity.x - speedIncrease);
      }

      if (ball.body.velocity.y > 0) {
        myBall.setVelocityY(myBall.body.velocity.y + speedIncrease);
      } else {
        myBall.setVelocityY(myBall.body.velocity.y - speedIncrease);
      }

      block.destroy();
      this.blocks--;
    });

    this.physics.add.collider(playerGroup, powerGroup, (player, power) => {
      const playerSprite = player as Phaser.Physics.Arcade.Sprite;
      const powerSprite = power as Power;

      switch (powerSprite.properties.power) {
        case "grow":
          playerSprite.scaleX += 0.5;
          power.destroy();
          break;

        case "shrink":
          playerSprite.scaleX -= 0.5;
          if (playerSprite.scaleX < 1) playerSprite.scaleX = 1;
          if (playerSprite.scaleX > 5) playerSprite.scaleX = 5;
          power.destroy();
          break;

        case "slow":
          ballGroup.getChildren().forEach((ball) => {
            const myBall = ball as Ball;
            myBall.setVelocityX(myBall.body.velocity.x * 0.5);
            myBall.setVelocityY(myBall.body.velocity.y * 0.5);
          });
          power.destroy();
          break;

        case "fast":
          ballGroup.getChildren().forEach((ball) => {
            const myBall = ball as Ball;
            myBall.setVelocityX(myBall.body.velocity.x * 1.5);
            myBall.setVelocityY(myBall.body.velocity.y * 1.5);
          });
          power.destroy();
          break;

        case "multi":
          // Setup multi-ball power here
          break;

        default:
          break;
      }
    });

    /***********************************************/
    // Map & Layers
    /***********************************************/

    // Create Tilemap
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage("breakout-extruded", "tiles");

    // Create reference to tileset & its data
    const tileset = map.getTileset("breakout-extruded");

    // Get object layers
    const blocksLayer = map.getObjectLayer("blocks");
    const playerLayer = map.getObjectLayer("player");
    const ballLayer = map.getObjectLayer("ball");
    const powersLayer = map.getObjectLayer("powers");

    // Draw on the decoration layer (just spikes right now)
    map.createLayer("deco", tileset);

    /**********************************************/
    // Creating Objects from Object Layers
    /**********************************************/

    playerLayer.objects.forEach((player) => {
      const myPlayer = player as iPlayer;

      myPlayer.x += map.tileWidth * 0.5;
      myPlayer.y -= map.tileHeight * 0.5;

      const sprite = this.physics.add.sprite(
        myPlayer.x,
        myPlayer.y,
        "tiles",
        myPlayer.gid - 1
      );
      sprite.setSize(16, 3);

      playerGroup.add(sprite);

      this.player = sprite;

      this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        sprite.x = pointer.worldX;
      });

      this.input.on("pointerdown", () => {
        if (this.clamped && this.newBall) {
          this.newBall.setVelocityY(-50);
          this.clamped = false;
        }
      });

      this.touchListener = (event: TouchEvent) => {
        const canvasRect = this.game.canvas.getBoundingClientRect();
        const scaleFactor =
          this.game.canvas.width / this.game.canvas.offsetWidth;

        const touchX =
          (event.changedTouches[0].clientX - canvasRect.left) * scaleFactor;
        // @ts-ignore
        // const touchY = (event.changedTouches[0].clientY - canvasRect.top) * scaleFactor;

        sprite.x = touchX;
      };

      this.clickListener = () => {
        if (this.clamped && this.newBall) {
          this.newBall.setVelocityY(-50);
          this.clamped = false;
        }
      };

      document.addEventListener("mousedown", this.clickListener);

      document.addEventListener("touchmove", this.touchListener);
    });

    ballLayer.objects.forEach((ball) => {
      const myBall = ball as iBall;

      myBall.x += map.tileWidth * 0.5;
      myBall.y -= map.tileHeight * 0.5;

      const newBall = new Ball(
        this,
        myBall.x,
        myBall.y,
        "tiles",
        myBall.gid - 1
      );

      this.newBall = newBall;
    });

    blocksLayer.objects.forEach((block) => {
      const myBlock = block as iBlock;

      myBlock.x += map.tileWidth * 0.5;
      myBlock.y -= map.tileHeight * 0.5;

      const blockSprite = this.physics.add.sprite(
        myBlock.x,
        myBlock.y,
        "tiles",
        myBlock.gid - 1
      ) as iBlockSprite;

      if (myBlock.properties) {
        const blockProperties = myBlock.properties.reduce(
          (result, { name, value }) => {
            result[name] = value;
            return result;
          },
          {} as { [key: string]: any }
        );
        blockSprite.properties = blockProperties;
      }

      this.blocks++;
      blockGroup.add(blockSprite);
    });

    // Create a platform-expand power
    new Power(this, 10, 10, undefined, 12, tileset);
    // Not really using this layer
    powersLayer.objects.forEach((power) => {
      // (power.properties[0].name);
      interface iPowerTile extends Phaser.Types.Tilemaps.TiledObject {
        x: number;
        y: number;
        gid: number;
      }
      const powerTile = power as iPowerTile;

      powerTile.x += map.tileWidth * 0.5;
      powerTile.y -= map.tileHeight * 0.5;

      new Power(
        this,
        powerTile.x,
        powerTile.y,
        undefined,
        powerTile.gid - 1,
        tileset
      );
    });

    // World bounds event to destroy powers that hit the bottom
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (powerGroup.contains(body.gameObject)) {
        body.gameObject.destroy();
      }
    });

    // World bounds event to destroy balls that hit the bottom
    // The object itself must be emitting worldbounds events to trigger this
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject && ballGroup.contains(body.gameObject)) {
        if (body.blocked.down) {
          this.cameras.main.shake(250, 0.005);
          body.gameObject.destroy();
          this.balls--;

          // Only lose a life if out of balls
          if (this.lives >= 1 && this.balls <= 0) {
            // More than 1 life left, pop a heart
            const targetHeart =
              this.heartSprites.pop() as Phaser.GameObjects.Sprite;

            // .. Just make sure targetHeart exists..
            if (targetHeart) {
              createPuff(targetHeart.x, targetHeart.y, 32);
              targetHeart.destroy();
            }

            // Larger shake and sound on life lost
            this.cameras.main.shake(250, 0.01);
            this.sound.play(AUDIO.HURT);

            this.lives--;
          }

          this.newBall = new Ball(
            this,
            this.player.x + 16,
            this.player.y - 6,
            "tiles",
            11
          );
          this.clamped = true;
        } else if (!this.clamped) {
          this.sound.play(AUDIO.BEEP, { volume: 0.75 });
        }
      }
    });

    /**********************************************/
    // Background Clouds
    /**********************************************/
    new CloudTimer(this, 1250).start();
  }

  update(t: number) {
    // We need to set min velocity this way...
    // no way to set min velocity on a physics group...
    // if (this.ball.body !== undefined && !this.clamped) {
    //   if (Math.abs(this.ball.body.velocity.y) - 10 <= 0) {
    //     this.ball.setVelocityY(20);
    //   }
    // }

    if (this.clamped && this.newBall) {
      this.newBall.x = this.player.x;
    }

    if (this.blocks === 1) {
      const target = this.blockGroup.children
        .entries[0] as Phaser.Physics.Arcade.Sprite;

      this.ballGroup.getChildren().forEach((ball) => {
        const myBall = ball as Phaser.Physics.Arcade.Sprite;
        const newX = Phaser.Math.Linear(myBall.x, target.x, 0.075);
        const newY = Phaser.Math.Linear(myBall.y, target.y, 0.075);
        myBall.setVelocity(0, 0);
        myBall.x = newX;
        myBall.y = newY;
      });
    }

    // My "AI"
    // Using "LERP" we get a more natural AI
    // That can actually miss the ball sometimes
    if (this.ai.active) {
      if (this.clamped && this.newBall) {
        this.newBall.setVelocityY(-50);
        this.clamped = false;
      }

      if (!this.ai.lastUpdate) {
        this.ai.lastUpdate = t;
      }

      if (t - this.ai.lastUpdate > 3000) {
        // ("Over 5 seconds, nudge loc");
        this.ai.x = Math.floor(Math.random() * 21) - 10;
        this.ai.lastUpdate = t;
      }

      const LERP = 0.5;
      const targetX = this.newBall!.x + this.ai.x;
      const currentX = this.player.x;
      const newX = Phaser.Math.Linear(currentX, targetX, LERP);
      this.player.x = newX;
    }

    if (this.blocks <= 0 || this.lives <= 0) {
      document.removeEventListener("touchmove", this.touchListener);
      document.removeEventListener("mousedown", this.clickListener);
      this.scene.restart();
    }
  }
}
