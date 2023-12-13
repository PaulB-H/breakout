import { SCENES, FONTS } from "../../constants";

import BaseUIDiv from "../BaseUIDiv";

import { ships } from "../../objects/Ship";

// interface UIElements {
//   LevelSelectUI: HTMLDivElement;
//   LevelsDiv: HTMLDivElement;
// }

export default class ShipSelect extends Phaser.Scene {
  // private UIElements!: UIElements;

  constructor() {
    super(SCENES.ShipSelect);
  }

  preload() {
    // this.cameras.main.setBackgroundColor("#87ceeb");
  }

  init() {
    // this.cameras.main.setBackgroundColor(0xbf87ceeb);
  }

  create() {
    // const transitionManager = new TransitionManager(this);

    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    this.add.bitmapText(5, 15, FONTS.VCR_WHITE, "SHIP SELECT", 21);

    console.log(ships);

    const ShipSelectUI = new BaseUIDiv("ship-select-ui").getDiv();
    ShipSelectUI.style.cssText += `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
    `;
    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", ShipSelectUI);

    const OutOfStockHeader = document.createElement("p");
    OutOfStockHeader.innerText = "OUT OF STOCK";
    OutOfStockHeader.style.cssText = `
      font-size: 10cqw;
      font-family: vcr-black;
      color: white;
    `;

    ShipSelectUI.insertAdjacentElement("afterbegin", OutOfStockHeader);

    const ShipsDiv = document.createElement("div");
    ShipsDiv.style.cssText = `
      padding: 0 5%;
      margin-top: 15%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
    `;
    ShipSelectUI.insertAdjacentElement("beforeend", ShipsDiv);

    const resumeBtn = document.createElement("button");
    resumeBtn.innerText = "Resume";
    resumeBtn.style.cssText = `
      margin-top: 5%;
      font-size: 6cqw;
      padding: 1%;
    `;
    resumeBtn.onclick = () => {
      setTimeout(() => {
        BaseUIDiv.getInstance(ShipSelectUI)?.customRemove();
        this.scene.stop();
        // this.scene.setVisible(true, SCENES.PauseScene);
        // this.scene.setVisible(true, SCENES.LevelSelect);
        this.scene.resume(SCENES.LevelSelect);
      }, 150);
    };
    ShipSelectUI.insertAdjacentElement("beforeend", resumeBtn);

    ShipSelectUI.style.backgroundColor = "black";

    // this.scene.setVisible(false, SCENES.LevelSelect);
    // this.scene.setVisible(false, SCENES.PauseScene);
    this.scene.bringToTop(this);
  }

  update() {}
}
