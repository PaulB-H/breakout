import { SCENES } from "../../constants";

import BaseUIDiv from "../BaseUIDiv";

interface UIElements {
  PauseUI: HTMLDivElement;
  ResumeBtn: HTMLButtonElement;
  LevelSelBtn: HTMLButtonElement;
}

export default class PauseScene extends Phaser.Scene {
  private pausedSceneKey?: string;
  getPausedSceneKey = () => this.pausedSceneKey;

  private UIElements!: UIElements;

  constructor() {
    super(SCENES.PauseScene);
  }

  preload() {}

  // We need to make sure when we call PauseScene
  // we tell it which scene was paused
  init(data: { pausedSceneKey: string }) {
    this.pausedSceneKey = data.pausedSceneKey;
  }

  create() {
    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    const PauseUI = new BaseUIDiv("pause-ui").getDiv();
    PauseUI.style.cssText += `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      background-color: #87ceeb80;
    `;
    PauseUI.classList.add(
      "animate__animated",
      "animate__fadeIn",
      "animate__faster"
    );
    document.querySelector("#app")?.insertAdjacentElement("beforeend", PauseUI);

    const PausedHeader = document.createElement("p");
    PausedHeader.innerText = "PAUSED";
    PausedHeader.style.cssText = `
      font-family: vcr-black;
      font-size: 12cqw;

      background-color: rgba(255, 255, 255);

      -webkit-box-shadow: 0px 0px 1rem 1rem rgba(255, 255, 255);
      box-shadow: 0px 0px 1rem 1rem rgba(255, 255, 255);
    `;
    PauseUI.insertAdjacentElement("afterbegin", PausedHeader);

    const ResumeBtn = document.createElement("button");
    ResumeBtn.textContent = "Resume";
    ResumeBtn.style.cssText = `
      width: 40%;
      font-size: 8cqw;
      margin-top: 40%;
    `;
    ResumeBtn.addEventListener("click", () => {
      setTimeout(() => {
        if (BaseUIDiv.getInstance(this.UIElements.PauseUI))
          BaseUIDiv.getInstance(this.UIElements.PauseUI)!.customRemove();

        this.scene.stop();
        this.scene.resume(this.pausedSceneKey);
      }, 150);
    });

    const LevelSelBtn = document.createElement("button");
    LevelSelBtn.textContent = "Level Select";
    LevelSelBtn.style.cssText = `
      width: 40%;
      font-size: 8cqw; 
      margin-top: 10%;
    `;
    LevelSelBtn.addEventListener("click", () => {
      setTimeout(() => {
        setTimeout(() => {
          this.scene.pause();
          // this.UIElements.PauseUI.style.display = "none";

          // // We are not removing it here because we only remove it
          // // when a different scene is picked from Level Select
          // if (BaseUIDiv.getInstance(this.UIElements.PauseUI))
          //   BaseUIDiv.getInstance(this.UIElements.PauseUI)!.customRemove();

          this.scene.launch(SCENES.LevelSelect, { resume: true });
        }, 150);
      });
    });

    this.UIElements = { PauseUI, ResumeBtn, LevelSelBtn };

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
