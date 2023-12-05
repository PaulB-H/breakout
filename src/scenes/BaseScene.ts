import Phaser from "phaser";

import { Ball } from "../objects/Ball";
import { iBlockSprite } from "../objects/Block";
import { CloudTimer } from "../objects/Deco/Clouds";
import Power from "../objects/Power";
import {
  AUDIO,
  IMAGES,
  SCENES,
  SHEETS,
  BUTTONS,
  REGISTRY,
  PIPELINES,
} from "../constants";

import {
  FireBall,
  IceSpike,
  LaserBeam,
  LightningBolt,
} from "../objects/Projectiles";
import { buildWall } from "../objects/LeafWall";
// import { parseMap } from "./parseMap";

import BaseUIDiv from "./BaseUIDiv";

interface UIElements {
  baseSceneUI: HTMLDivElement;
  score: HTMLHeadElement;
}

export default class BaseScene extends Phaser.Scene {
  private UIElements!: UIElements;

  cloudTimer!: CloudTimer;

  private balls = 0;
  increaseBallCnt() {
    this.balls++;
  }

  private blocks = 0;
  increaseBlockCnt() {
    this.blocks++;
  }
  addToBlockGrp(sprite: Phaser.Physics.Arcade.Sprite) {
    this.blockGroup.add(sprite);
  }

  private lives = 3;
  private heartSprites: Phaser.GameObjects.Sprite[] = [];

  addHeartSprite() {
    do {
      this.heartSprites.push(
        this.add.sprite(16 * this.heartSprites.length - 8, 7, SHEETS.Tiles, 32)
      );
    } while (this.heartSprites.length < this.lives);
  }

  deleteHeartSprite() {
    const targetHeart = this.heartSprites.pop();
    if (targetHeart) {
      targetHeart.destroy();
    }
  }

  private clamped = true;
  isClamped() {
    return this.clamped;
  }
  setClamped(boolean: boolean) {
    this.clamped = boolean;
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
  updatePlayerLoc(loc: Phaser.Math.Vector2) {
    this.playerStatus.lastPos = loc;
  }
  checkIfStunned() {
    return this.playerStatus.isStunned;
  }

  private ai: {
    active: boolean;
    lastUpdate: null | number;
    lastNudgeAmnt: null | number;
    x: number;
  } = {
    active: false,
    lastUpdate: null,
    lastNudgeAmnt: null,
    x: 0,
  };
  checkAiEnabled() {
    return this.ai.active;
  }
  toggleAi() {
    this.ai.active = !this.checkAiEnabled();
  }

  private touchMoveFunc: any;
  setTouchMoveFunc(passedFunc: any) {
    this.touchMoveFunc = passedFunc;
  }

  private clickFunc!: any;
  setClickFunc(passedFunc: any) {
    this.clickFunc = passedFunc;
  }

  private player!: Phaser.Physics.Arcade.Sprite;
  setPlayer(sprite: Phaser.Physics.Arcade.Sprite) {
    this.player = sprite;
  }
  getPlayer() {
    return this.player;
  }
  getPlayerX() {
    return this.player.x;
  }
  private playerGroup!: Phaser.Physics.Arcade.Group;
  addToPlayerGrp(sprite: Phaser.Physics.Arcade.Sprite) {
    this.playerGroup.add(sprite);
  }

  private ship!: Phaser.GameObjects.Sprite;
  setShip(sprite: Phaser.GameObjects.Sprite) {
    this.ship = sprite;
  }
  private newBall!: Phaser.Physics.Arcade.Sprite | null;
  getNewBall() {
    return this.newBall;
  }
  setNewBall(sprite: Phaser.Physics.Arcade.Sprite) {
    this.newBall = sprite;
  }
  launchBall(num: number) {
    if (this.newBall && this.newBall.body) this.newBall.setVelocityY(num);
  }
  private ballGroup!: Phaser.Physics.Arcade.Group;
  addBallToGroup(ball: Ball) {
    this.ballGroup.add(ball);
  }

  private wallGroup!: Phaser.Physics.Arcade.Group;
  addToWallGroup(wall: any) {
    this.wallGroup.add(wall);
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

  constructor(key: any) {
    super(key);
  }

  backgroundImage!: any;

  preload() {}

  create() {
    const menuBtn = this.add.sprite(140, 10, BUTTONS.MenuBTN).setDepth(2);
    menuBtn.setInteractive();
    // menuBtn.setActive(true);
    // if (menuBtn.input) menuBtn.input.enabled = true;
    menuBtn.on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch(SCENES.PauseScene, { pausedSceneKey: this.scene.key });
      this.registry.set("pausedSceneKey", this.scene.key);
    });

    // Emergency workaround to fix missing frame
    // https://github.com/PaulB-H/breakout/issues/1
    if (this.textures.get(SHEETS.Tiles).frameTotal < 101) {
      console.log(
        `ERR
Spritesheet should have 101 frames but only has: ${
          this.textures.get(SHEETS.Tiles).frameTotal
        }
Reloading page...`
      );

      // Removing cache and re-running preloader didn't
      // resolve, but I like the idea of this over a page reload...
      // this.cache.destroy();
      // this.scene.start("PreloaderScene");

      location.reload();
    }
    /*
      _Contents

      _Default values
      _UI
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
      lastNudgeAmnt: null,
      x: 0,
    };
    this.playerStatus = {
      isStunned: false,
      lastStunned: null,
      lastPos: null,
    };

    // add heart sprites for every life...
    for (let i = 1; i < this.lives; i++) {
      this.addHeartSprite();
    }

    /**********************************************/
    // _UI
    /**********************************************/

    const existingUI = document.getElementById(
      "base-scene-ui"
    ) as HTMLDivElement;

    if (BaseUIDiv.getInstance(existingUI))
      BaseUIDiv.getInstance(existingUI)!.customRemove();

    const baseSceneUI = new BaseUIDiv("base-scene-ui").getDiv();
    const score = document.createElement("h3");

    this.UIElements = { baseSceneUI, score };

    this.UIElements.score.innerText = "Blocks: 0";

    score.style.cssText = `
      // width: 100%;
      font-size: 5cqw;
      padding: 5px;
      margin-top: 1%;
      margin-left: 40%;
      font-family: vcr-black;
      visibility: hidden;
    `;

    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", baseSceneUI);

    baseSceneUI.insertAdjacentElement("beforeend", score);

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

    // const myVar: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig;
    // const myVar: Phaser.GameObjects.Particles.ParticleEmitter;

    const emitter = this.add
      .particles(0, 0, SHEETS.Tiles, {
        lifespan: 750,
        speed: { min: 10, max: 100 },
        scale: { start: 1, end: 0 },
        rotate: {
          min: 0,
          max: 360,
        },
        radial: true,
        gravityY: 100,
        emitting: false,
      })
      .setDepth(100)
      .setPipeline(PIPELINES.Light2D);

    /**********************************************/
    // _Groups
    /**********************************************/
    this.blockGroup = this.physics.add.group({
      immovable: true,
    });
    this.wallGroup = this.physics.add.group({
      immovable: true,
    });

    this.ballGroup = this.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
      maxVelocityX: 250,
      maxVelocityY: 250,
    });

    this.playerGroup = this.physics.add.group({
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

    // player & projectiles
    this.physics.add.collider(
      this.playerGroup,
      this.projectileGroup,
      (player, projectile) => {
        const myPlayer = player as Phaser.Physics.Arcade.Sprite;
        interface iProjectile extends Phaser.Physics.Arcade.Sprite {
          type: string;
        }
        switch ((projectile as iProjectile).type) {
          case "fireball":
            if (this.lives >= 1) {
              this.deleteHeartSprite();

              this.cameras.main.shake(250, 0.01);
              this.sound.play(AUDIO.HURT);

              this.lives--;
            }
            projectile.destroy();
            break;
          case "lightningbolt":
            this.playerStatus.isStunned = true;
            this.playerStatus.lastStunned = this.time.now;
            myPlayer.setFrame(20);
            projectile.destroy();
            break;
          case "laserbeam":
            projectile.destroy();
            this.scene.restart();
            break;
          case "icespike":
            if (this.lives >= 1) {
              this.deleteHeartSprite();

              this.cameras.main.shake(250, 0.01);
              this.sound.play(AUDIO.HURT);

              this.lives--;
            }
            projectile.destroy();
            break;
          default:
            break;
        }
      }
    );

    // player & balls
    this.physics.add.collider(
      this.playerGroup,
      this.ballGroup,
      (player, ball) => {
        const playerSprite = player as Phaser.Physics.Arcade.Sprite;
        const ballSprite = ball as Phaser.Physics.Arcade.Sprite;

        this.sound.play(AUDIO.BEEP, { volume: 0.75 });

        this.tweens.add({
          targets: playerSprite,
          y: playerSprite.y + 1,
          duration: 100,
          yoyo: true,
          repeat: 0,
          onComplete: () => {
            playerSprite.y = 210;
          },
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
      }
    );

    // balls & leafWalls
    this.physics.add.collider(this.ballGroup, this.leafWallGroup, () => {
      this.sound.play(AUDIO.CREAK);
    });

    // balls & balls
    this.physics.add.collider(this.ballGroup, this.ballGroup);

    // blocks & balls
    this.physics.add.collider(
      this.blockGroup,
      this.ballGroup,
      (block, ball) => {
        const myBall = ball as Ball;

        const myBlock = block as iBlockSprite;

        const color = myBlock.properties.color;

        const newScore = parseInt(this.registry.get(REGISTRY.score)) + 1;

        this.UIElements.score.innerText = `Blocks: ${newScore}`;

        this.registry.set(REGISTRY.score, newScore);

        // Create sound and spawn particles
        // depending on block color / properties
        switch (color) {
          case "green":
            emitter.setEmitterFrame(94);
            emitter.explode(10, myBlock.x, myBlock.y);
            this.sound.play(AUDIO.LEAF);
            buildWall(this);
            break;
          case "red":
            emitter.setEmitterFrame(42);
            emitter.explode(10, myBlock.x, myBlock.y);
            this.sound.play(AUDIO.FIRE);
            new FireBall(this, myBlock.x, myBlock.y);
            break;
          case "blue":
            this.sound.play(AUDIO.BUBBLE, {
              name: AUDIO.BUBBLE,
              start: 0.5,
            });

            const newBall = new Ball(
              this,
              myBlock.x,
              myBlock.y,
              SHEETS.Tiles,
              47
            );

            const randX = Phaser.Math.RND.pick([-37, 37]);
            const randY = Phaser.Math.RND.pick([-37, 37]);

            newBall.setVelocity(randX, randY);

            break;
          case "yellow":
            this.sound.play(AUDIO.ELECTRIC);
            new LightningBolt(this, myBlock.x, myBlock.y);
            break;
          case "pink":
            emitter.setEmitterFrame(43);
            emitter.explode(10, myBlock.x, myBlock.y);
            this.sound.play(AUDIO.KISS, { volume: 2 });
            this.lives++;
            this.addHeartSprite();

            break;
          case "purple":
            this.sound.play(AUDIO.LASER);
            new LaserBeam(this, myBlock.x, myBlock.y);
            break;
          case "wood":
            emitter.setEmitterFrame(19);
            emitter.explode(10, myBlock.x, myBlock.y);
            this.sound.play(AUDIO.PLANK);
            break;
          case "glass":
            emitter.setEmitterFrame(9);
            emitter.setAlpha(0.75);
            emitter.explode(4, myBlock.x, myBlock.y);
            this.sound.play(AUDIO.GLASS);
            emitter.setAlpha(1);
            break;
          case "rock":
            emitter.setEmitterFrame(59);
            emitter.explode(5, myBlock.x, myBlock.y);
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
          case "icespike":
            // this.sound.play(AUDIO.ELECTRIC);
            new IceSpike(this, myBlock.x, myBlock.y);
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
            this.cache.tilemap.get(SCENES.mountain_1)
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
          this.blockGroup.remove(block as Phaser.Physics.Arcade.Sprite);
          this.wallGroup.add(block as Phaser.Physics.Arcade.Sprite);

          this.time.delayedCall(25, () => {
            block.destroy();
            this.blocks--;
          });
        }
      }
    );

    // balls & walls
    this.physics.add.collider(this.ballGroup, this.wallGroup);

    // player & powers
    this.physics.add.collider(
      this.playerGroup,
      this.powerGroup,
      (player, power) => {
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
      }
    );

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
            this.deleteHeartSprite();

            // Larger shake and sound on life lost
            this.cameras.main.shake(250, 0.01);
            this.sound.play(AUDIO.HURT);

            this.lives--;

            this.newBall = new Ball(
              this,
              this.player.x + 16,
              this.player.y - 6,
              SHEETS.Tiles,
              11
            );
            this.clamped = true;
          }
        } else if (!this.clamped) {
          this.sound.play(AUDIO.BEEP, { volume: 0.75 });
        }
      }
    });

    /***********************************************/
    // _Map & Layers
    /***********************************************/

    // Draw on the decoration layer (just spikes right now)
    // map.createLayer("deco", tileset)!.setPipeline("Light2D");

    /**********************************************/
    // _Background / Deco
    /**********************************************/
    this.cloudTimer = new CloudTimer(this, 1250);
    this.cloudTimer.start();

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

    this.backgroundImage = this.add
      .image(80, 120, IMAGES.NewMountainBG)
      .setDepth(-10)
      .setPipeline("Light2D");

    const gradient = this.add.image(80, 120, IMAGES.BlueGradBG);
    gradient.setDepth(-100);
  }

  update(t: number) {
    // Increase ball Y velocity if under 30
    this.ballGroup.getChildren().forEach((ball) => {
      const myBall = ball as Phaser.Physics.Arcade.Sprite;
      if (!myBall.body) return;
      if (Math.abs(myBall.body.velocity.y) < 30 && !this.clamped) {
        if (myBall.body.velocity.y < 0) {
          // Ball go up
          myBall.setVelocityY(myBall.body.velocity.y - 5);
        } else {
          // Ball go down
          myBall.setVelocityY(myBall.body.velocity.y + 5);
        }
        if (myBall.body.velocity.x === 0) return;
        if (myBall.body.velocity.x > 0) {
          // Ball go right
          myBall.setVelocityX(myBall.body.velocity.x + 5);
        } else {
          // Ball go left
          myBall.setVelocityX(myBall.body.velocity.x - 5);
        }
      }
    });

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

    /**********************************************/
    // Heatseeking Balls when 1 left (could be changed into a power or upgrade)
    // Since we move blocks out of blockGroup before
    // destruction now this needs updating
    /**********************************************/
    // if (this.blocks === 1) {
    //   const target = this.blockGroup.children
    //     .entries[0] as Phaser.Physics.Arcade.Sprite;
    //   if (!target) return;

    //   this.ballGroup.getChildren().forEach((ball) => {
    //     const myBall = ball as Phaser.Physics.Arcade.Sprite;
    //     const newX = Phaser.Math.Linear(myBall.x, target.x, 0.075);
    //     const newY = Phaser.Math.Linear(myBall.y, target.y, 0.075);
    //     myBall.setVelocity(0, 0);
    //     myBall.x = newX;
    //     myBall.y = newY;
    //   });
    // }

    // My "AI"
    // Using "LERP" we get a more natural AI
    // That can actually miss the ball sometimes
    if (this.ai.active && !this.checkIfStunned()) {
      if (this.clamped && this.newBall) {
        this.newBall.setVelocityY(-50);
        this.clamped = false;
      }

      if (!this.ai.lastUpdate) {
        this.ai.lastUpdate = t;
        this.ai.lastNudgeAmnt = Phaser.Math.RND.pick([-8, -4, 0, 4, 8]);
      }

      if (t - this.ai.lastUpdate > 3000) {
        // ("Over 3 seconds, nudge loc");
        this.ai.x = Math.floor(Math.random() * 21) - 10;
        this.ai.lastNudgeAmnt = Phaser.Math.RND.pick([-8, -4, 0, 4, 8]);
        this.ai.lastUpdate = t;
      }

      let targetBall: Phaser.Physics.Arcade.Sprite | { x: number } | null =
        null;
      let closestBall = 0;
      this.ballGroup.getChildren().forEach((ball) => {
        const myBall = ball as Phaser.Physics.Arcade.Sprite;
        if (!myBall || myBall.body!.velocity.y < 0) return;
        if (myBall.y > closestBall) {
          closestBall = myBall.y;
          targetBall = myBall;
        }
      });

      if (!targetBall) {
        targetBall = { x: 80 };
      }

      let LERP = 0.5;
      if (targetBall.x === 80) LERP = 0.1;
      const targetX = targetBall.x + this.ai.lastNudgeAmnt!;
      const currentX = this.player.x;
      const newX = Phaser.Math.Linear(currentX, targetX, LERP);
      this.player.x = newX;
    }

    if (this.blocks <= 0) {
      const currentSave = new Set(
        JSON.parse(this.game.registry.get("savegame"))
      );

      currentSave.add(this.scene.key);

      this.game.registry.set(
        "savegame",
        JSON.stringify(Array.from(currentSave))
      );
      localStorage.setItem("savegame", JSON.stringify(Array.from(currentSave)));

      document.removeEventListener("touchmove", this.touchMoveFunc);
      document.removeEventListener("mousedown", this.clickFunc);

      if (BaseUIDiv.getInstance(this.UIElements.baseSceneUI))
        BaseUIDiv.getInstance(this.UIElements.baseSceneUI)!.customRemove();

      this.scene.start(SCENES.LevelSelect, { resume: false });
    }

    if (this.lives <= 0) {
      document.removeEventListener("touchmove", this.touchMoveFunc);
      document.removeEventListener("mousedown", this.clickFunc);

      if (BaseUIDiv.getInstance(this.UIElements.baseSceneUI))
        BaseUIDiv.getInstance(this.UIElements.baseSceneUI)!.customRemove();

      this.scene.start(SCENES.LevelSelect, { resume: false });
    }

    /* Rough way to change sprite based on direction of player movement
       NOT using velocity, since player moves without using it  */
    if (this.player) {
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
}
