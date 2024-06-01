import BaseScene from "../BaseScene";

import TransitionManager from "../TransitionManager";

import { FONTS, SCENES, SHEETS } from "../../constants";
import BaseUIDiv from "../BaseUIDiv";

import * as Projectiles from "../../objects/Projectiles";

export default class StartScene extends BaseScene {
  constructor() {
    super("StartScene");
  }

  preload() {}

  create() {
    // If we dont call super.create() here then all out projectiles
    // random projectiles all get stuck with the laser texture
    // Not sure why, and kinda curious to find out... later... sometime... maybe...
    super.create();

    // We delete the sprite hearts and menu btn that get
    // initalized by calling super.create() from basescene
    this.deleteHeartSprite();
    this.deleteHeartSprite();
    this.deleteHeartSprite();
    this.menuBtn.destroy();

    // Added a bit type enforcing gameWidth we know will be a number
    let gameWidth: number = this.sys.game.config.width as number;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    const baseUi = document.getElementById("base-scene-ui") as HTMLDivElement;

    if (BaseUIDiv.getInstance(baseUi))
      BaseUIDiv.getInstance(baseUi)?.customRemove();

    const transitionManager = new TransitionManager(this);

    const title = this.add.bitmapText(
      gameWidth / 2,
      gameHeight / 2 - 50,
      FONTS.VCR_BLACK,
      "ELEMENTAL\n   BREAKOUT",
      21
    );
    title.setX(title.x - title.width / 2);

    const startUIDiv = new BaseUIDiv("start-ui").getDiv();
    startUIDiv.classList.add("animate__animated", "animate__fadeIn");

    const startButton = document.createElement("button");
    startButton.innerText = "START";

    startButton.style.cssText = `
      width: 50%;
      font-size: 10cqw;
      padding: 5px;
      margin-top: 80%;
      margin-left: 25%;
      background-color: #e9e9ed;
      border-radius: 5px;
      color: black;
    `;

    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", startUIDiv);

    startUIDiv.insertAdjacentElement("afterbegin", startButton);

    startButton.addEventListener("pointerup", () => {
      startUIDiv.style.animation = "swipeOut 0.75s";

      startUIDiv.addEventListener("animationend", () => {
        if (BaseUIDiv.getInstance(startUIDiv))
          BaseUIDiv.getInstance(startUIDiv)!.customRemove();

        transitionManager.startTransition(SCENES.LevelSelect, {
          resume: false,
        });
      });
    });

    const launchRandomProjectile = () => {
      let x = Math.floor((Math.random() * gameWidth) as number);
      if (x + 5 >= gameWidth) x -= 5;
      if (x - 5 <= 0) x += 5;

      switch (Math.ceil(Math.random() * 4)) {
        case 1:
          new Projectiles.FireBall(this, x, 0);
          break;
        case 2:
          new Projectiles.IceSpike(this, x, 0);
          break;
        case 3:
          new Projectiles.LaserBeam(this, x, 0);
          break;
        case 4:
          new Projectiles.LightningBolt(this, x, 0);
          break;
        default:
          break;
      }
    };

    this.time.addEvent(
      new Phaser.Time.TimerEvent({
        loop: true,
        delay: 750,
        callback: launchRandomProjectile,
      })
    );

    // Create snow particle emitter
    const snowEmitter = this.add
      .particles(0, 0, SHEETS.Tiles, {
        lifespan: 10000,
        speed: { min: 0.2, max: 5 },
        radial: false,
        gravityY: 10,
        gravityX: 0,
        emitting: false,
        frame: 61,
        alpha: 0.75,
        angle: 180,
      })
      .setDepth(10);

    // Function to drop a random snowflake along x axis
    const dropSnowflake = () => {
      snowEmitter.setEmitterFrame(Phaser.Math.RND.pick([61, 71, 72]));
      snowEmitter.setParticleGravity(Phaser.Math.Between(-1, 0.2), 5);

      snowEmitter.emitParticle(
        1,
        Phaser.Math.Between(0, this.game.config.width as number),
        -10
      );

      snowTimer.reset(snowTimerConfig);
    };
    // We need to make a config object because we reference it
    // when calling TimerEvent.reset(timerConfig)
    const snowTimerConfig = {
      delay: Phaser.Math.Between(500, 500),
      callback: dropSnowflake,
      loop: true,
    };
    // Start snowing
    const snowTimer = this.time.addEvent(snowTimerConfig);

    const backgroundImage = this.backgroundImage;
    if (backgroundImage) backgroundImage.destroy();
  }

  update() {}
}
