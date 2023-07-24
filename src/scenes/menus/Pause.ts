import { BUTTONS, SCENES, FONTS } from "../../constants";

export default class PauseScene extends Phaser.Scene {
  private pauseKey?: string;

  constructor() {
    super(SCENES.PauseScene);
  }

  preload() {}

  init(data: any) {
    this.pauseKey = data.pauseKey;

    this.cameras.main.setBackgroundColor(0xbf87ceeb);
  }

  create() {
    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    const resumeBtn = this.add.sprite(40, 100, BUTTONS.ResumeBTN).setDepth(10);
    resumeBtn.setInteractive();
    resumeBtn.on(
      "pointerdown",
      () => {
        setTimeout(() => {
          this.scene.stop();
          this.scene.resume(this.pauseKey);
        }, 150);
      },
      this
    );

    this.add.bitmapText(
      gameWidth / 2 - 63 / 2,
      60,
      FONTS.VCR_BLACK,
      "PAUSED",
      21
    );

    this.scene.bringToTop(SCENES.PauseScene);
  }

  update() {}
}
