import { SCENES, FONTS } from "../../constants";

import BaseUIDiv from "../BaseUIDiv";

interface UIElements {
  PauseUI: HTMLDivElement;
  ResumeBtn: HTMLButtonElement;
  LevelSelBtn: HTMLButtonElement;
}

export default class PauseScene extends Phaser.Scene {
  private pausedSceneKey?: string;

  private UIElements!: UIElements;

  constructor() {
    super(SCENES.PauseScene);
  }

  preload() {}

  // We need to make sure when we call PauseScene
  // we tell it which scene was paused
  init(data: { pausedSceneKey: string }) {
    this.pausedSceneKey = data.pausedSceneKey;

    // Slight fade
    this.cameras.main.setBackgroundColor(0xbf87ceeb);
  }

  create() {
    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    this.add.bitmapText(
      gameWidth / 2 - 63 / 2,
      60,
      FONTS.VCR_BLACK,
      "PAUSED",
      21
    );

    const PauseUI = new BaseUIDiv("pause-ui").getDiv();
    PauseUI.style.cssText += `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    `;

    const ResumeBtn = document.createElement("button");
    ResumeBtn.textContent = "Resume";
    ResumeBtn.style.cssText = `
      width: 40%;
      font-size: 10cqw;

      margin-top: 40%
    `;
    ResumeBtn.addEventListener("click", () => {
      setTimeout(() => {
        if (BaseUIDiv.getInstance(this.UIElements.PauseUI))
          BaseUIDiv.getInstance(this.UIElements.PauseUI)!.customRemove();

        this.scene.stop();
        this.scene.resume(this.pausedSceneKey);
      }, 150);
    });
    ResumeBtn.setAttribute("data-aos", "fade-up");

    const LevelSelBtn = document.createElement("button");
    LevelSelBtn.textContent = "Level Select";
    LevelSelBtn.style.cssText = `
      width: 40%;
      font-size: 10cqw; 
      margin-top: 10%;
    `;
    LevelSelBtn.addEventListener("click", () => {
      setTimeout(() => {
        setTimeout(() => {
          this.scene.pause();
          this.UIElements.PauseUI.style.display = "none";

          // // We are not removing it here because we only remove it
          // // when a different scene is picked from Level Select
          // if (BaseUIDiv.getInstance(this.UIElements.PauseUI))
          //   BaseUIDiv.getInstance(this.UIElements.PauseUI)!.customRemove();

          this.scene.launch(SCENES.LevelSelect, { resume: true });
        }, 150);
      });
    });
    LevelSelBtn.setAttribute("data-aos", "fade-up");
    LevelSelBtn.setAttribute("data-aos-delay", "200");

    this.UIElements = { PauseUI, ResumeBtn, LevelSelBtn };

    document.querySelector("#app")?.insertAdjacentElement("beforeend", PauseUI);

    this.UIElements.PauseUI.insertAdjacentElement("beforeend", ResumeBtn);
    this.UIElements.PauseUI.insertAdjacentElement("beforeend", LevelSelBtn);

    this.scene.bringToTop(SCENES.PauseScene);

    // // The event we get from level select's "resume" button...
    this.events.on(
      "showPauseUI",
      () => (this.UIElements.PauseUI.style.display = "flex")
    );
  }

  update() {}
}
