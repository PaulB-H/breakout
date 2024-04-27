import { SCENES, SHEETS } from "../../constants";

import BaseUIDiv from "../BaseUIDiv";

import { ships, validShipTypes, shipTypeArray } from "../../objects/Ship";

import PauseScene from "./Pause";

import BaseScene from "../BaseScene";
import { SpriteToImg } from "../../utility/SpriteToImg";

import SaveGame from "../../utility/SaveGame";

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

    const setNewShip = (shiptype: validShipTypes) => {
      const pausedSceneKey = (
        this.scene.manager.getScene(SCENES.PauseScene) as PauseScene
      ).getPausedSceneKey();

      if (pausedSceneKey !== undefined) {
        // There is a paused scene, also update ship there
        (this.scene.manager.getScene(pausedSceneKey) as BaseScene)
          .getShip()
          .setShipType(shiptype);
      }

      this.registry.set("shipType", shiptype);
    };

    const shipSelectBtnDiv = document.createElement("div");
    shipSelectBtnDiv.id = "shipSelectBtnDiv";
    shipSelectBtnDiv.style.cssText = `
      display: flex;
      justify-content: center;
      flex-direction: column-reverse;
      align-items: center;
    `;
    ShipSelectUI.insertAdjacentElement("afterbegin", shipSelectBtnDiv);

    const renderShipBtns = () => {
      shipSelectBtnDiv.innerHTML = "";

      const currentSaveParsed = JSON.parse(this.registry.get("savegame"));
      const currentSave = new SaveGame(
        currentSaveParsed.completedLevels,
        currentSaveParsed.blocksBroken
      );

      shipTypeArray.forEach((shipType) => {
        let shipLocked = false;
        const requirements = {
          color: "",
          remaining: 0,
        };

        switch (shipType) {
          case "base":
            break;
          case "vanu":
            if (currentSave.getBlocksBroken().purple < 50) {
              shipLocked = true;
              requirements.color = "Laser";
              requirements.remaining =
                50 - currentSave.getBlocksBroken().purple;
            }

            break;
          case "orb":
            break;
          case "snowflake":
            if (currentSave.getBlocksBroken().icespike < 50) {
              shipLocked = true;
              requirements.color = "Icespike";
              requirements.remaining =
                50 - currentSave.getBlocksBroken().icespike;
            }

            break;
          case "lightning":
            if (currentSave.getBlocksBroken().yellow < 50) {
              shipLocked = true;
              requirements.color = "Yellow";
              requirements.remaining =
                50 - currentSave.getBlocksBroken().yellow;
            }
            break;

          case "fireball":
            if (currentSave.getBlocksBroken().red < 50) {
              shipLocked = true;
              requirements.color = "Red";
              requirements.remaining = 50 - currentSave.getBlocksBroken().red;
            }
            break;

          default:
            break;
        }
        const btn = document.createElement("button");
        btn.innerText = shipType;
        btn.innerText =
          btn.innerText.charAt(0).toUpperCase() + btn.innerText.slice(1);
        btn.style.cssText = `
          font-family: vcr-black;
          font-size: 5cqw;
          margin: 5% -5%;
          padding: 0.3em;
          position: relative;
          color: black;
          width: max-content;
          display: flex;
          align-items: center;
          width: 100%;
          border-radius: 10px;
          border: none;
        `;
        if (shipLocked) {
          btn.innerText = `Break ${requirements.remaining} ${requirements.color} blocks`;
          btn.style.cssText += `
            background-color: rgb(53, 53, 53);
            font-size: 5cqw;
            color: orange;
          `;
          btn.disabled = true;
        }
        shipSelectBtnDiv.insertAdjacentElement("afterbegin", btn);

        const spriteImg = SpriteToImg(
          this,
          SHEETS.ships,
          ships[shipType].stopped
        );
        spriteImg.style.cssText = `
          image-rendering: pixelated;
          width: 10cqw;
          margin-right: 1em;
        `;
        btn.insertAdjacentElement("afterbegin", spriteImg);

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
      color: black;
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
