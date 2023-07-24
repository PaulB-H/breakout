import { FONTS, SHEETS, SCENES } from "../../constants";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {}

  create() {
    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    const startBtn = this.add
      .sprite(gameWidth / 2, gameHeight / 2 + 20, SHEETS.Tiles, 91)
      .setScale(6, 2);
    const startBtnTxt = this.add.bitmapText(
      gameWidth / 2,
      gameHeight / 2 + 10,
      FONTS.VCR_BLACK,
      "START",
      21
    );
    startBtnTxt.setX(startBtnTxt.x - startBtnTxt.width / 2);

    startBtn.setInteractive();
    startBtn.on("pointerdown", () => {
      this.scene.start(SCENES.Level_1);
    });

    const title = this.add.bitmapText(
      gameWidth / 2,
      gameHeight / 2 - 50,
      FONTS.VCR_BLACK,
      "ELEMENTAL\n   BREAKOUT",
      21
    );
    title.setX(title.x - title.width / 2);
  }

  update() {}
}
