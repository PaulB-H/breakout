import { BUTTONS, SCENES, FONTS } from "../../constants";

import TransitionManager from "../TransitionManager";

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

  preload() {
    this.cameras.main.setBackgroundColor("#87ceeb");
  }

  init() {
    this.cameras.main.setBackgroundColor(0xbf87ceeb);
  }

  create(data: any) {
    const transitionManager = new TransitionManager(this);

    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    this.add.bitmapText(5, 50, FONTS.VCR_BLACK, "LEVEL SELECT", 21);

    const resumeBtn = this.add.sprite(40, 200, BUTTONS.ResumeBTN).setDepth(10);
    resumeBtn.setInteractive();
    resumeBtn.on(
      "pointerdown",
      () => {
        setTimeout(() => {
          if (SCENES.PauseScene) {
            this.scene.resume(SCENES.PauseScene);
            this.scene.get(SCENES.PauseScene).events.emit("showPauseUI");
          }

          if (BaseUIDiv.getInstance(this.UIElements.LevelSelectUI))
            BaseUIDiv.getInstance(
              this.UIElements.LevelSelectUI
            )!.customRemove();

          this.scene.stop();
        }, 150);
      },
      this
    );

    if (data && data.resume === false) resumeBtn.destroy();

    const LevelSelectUI = new BaseUIDiv("level-select-ui").getDiv();
    LevelSelectUI.style.cssText += `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      // margin-top: 40%;
    `;
    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", LevelSelectUI);

    const LevelsDiv = document.createElement("div");
    LevelsDiv.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-evenly;
      align-items: center;
      width: 100%;
      // height: 20%;

      display: flex;
      flex-direction: row;

      padding: 0 5%;

      margin-top: 20%;


      // display: grid;
      // grid-template-columns: repeat(3, 1fr); 
      // gap: 10px; 
    `;
    LevelSelectUI.insertAdjacentElement("beforeend", LevelsDiv);

    /* */
    ///// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
    /* */
    const levelGroups: Record<string, { text: string; key: string }[]> = {
      mountain: [
        { text: "Level 1", key: SCENES.Level_1 },
        { text: "Level 2", key: SCENES.Level_2 },
        { text: "Level 3", key: SCENES.Level_3 },
        { text: "Level 4", key: SCENES.Level_4 },
      ],
      lava: [{ text: "Lava 1", key: SCENES.Level_1_lava }],
      ice: [{ text: "Ice 1", key: SCENES.Level_1_ice }],
      debug: [
        { text: "Walls", key: SCENES.Test },
        { text: "AI Test", key: SCENES.Test_Nudge },
      ],
      start: [{ text: "Start", key: SCENES.StartScene }],
    };

    // const levelButtonArr = [
    //   { text: "Level 1", key: SCENES.Level_1 },
    //   { text: "Level 2", key: SCENES.Level_2 },
    //   { text: "Level 3", key: SCENES.Level_3 },
    //   { text: "Level 4", key: SCENES.Level_4 },
    //   { text: "Level 5", key: SCENES.DemoScene },
    //   { text: "Lava 1", key: SCENES.Level_1_lava },
    //   { text: "Ice 1", key: SCENES.Level_1_ice },
    //   { text: "Walls", key: SCENES.Test },
    //   { text: "AI Test", key: SCENES.Test_Nudge },
    //   { text: "Start", key: SCENES.StartScene },
    // ];

    let levelBtnElements: Array<HTMLButtonElement> = [];

    const startLevel = (sceneKey: string) => {
      setTimeout(() => {
        this.scene.stop(SCENES.PauseScene);
        this.scene.stop(this.registry.get("pausedSceneKey"));

        const pauseUI = document.getElementById("pause-ui") as HTMLDivElement;
        if (BaseUIDiv.getInstance(pauseUI))
          BaseUIDiv.getInstance(pauseUI)!.customRemove();

        if (BaseUIDiv.getInstance(this.UIElements.LevelSelectUI))
          BaseUIDiv.getInstance(this.UIElements.LevelSelectUI)!.customRemove();

        transitionManager.startTransition(sceneKey, null);
      }, 150);
    };

    for (const levelGroup of Object.keys(levelGroups)) {
      if (levelGroup === "debug" || levelGroup === "start") continue;

      const row: HTMLDivElement = document.createElement("div");
      row.id = `${levelGroup}`;
      // row.classList.add("row")
      row.style.cssText = `
        width: 100%;
        container-type: inline-size;
        margin: 1%;
        border: 1px solid black;
        border-radius: 5px;
        padding: 0.5%
      `;

      for (const level of levelGroups[levelGroup]) {
        const newBtn = document.createElement("button");
        // newBtn.textContent = level.text;
        newBtn.textContent = `${levelGroups[levelGroup].indexOf(level) + 1}`;
        newBtn.style.cssText = `
        font-size: 7cqw;
        margin: 0.5%;
        padding: 0.5% 2% 0.5% 2%;
        // min-width: 105px;
      `;
        newBtn.onmouseup = () => startLevel(level.key);

        // newBtn.setAttribute("data-aos", "fade-up");
        // newBtn.setAttribute("data-aos-delay", `${0}`);
        // ${levelGroups[levelGroup].indexOf(level) * 50}

        levelBtnElements.push(newBtn);

        // LevelsDiv.insertAdjacentElement("beforeend", newBtn);
        row.insertAdjacentElement("beforeend", newBtn);
      }

      LevelsDiv.insertAdjacentElement("beforeend", row);

      const textElem = document.createElement("p");
      textElem.innerText = `${
        levelGroup.charAt(0).toUpperCase() + levelGroup.slice(1)
      }`;

      textElem.style.cssText = `
        align-self: start;
        font-family: vcr-black;
        font-size: 5cqw;
      `;

      row.insertAdjacentElement("beforebegin", textElem);
    }

    // levelButtonArr.forEach((level, idx) => {
    //   const newBtn = document.createElement("button");
    //   newBtn.textContent = level.text;
    //   newBtn.style.cssText = `
    //     font-size: 5cqw;
    //     margin: 0.5%;
    //     padding: 0.5% 2% 0.5% 2%;
    //     min-width: 105px;
    //   `;
    //   newBtn.onmouseup = () => startLevel(level.key);

    //   newBtn.setAttribute("data-aos", "fade-up");
    //   newBtn.setAttribute("data-aos-delay", `${idx * 50}`);

    //   levelBtnElements.push(newBtn);

    //   LevelsDiv.insertAdjacentElement("beforeend", newBtn);
    // });

    this.UIElements = { LevelSelectUI, LevelsDiv };

    this.scene.bringToTop(SCENES.PauseScene);
    this.scene.bringToTop(this);
  }

  update() {}
}
