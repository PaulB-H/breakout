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
    `;
    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", LevelSelectUI);

    const LevelsDiv = document.createElement("div");
    LevelsDiv.style.cssText = `
      padding: 0 5%;
      margin-top: 15%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
    `;
    LevelSelectUI.insertAdjacentElement("beforeend", LevelsDiv);

    /* */
    ///// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
    ///// Another way to define: { [key: string]: { text: string; key: string }[] } = {
    /* */
    const levelGroups: Record<string, { text: string; key: string }[]> = {
      mountain: [
        { text: "Level 1", key: SCENES.mountain_1 },
        { text: "Level 2", key: SCENES.mountain_2 },
        { text: "Level 3", key: SCENES.mountain_3 },
        { text: "Level 4", key: SCENES.mountain_4 },
      ],
      lava: [
        { text: "Lava 1", key: SCENES.lava_1 },
        { text: "Lava 2", key: SCENES.lava_2 },
        { text: "Lava 3", key: SCENES.lava_3 },
        { text: "Lava 4", key: SCENES.lava_4 },
      ],
      ice: [
        { text: "Ice 1", key: SCENES.ice_1 },
        { text: "Ice 2", key: SCENES.ice_2 },
        { text: "Ice 3", key: SCENES.ice_3 },
        { text: "Ice 4", key: SCENES.ice_4 },
      ],
      debug: [
        { text: "Walls", key: SCENES.Test },
        { text: "AI Test", key: SCENES.Test_Nudge },
      ],
      start: [{ text: "Start", key: SCENES.StartScene }],
    };

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

    /* */
    ///// Get the savegame set from the registry
    /* */

    const savegameSet = new Set(JSON.parse(this.game.registry.get("savegame")));

    /* */
    ///// Loop through level groups and create a row & buttons for each group
    /* */
    for (const levelGroup of Object.keys(levelGroups)) {
      // If we are in production and its debug level, skip adding the button
      if (process.env.NODE_ENV === "production" && levelGroup === "debug") {
        continue;
      }

      // Skip back-to-start button for now
      if (levelGroup === "start") continue;

      const row: HTMLDivElement = document.createElement("div");
      row.id = `${levelGroup}`;
      row.style.cssText = `
        width: 100%;
        container-type: inline-size;
        margin: 1%;
        padding: 0.5%
      `;

      /* */
      ///// Loop through levels in group and add buttons to row
      /* */
      for (const level of levelGroups[levelGroup]) {
        const currentLevelIdx = levelGroups[levelGroup].indexOf(level);

        const newBtn = document.createElement("button");
        // newBtn.textContent = level.text;
        newBtn.textContent = `${currentLevelIdx + 1}`;
        newBtn.style.cssText = `
          font-size: 7cqw;
          margin: 0.5% 2%;
          padding: 0.5% 2%;
          position: relative;
        `;
        newBtn.onmouseup = () => startLevel(level.key);

        if (
          levelGroups[levelGroup].indexOf(level) > 0 &&
          !savegameSet.has(levelGroups[levelGroup][currentLevelIdx - 1].key) &&
          levelGroup !== "debug"
        ) {
          newBtn.setAttribute("disabled", "true");
        }

        if (savegameSet.has(level.key)) {
          const check = document.createElement("p");
          check.innerText = "✓";
          check.style.position = "absolute";
          check.style.top = `-50%`;
          check.style.marginLeft = "50%";
          newBtn.insertAdjacentElement("beforeend", check);
        }

        levelBtnElements.push(newBtn);

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

    this.UIElements = { LevelSelectUI, LevelsDiv };

    this.scene.bringToTop(SCENES.PauseScene);
    this.scene.bringToTop(this);
  }

  update() {}
}
