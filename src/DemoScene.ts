import Phaser from "phaser";

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
        key: "vcr-white",
        png: "assets/font/vcr-white/vcr-white.png",
        xml: "assets/font/vcr-white/vcr-white.xml",
      },
      {
        key: "vcr-black",
        png: "assets/font/vcr-black/vcr-black.png",
        xml: "assets/font/vcr-black/vcr-black.xml",
      },
    ];

    for (const font of fonts) {
      this.load.bitmapFont(font.key, font.png, font.xml);
    }

    this.load.audio([
      { key: "fireSound", url: "assets/sounds/fire.mp3" },
      { key: "bubbleSound", url: "assets/sounds/bubble.mp3" },
      { key: "leafSound", url: "assets/sounds/leaf.mp3" },
      { key: "electricSound", url: "assets/sounds/electric.mp3" },
      { key: "kissSound", url: "assets/sounds/kiss.mp3" },
      { key: "laserSound", url: "assets/sounds/laser.mp3" },
      { key: "hurtSound", url: "assets/sounds/hurt.mp3" },
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
      this.heartSprites.push(this.add.sprite(16 * i, 10, "tiles", 32));
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

    const ballGroup = this.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
      maxVelocityX: 199,
      maxVelocityY: 200,
    });

    const playerGroup = this.physics.add.group({
      immovable: true,
    });

    const powerGroup = this.physics.add.group({
      collideWorldBounds: true,
    });

    this.physics.add.collider(playerGroup, ballGroup, (player, ball) => {
      const playerSprite = player as Phaser.Physics.Arcade.Sprite;
      const ballSprite = ball as Phaser.Physics.Arcade.Sprite;

      const halfVelocity = Math.floor(
        (Math.abs(ball.body.velocity.x) + Math.abs(ball.body.velocity.y)) / 2
      );

      const playerWidth = playerSprite.width;

      const leftTip = playerSprite.x - playerWidth - 2;
      const rightTip = playerSprite.x + playerWidth + 2;

      if (ballSprite.x < playerSprite.x - 2) {
        if (ballSprite.x < leftTip + 2) {
          // ("left tip hit");
          ballSprite.setVelocityX(-(halfVelocity + halfVelocity / 2));
          ballSprite.setVelocityY(-(halfVelocity / 2));
        } else {
          // ("left hit");
          ballSprite.setVelocityX(-halfVelocity);
          ballSprite.setVelocityY(-halfVelocity);
        }
      } else if (ballSprite.x > playerSprite.x + 2) {
        if (ballSprite.x > rightTip - 2) {
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
          this.sound.play("leafSound");
          break;
        case "red":
          createPuff(myBlock.x, myBlock.y, 42);
          this.sound.play("fireSound");
          break;
        case "blue":
          createPuff(myBlock.x, myBlock.y, 44);
          this.sound.play("bubbleSound", {
            name: "bubbleSound",
            start: 0.5,
          });
          break;
        case "yellow":
          createPuff(myBlock.x, myBlock.y, 53);
          this.sound.play("electricSound");
          break;
        case "pink":
          createPuff(myBlock.x, myBlock.y, 41);
          this.sound.play("kissSound", { volume: 2 });
          break;
        case "purple":
          createPuff(myBlock.x, myBlock.y, 51);
          this.sound.play("laserSound");
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
          Math.floor(Math.random() * 4) + 12
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
            myBall.setVelocityX(myBall.body.velocity.x * 0.95);
            myBall.setVelocityY(myBall.body.velocity.y * 0.95);
          });
          power.destroy();
          break;

        case "fast":
          ballGroup.getChildren().forEach((ball) => {
            const myBall = ball as Ball;
            myBall.setVelocityX(myBall.body.velocity.x * 1.05);
            myBall.setVelocityY(myBall.body.velocity.y * 1.05);
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

    interface iPlayer extends Phaser.Types.Tilemaps.TiledObject {
      x: number;
      y: number;
      gid: number;
    }
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

    class Ball extends Phaser.Physics.Arcade.Sprite {
      gid: number;
      constructor(
        scene: DemoScene,
        x: number,
        y: number,
        texture: string,
        frame: number
      ) {
        super(scene, x, y, texture, frame);

        this.gid = frame;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        scene.balls++;

        this.setCircle(4, 4, 4);

        ballGroup.add(this);

        // TS says read-only property - type assertion resolved
        (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

        // this.setFriction(1);

        if (scene.clamped) {
          this.x = scene.player.x;
          this.setVelocityY(0);
        }
      }
    }
    interface iBall extends Phaser.Types.Tilemaps.TiledObject {
      x: number;
      y: number;
      gid: number;
    }
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

    interface iBlockSprite extends Phaser.Physics.Arcade.Sprite {
      properties: { [key: string]: any };
    }
    interface iBlock extends Phaser.Types.Tilemaps.TiledObject {
      x: number;
      y: number;
      gid: number;
      properties: { name: string; value: any }[];
    }
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

    class Power extends Phaser.Physics.Arcade.Sprite {
      gid: number;
      properties: { power: string };

      // todo - hardcode in texture better
      // right now you must pass in undefined for texture

      constructor(
        scene: DemoScene,
        x: number,
        y: number,
        texture = "tiles",
        frame: number
      ) {
        super(scene, x, y, texture, frame);

        this.gid = frame;

        interface TileProperties {
          [key: number]: {
            power: string;
          };
        }

        const tileProperties = tileset.tileProperties as TileProperties;

        this.properties = {
          power: tileProperties[this.gid].power,
        };

        powerGroup.add(this);

        (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityY(Math.floor(Math.random() * 31) + 30);
      }
    }
    // Create a platform-expand power
    new Power(this, 10, 10, undefined, 12);
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

      new Power(this, powerTile.x, powerTile.y, undefined, powerTile.gid - 1);
    });

    // World bounds event to destroy powers that hit the bottom
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (powerGroup.contains(body.gameObject)) {
        body.gameObject.destroy();
      }
    });

    // World bounds event to destroy balls that hit the bottom
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject && ballGroup.contains(body.gameObject)) {
        if (body.blocked.down) {
          if (this.lives > 1 && this.heartSprites.length > 1) {
            const targetHeart =
              this.heartSprites.pop() as Phaser.GameObjects.Sprite;

            createPuff(targetHeart.x, targetHeart.y, 32);

            this.sound.play("hurtSound");

            targetHeart.destroy();
          }

          this.cameras.main.shake(250, 0.01);

          body.gameObject.destroy();
          this.balls--;
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
      }
    });

    /**********************************************/
    // Background Clouds
    /**********************************************/

    class Cloud extends Phaser.Physics.Arcade.Sprite {
      constructor(scene: Phaser.Scene) {
        super(
          scene,
          -50,
          -50,
          "cloud-atlas",
          `cloud${Math.floor(Math.random() * 3 + 1)}.png`
        );

        const worldLeft = scene.physics.world.bounds.left;
        const worldHeight = scene.physics.world.bounds.height;

        this.setPosition(
          worldLeft - 32,
          Math.floor(Math.random() * worldHeight)
        );

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(-1);

        this.setVelocityX(Math.floor(Math.random() * 30) + 15);
      }

      preUpdate() {
        const worldRight = this.scene.physics.world.bounds.right;
        if (this.x > worldRight + 64) {
          this.destroy();
        }
      }
    }

    class CloudTimer {
      scene: Phaser.Scene;
      interval: number;
      timerEvent: Phaser.Time.TimerEvent | null;

      constructor(scene: Phaser.Scene, interval: number) {
        this.scene = scene;
        this.interval = interval;
        this.timerEvent = null;
      }

      start() {
        if (!this.timerEvent) {
          this.timerEvent = this.scene.time.addEvent({
            delay: this.interval,
            loop: true,
            callback: this.onInterval,
            callbackScope: this,
          });
        }
      }

      stop() {
        if (this.timerEvent) {
          this.timerEvent.destroy();
          this.timerEvent = null;
        }
      }

      onInterval() {
        new Cloud(this.scene);
      }
    }

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

    if (this.blocks === 0 || this.lives === 0) {
      document.removeEventListener("touchmove", this.touchListener);
      document.removeEventListener("mousedown", this.clickListener);
      this.scene.restart();
    }
  }
}
