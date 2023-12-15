import { SCENES, SHEETS } from "../../constants";

import BaseUIDiv from "../BaseUIDiv";

import { ships, validShipTypes, shipTypeArray } from "../../objects/Ship";

import PauseScene from "./Pause";

import BaseScene from "../BaseScene";
import { SpriteToImg } from "../../utility/SpriteToImg";

// interface UIElements {
//   LevelSelectUI: HTMLDivElement;
//   LevelsDiv: HTMLDivElement;
// }

export default class ShipSelect extends Phaser.Scene {
  // private UIElements!: UIElements;

  constructor() {
    super(SCENES.ShipSelect);
  }

  preload() {}

  init() {}

  create() {
    // const transitionManager = new TransitionManager(this);

    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    const ShipSelectUI = new BaseUIDiv("ship-select-ui").getDiv();
    ShipSelectUI.style.cssText += `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      background-color: black;
      box-shadow: rgb(0, 0, 0) 0px 0px 0px 10px;
      -webkit-box-shadow: rgb(0, 0, 0) 0px 0px 0px 10px;
    `;
    ShipSelectUI.classList.add(
      "animate__animated",
      "animate__fadeIn",
      "animate__faster"
    );
    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", ShipSelectUI);

    // const OutOfStockHeader = document.createElement("p");
    // OutOfStockHeader.innerText = "OUT OF STOCK";
    // OutOfStockHeader.style.cssText = `
    //   font-size: 10cqw;
    //   font-family: vcr-black;
    //   color: white;
    // `;
    // ShipSelectUI.insertAdjacentElement("afterbegin", OutOfStockHeader);

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

    const setNewShip = (shiptype: validShipTypes) => {
      const pausedSceneKey = (
        this.scene.manager.getScene(SCENES.PauseScene) as PauseScene
      ).getPausedSceneKey();

      if (pausedSceneKey !== undefined) {
        // There is a paused scene, update ship there AND in registry
        (this.scene.manager.getScene(pausedSceneKey) as BaseScene)
          .getShip()
          .setShipType(shiptype);

        this.registry.set("shipType", shiptype);
      }
      this.registry.set("shipType", shiptype);
    };

    const shipSelectBtnDiv = document.createElement("div");
    shipSelectBtnDiv.style.cssText = `
      display: flex;
      justify-content: center;
      flex-direction: column-reverse;
    `;
    ShipSelectUI.insertAdjacentElement("afterbegin", shipSelectBtnDiv);

    const renderShipBtns = () => {
      shipSelectBtnDiv.innerHTML = "";

      shipTypeArray.forEach((shipType) => {
        const btn = document.createElement("button");
        btn.innerText = shipType;
        btn.innerText =
          btn.innerText.charAt(0).toUpperCase() + btn.innerText.slice(1);
        btn.style.cssText = `
          font-family: vcr-black;
          font-size: 7cqw;
          margin: 5% -5%;
          padding: 0 2%;
          position: relative;
          flex: 1;
        `;
        shipSelectBtnDiv.insertAdjacentElement("afterbegin", btn);

        const spriteImg = SpriteToImg(
          this,
          SHEETS.ships,
          ships[shipType].stopped
        );
        spriteImg.style.cssText = `
          image-rendering: pixelated;
          position: absolute;
          top: 0;
          left: -18%;
          width: 10cqw;
        `;
        btn.insertAdjacentElement("beforeend", spriteImg);

        if (shipType === this.registry.get("shipType")) {
          const check = document.createElement("p");
          check.innerText = "✓";
          check.style.cssText = `
            position: absolute;
            top: -60%;
            right: -5%;
            color: red;
            font-weight: bold;
          `;
          btn.insertAdjacentElement("beforeend", check);
        }

        btn.onclick = () => {
          setNewShip(shipType);
          renderShipBtns();
        };
      });
    };
    renderShipBtns();

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
        this.scene.resume(SCENES.LevelSelect);
      }, 150);
    };
    ShipSelectUI.insertAdjacentElement("beforeend", resumeBtn);

    this.scene.bringToTop(this);
  }

  update() {}
}
