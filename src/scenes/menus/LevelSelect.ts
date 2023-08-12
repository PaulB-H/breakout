import { BUTTONS, SCENES, FONTS } from "../../constants";

import BaseUIDiv from "../BaseUIDiv";

interface UIElements {
  LevelSelectUI: HTMLDivElement;
  LevelsDiv: HTMLDivElement;
}

export default class LevelSelect extends Phaser.Scene {
  private UIElements!: UIElements;

  constructor() {
    super(SCENES.LevelSelect);
  }

  preload() {}

  init() {
    this.cameras.main.setBackgroundColor(0xbf87ceeb);
  }

  create() {
    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    this.add.bitmapText(10, 50, FONTS.VCR_BLACK, "LEVEL SELECT", 21);

    const resumeBtn = this.add.sprite(40, 200, BUTTONS.ResumeBTN).setDepth(10);
    resumeBtn.setInteractive();
    resumeBtn.on(
      "pointerdown",
      () => {
        setTimeout(() => {
          this.scene.resume(SCENES.PauseScene);

          this.scene.get(SCENES.PauseScene).events.emit("showPauseUI");

          this.UIElements.LevelSelectUI.remove();
          this.scene.stop();
        }, 150);
      },
      this
    );

    const LevelSelectUI = new BaseUIDiv("level-select-ui").getDiv();
    LevelSelectUI.style.cssText += `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%
    `;

    const LevelsDiv = document.createElement("div");
    LevelsDiv.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      height: 20%;
    `;

    const levelButtonArr = [
      { text: "Level 1", key: SCENES.Level_1 },
      { text: "Level 2", key: SCENES.Level_2 },
      { text: "Level 3", key: SCENES.Level_3 },
      { text: "Level 4", key: SCENES.Level_4 },
      { text: "Level 5", key: SCENES.DemoScene },
      { text: "Lava\xa0 1", key: SCENES.Level_1_lava },
      { text: "~  Start  ~", key: SCENES.StartScene },
    ];

    let levelBtnElements: Array<HTMLButtonElement> = [];

    const startLevel = (sceneKey: string) => {
      setTimeout(() => {
        this.scene.stop(SCENES.PauseScene);
        this.scene.stop(this.registry.get("pausedSceneKey"));
        this.scene.start(sceneKey);
        this.UIElements.LevelSelectUI.remove();
      }, 150);
    };

    levelButtonArr.forEach((level) => {
      const newBtn = document.createElement("button");
      newBtn.textContent = level.text;
      newBtn.style.cssText = `
        font-size: 5cqw;
        margin: 0.5%;
        padding: 0.5% 2% 0.5% 2%;
      `;
      newBtn.onmouseup = () => startLevel(level.key);

      levelBtnElements.push(newBtn);
    });

    levelBtnElements.forEach((button) => {
      LevelsDiv.insertAdjacentElement("beforeend", button);
    });

    this.UIElements = { LevelSelectUI, LevelsDiv };

    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", LevelSelectUI);

    LevelSelectUI.insertAdjacentElement("beforeend", LevelsDiv);

    // this.scene.bringToTop(SCENES.PauseScene);

    this.scene.bringToTop(SCENES.PauseScene);
    this.scene.bringToTop(this);
  }

  update() {}
}
