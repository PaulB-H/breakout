import Phaser from "phaser";

import { Ball, iBall } from "../objects/Ball";
import { iBlockSprite, iBlock } from "../objects/Block";
import { CloudTimer } from "../objects/Deco/Clouds";
import { iPlayer } from "../objects/Player";
import Power from "../objects/Power";
import { AUDIO } from "../constants";

import { FireBall, LaserBeam, LightningBolt } from "../objects/Projectiles";
import { buildWall } from "../objects/LeafWall";

export default class DemoScene extends Phaser.Scene {
  private balls = 0;
  increaseBallCnt() {
    this.balls++;
  }

  private blocks = 0;
  private lives = 3;
  private heartSprites: Phaser.GameObjects.Sprite[] = [];
  private clamped = true;
  isClamped() {
    return this.clamped;
  }

  private playerStatus: {
    isStunned: boolean;
    lastStunned: number | null;
    lastPos: Phaser.Math.Vector2 | null;
  } = {
    isStunned: false,
    lastStunned: null,
    lastPos: null,
  };

  private ai: {
    active: boolean;
    lastUpdate: null | number;
    x: number;
  } = {
    active: false,
    lastUpdate: null,
    x: 0,
  };

  private touchListener!: (event: TouchEvent) => void;
  private clickListener!: (event: MouseEvent) => void;

  private player!: Phaser.Physics.Arcade.Sprite;
  getPlayerX() {
    return this.player.x;
  }

  private ship!: Phaser.GameObjects.Sprite;
  private newBall!: Phaser.Physics.Arcade.Sprite | null;
  private ballGroup!: Phaser.Physics.Arcade.Group;
  addBallToGroup(ball: Ball) {
    this.ballGroup.add(ball);
  }

  private blockGroup!: Phaser.Physics.Arcade.Group;
  private powerGroup!: Phaser.Physics.Arcade.Group;
  addToPowerGrp(sprite: Phaser.Physics.Arcade.Sprite) {
    this.powerGroup.add(sprite);
  }

  private projectileGroup!: Phaser.Physics.Arcade.Group;
  addToProjectileGrp(sprite: Phaser.Physics.Arcade.Sprite) {
    this.projectileGroup.add(sprite);
  }

  private leafWallGroup!: Phaser.Physics.Arcade.Group;
  addToLeafWallGrp(sprite: Phaser.Physics.Arcade.Sprite) {
    this.leafWallGroup.add(sprite);
  }
  destroyLeafWall() {
    this.leafWallGroup.clear(true, true);
  }

  private leafWallTimer!: Phaser.Time.TimerEvent;
  getLeafWallTimer() {
    return this.leafWallTimer;
  }
  setLeafWallTimer(timer: Phaser.Time.TimerEvent) {
    this.leafWallTimer = timer;
  }
  destroyleafWallTimer() {
    this.leafWallTimer.remove();
  }

  constructor() {
    super("DemoScene");
  }

  preload() {}

  create() {
    /*
      _Contents

      _Default values
      _Lighting
      _Sound & Music
      _Particles
      _Groups
      _Colliders
      _Map & Layers
      _Creating Objects from Object Layers
      _Background / Deco
    */

    /**********************************************/
    // Set/Re-Set _Default Values
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
    this.playerStatus = {
      isStunned: false,
      lastStunned: null,
      lastPos: null,
    };

    // add heart sprites for every life...
    for (let i = 1; i < this.lives + 1; i++) {
      this.heartSprites.push(this.add.sprite(16 * i - 1, 8, "tiles", 32));
    }

    /**********************************************/
    // _Lighting
    /**********************************************/

    // enable 2D light pipeline
    // this.lights.enable().setAmbientColor(0xffffff);
    this.lights.enable().setAmbientColor(0x7f7f7f); // Med intensity ambient
    // this.lights.enable().setAmbientColor(0x3f3f3f);

    this.lights.addLight(80, 0, 300, 0xffffff, 0.25);
    this.lights.addLight(40, 0, 300, 0xffffff, 0.25);
    this.lights.addLight(120, 0, 300, 0xffffff, 0.25);

    // // Light to follow pointer
    // const pointerLight = this.lights.addLight(500, 250, 300).setIntensity(0);
    // this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    //   pointerLight.x = pointer.x;
    //   pointerLight.y = pointer.y;
    // });

    /**********************************************/
    // _Sound & Music
    /**********************************************/

    // Already loaded in preload!
    // However, If we needed to check / do something
    // with background music we could do it here

    /**********************************************/
    // _Particles
    /**********************************************/

    // Need to re-work for phaser 3.6!

    // Create particle emitter - Will be re-used for each effect
    // const myEmit = new ParticleEmitter
    // const puffEmitter = this.add
    //   .particles("tiles")
    //   .setDepth(100)
    //   .createEmitter({
    //     x: 0,
    //     y: 0,
    //     speed: { min: -100, max: 100 },
    //     angle: { min: 0, max: 360 },
    //     scale: { start: 0.5, end: 0 },
    //     // blendMode: "ADD",
    //     blendMode: "NORMAL",
    //     lifespan: 750,
    //     frequency: 50,
    //     frame: 36, // Change depending on particle needed
    //     quantity: 10,
    //   })
    //   .stop();

    // // Make a puff of particles
    // function createPuff(x: number, y: number, frame: number) {
    //   puffEmitter.setPosition(x, y);
    //   puffEmitter.setFrame(frame);
    //   puffEmitter.emitParticle();
    //   puffEmitter.stop();
    // }

    /**********************************************/
    // _Groups
    /**********************************************/
    this.blockGroup = this.physics.add.group({
      immovable: true,
    });

    this.ballGroup = this.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
      maxVelocityX: 199,
      maxVelocityY: 200,
    });

    const playerGroup = this.physics.add.group({
      immovable: true,
    });

    this.powerGroup = this.physics.add.group({
      collideWorldBounds: true,
    });

    const projectileGroup = this.physics.add.group();
    this.projectileGroup = projectileGroup;

    this.leafWallGroup = this.physics.add.group();

    /**********************************************/
    // _Colliders
    /**********************************************/

    // prettier-ignore
    this.physics.add.collider(playerGroup, this.projectileGroup,
      // @ts-ignore
      (player, projectile) => {
        switch ((projectile as any).type) {
          case "fireball":
            if (this.lives >= 1) {
              const targetHeart =
                this.heartSprites.pop() as Phaser.GameObjects.Sprite;

              if (targetHeart) {
                // createPuff(targetHeart.x, targetHeart.y, 32);
                targetHeart.destroy();
              }

              this.cameras.main.shake(250, 0.01);
              this.sound.play(AUDIO.HURT);

              this.lives--;
            }
            projectile.destroy();
            break;
          case "lightningbolt":
            this.playerStatus.isStunned = true;
            this.playerStatus.lastStunned = this.time.now;
            this.player.setFrame(20);
            projectile.destroy();
            break;
          case "laserbeam":
            this.scene.restart();
            projectile.destroy();
            break;
          default:
            break;
        }
      }
    );

    this.physics.add.collider(playerGroup, this.ballGroup, (player, ball) => {
      const playerSprite = player as Phaser.Physics.Arcade.Sprite;
      const ballSprite = ball as Phaser.Physics.Arcade.Sprite;

      this.sound.play(AUDIO.BEEP, { volume: 0.75 });

      this.tweens.add({
        targets: playerSprite,
        y: playerSprite.y + 1,
        duration: 100,
        yoyo: true,
        repeat: 0,
      });

      // Only proceed with custom re-direction logic if ball bottom hits platform
      if (ballSprite.body && !ballSprite.body.blocked.down) return;

      const halfVelocity = Math.floor(
        (Math.abs(ballSprite.body!.velocity.x) +
          Math.abs(ballSprite.body!.velocity.y)) /
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

    this.physics.add.collider(this.ballGroup, this.leafWallGroup, () => {
      this.sound.play(AUDIO.CREAK);
    });

    this.physics.add.collider(this.ballGroup, this.ballGroup);

    this.physics.add.collider(
      this.blockGroup,
      this.ballGroup,
      (block, ball) => {
        const myBall = ball as Ball;

        const myBlock = block as iBlockSprite;

        const color = myBlock.properties.color;

        // Create sound and spawn particles
        // depending on block color / properties
        switch (color) {
          case "green":
            // createPuff(myBlock.x, myBlock.y, 35);
            this.sound.play(AUDIO.LEAF);
            buildWall(this);
            break;
          case "red":
            // createPuff(myBlock.x, myBlock.y, 42);
            this.sound.play(AUDIO.FIRE);
            new FireBall(this, myBlock.x, myBlock.y);
            break;
          case "blue":
            // createPuff(myBlock.x, myBlock.y, 44);
            this.sound.play(AUDIO.BUBBLE, {
              name: "bubbleSound",
              start: 0.5,
            });

            const newBall = new Ball(this, myBlock.x, myBlock.y, "tiles", 47);

            const randX = Phaser.Math.RND.pick([-37, 37]);
            const randY = Phaser.Math.RND.pick([-37, 37]);

            newBall.setVelocity(randX, randY);

            break;
          case "yellow":
            // createPuff(myBlock.x, myBlock.y, 53);
            this.sound.play(AUDIO.ELECTRIC);
            new LightningBolt(this, myBlock.x, myBlock.y);
            break;
          case "pink":
            // createPuff(myBlock.x, myBlock.y, 41);
            this.sound.play(AUDIO.KISS, { volume: 2 });
            this.lives++;
            this.heartSprites.push(
              this.add.sprite(16 * this.lives - 1, 8, "tiles", 32)
            );

            break;
          case "purple":
            // createPuff(myBlock.x, myBlock.y, 5);
            this.sound.play(AUDIO.LASER);
            new LaserBeam(this, myBlock.x, myBlock.y);
            break;
          case "wood":
            // createPuff(myBlock.x, myBlock.y, 19);
            this.sound.play(AUDIO.PLANK);
            break;
          case "glass":
            // createPuff(myBlock.x, myBlock.y, 9);
            this.sound.play(AUDIO.GLASS);
            break;
          case "rock":
            // createPuff(myBlock.x, myBlock.y, 58);
            this.sound.play(AUDIO.ROCK);
            break;
          case "armored":
            myBlock.properties.health--;
            switch (myBlock.properties.health) {
              case 0:
                // createPuff(myBlock.x, myBlock.y, 27);
                this.sound.play(AUDIO.METALBREAK);
                break;
              case 1:
                myBlock.setFrame(26);
                this.sound.play(AUDIO.METAL);
                break;
              case 2:
                myBlock.setFrame(17);
                this.sound.play(AUDIO.METAL);
                break;
              case 3:
                myBlock.setFrame(16);
                this.sound.play(AUDIO.METAL);
                break;
              case 4:
                myBlock.setFrame(7);
                this.sound.play(AUDIO.METAL);
                break;
              default:
                break;
            }
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

        let speedIncrease: 15 | 5 = 15;
        if (myBlock.properties.color === "armored") speedIncrease = 5;

        if (myBall.body) {
          if (myBall.body.velocity.x > 0) {
            myBall.setVelocityX(myBall.body.velocity.x + speedIncrease);
          } else if (myBall.body.velocity.x < 0) {
            myBall.setVelocityX(myBall.body.velocity.x - speedIncrease);
          }

          if (myBall.body.velocity.y > 0) {
            myBall.setVelocityY(myBall.body.velocity.y + speedIncrease);
          } else if (myBall.body.velocity.y < 0) {
            myBall.setVelocityY(myBall.body.velocity.y - speedIncrease);
          }
        }

        if (
          (myBlock.properties.health && myBlock.properties.health <= 0) ||
          !myBlock.properties.health
        ) {
          block.destroy();
          this.blocks--;
        }
      }
    );

    this.physics.add.collider(playerGroup, this.powerGroup, (player, power) => {
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
          this.ballGroup.getChildren().forEach((ball) => {
            const myBall = ball as Ball;
            if (!myBall.body) return;
            myBall.setVelocityX(myBall.body.velocity.x * 0.5);
            myBall.setVelocityY(myBall.body.velocity.y * 0.5);
          });
          power.destroy();
          break;

        case "fast":
          this.ballGroup.getChildren().forEach((ball) => {
            const myBall = ball as Ball;
            if (!myBall.body) return;
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
    // _Map & Layers
    /***********************************************/

    // Create Tilemap
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage("breakout-extruded", "tiles");

    // Create reference to tileset & its data
    const tileset = map.getTileset(
      "breakout-extruded"
    ) as Phaser.Tilemaps.Tileset;

    // Get object layers
    const blocksLayer = map.getObjectLayer("blocks");
    const playerLayer = map.getObjectLayer("player");
    const ballLayer = map.getObjectLayer("ball");
    const powersLayer = map.getObjectLayer("powers");

    if (!blocksLayer || !playerLayer || !ballLayer || !powersLayer || !tileset)
      return;

    // Draw on the decoration layer (just spikes right now)
    map.createLayer("deco", tileset)!.setPipeline("Light2D");

    /**********************************************/
    // _Creating Objects from Object Layers
    /**********************************************/

    // Psst! Controls are in here too...
    playerLayer.objects.forEach((player) => {
      const myPlayer = player as iPlayer;

      myPlayer.x += map.tileWidth * 0.5;
      myPlayer.y -= map.tileHeight * 0.5;

      class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
        shiplight: Phaser.GameObjects.Light | null;

        constructor(scene: DemoScene, x: number, y: number) {
          super(scene, x, y, "tiles", 10);

          // this.shiplight = scene.lights.addLight(80, 120, 1000, 0x7f0000, 1);
          this.shiplight = null;
        }

        preUpdate() {
          if (this.shiplight) this.shiplight.setPosition(this.x, this.y);
        }
      }

      const sprite = new PlayerSprite(this, myPlayer.x, myPlayer.y);

      this.physics.add.existing(sprite);
      this.add.existing(sprite);

      sprite.setSize(16, 3);

      sprite.scaleX += 1;

      sprite.setPipeline("Light2D");

      // This ship sprite (non physics) "attaches" to the
      // platform by matching its x position in preUpdate(){}
      class Ship extends Phaser.GameObjects.Sprite {
        platform: Phaser.Physics.Arcade.Sprite;
        constructor(
          scene: Phaser.Scene,
          x: number,
          y: number,
          platform: Phaser.Physics.Arcade.Sprite
        ) {
          super(scene, x, y + 10, "tiles", 40);

          this.platform = platform;

          scene.add.existing(this);
        }
        preUpdate() {
          this.x = this.platform.x;
        }
      }
      this.ship = new Ship(this, myPlayer.x, myPlayer.y, sprite);

      this.ship.setPipeline("Light2D");

      playerGroup.add(sprite);

      this.player = sprite;

      this.playerStatus.lastPos = new Phaser.Math.Vector2(sprite.x, sprite.y);

      sprite.setDepth(10);

      /***********************************************/
      // Controls... how did these end up in here...
      /***********************************************/
      this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        if (!this.playerStatus.isStunned) {
          sprite.x = pointer.worldX;
        }
      });
      this.input.on("pointerdown", () => {
        if (this.clamped && this.newBall) {
          this.newBall.setVelocityY(-50);
          this.clamped = false;
        }
      });
      this.touchListener = (event: TouchEvent) => {
        if (!this.playerStatus.isStunned) {
          const canvasRect = this.game.canvas.getBoundingClientRect();
          const scaleFactor =
            this.game.canvas.width / this.game.canvas.offsetWidth;

          const touchX =
            (event.changedTouches[0].clientX - canvasRect.left) * scaleFactor;
          // @ts-ignore
          // const touchY = (event.changedTouches[0].clientY - canvasRect.top) * scaleFactor;

          sprite.x = touchX;
        }
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

      if (
        blockSprite.properties.color &&
        blockSprite.properties.color === "rock"
      ) {
        blockSprite.setCircle(8);
      }

      blockSprite.setPipeline("Light2D");

      this.blocks++;
      this.blockGroup.add(blockSprite);
    });

    // // Create a platform-expand power
    // new Power(this, 10, 10, undefined, 12, tileset);
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
      if (this.powerGroup.contains(body.gameObject)) {
        body.gameObject.destroy();
      }
    });

    // World bounds event to destroy balls that hit the bottom
    // The object itself must be emitting worldbounds events to trigger this
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject && this.ballGroup.contains(body.gameObject)) {
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
              // createPuff(targetHeart.x, targetHeart.y, 32);
              targetHeart.destroy();
            }

            // Larger shake and sound on life lost
            this.cameras.main.shake(250, 0.01);
            this.sound.play(AUDIO.HURT);

            this.lives--;

            this.newBall = new Ball(
              this,
              this.player.x + 16,
              this.player.y - 6,
              "tiles",
              11
            );
            this.clamped = true;
          }
        } else if (!this.clamped) {
          this.sound.play(AUDIO.BEEP, { volume: 0.75 });
        }
      }
    });

    /**********************************************/
    // _Background / Deco
    /**********************************************/
    new CloudTimer(this, 1250).start();

    // const volcanobg = this.add
    //   .sprite(80, 120, "volcanobg")
    //   .setDepth(-8)
    //   .setPipeline("Light2D");
    // this.anims.create({
    //   key: "volcanobg_anim",
    //   frames: this.anims.generateFrameNumbers("volcanobg", {
    //     start: 0,
    //     end: 5,
    //   }),
    //   frameRate: 3,
    //   repeat: -1,
    // });
    // volcanobg.anims.play("volcanobg_anim");

    this.add.image(80, 120, "mountainbg").setDepth(-10).setPipeline("Light2D");

    const gradient = this.add.image(80, 120, "bluegradientbg");
    gradient.setDepth(-100);
  }

  update(t: number) {
    // We need to set min velocity this way...
    // no way to set min velocity on a physics group...
    // if (this.ball.body !== undefined && !this.clamped) {
    //   if (Math.abs(this.ball.body.velocity.y) - 10 <= 0) {
    //     this.ball.setVelocityY(20);
    //   }
    // }

    if (this.playerStatus.isStunned && this.playerStatus.lastStunned) {
      if (this.time.now - this.playerStatus.lastStunned > 1000) {
        this.playerStatus.isStunned = false;
        this.playerStatus.lastStunned = null;
        this.player.setFrame(10);
      }
    }

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
    if (this.ai.active && !this.playerStatus.isStunned) {
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

    // Rough way to change sprite based on direction of player movement
    // NOT using velocity, since player moves without using it

    const currentPosition = new Phaser.Math.Vector2(
      this.player.x,
      this.player.y
    );

    const distance = Phaser.Math.Distance.BetweenPoints(
      currentPosition,
      this.playerStatus.lastPos!
    );

    if (distance > 0) {
      if (currentPosition.x > this.playerStatus.lastPos!.x) {
        this.ship.setFrame(60);
      } else if (currentPosition.x < this.playerStatus.lastPos!.x) {
        this.ship.setFrame(50);
      }
    } else {
      this.ship.setFrame(40);
    }
    this.playerStatus.lastPos!.copy(currentPosition);
  }
}
