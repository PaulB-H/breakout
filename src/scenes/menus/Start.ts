import BaseScene from "../BaseScene";

import TransitionManager from "../TransitionManager";

import { FONTS, SCENES } from "../../constants";
import BaseUIDiv from "../BaseUIDiv";

export default class StartScene extends BaseScene {
  constructor() {
    super("StartScene");
  }

  preload() {}

  create() {
    let gameWidth = this.sys.game.config.width;
    if (typeof gameWidth === "string") gameWidth = parseInt(gameWidth);
    let gameHeight = this.sys.game.config.height;
    if (typeof gameHeight === "string") gameHeight = parseInt(gameHeight);

    const baseUi = document.getElementById("base-scene-ui") as HTMLDivElement;

    if (BaseUIDiv.getInstance(baseUi))
      BaseUIDiv.getInstance(baseUi)?.customRemove();

    const transitionManager = new TransitionManager(this);

    const title = this.add.bitmapText(
      gameWidth / 2,
      gameHeight / 2 - 50,
      FONTS.VCR_BLACK,
      "ELEMENTAL\n   BREAKOUT",
      21
    );
    title.setX(title.x - title.width / 2);

    const startUIDiv = new BaseUIDiv("start-ui").getDiv();

    const startButton = document.createElement("button");
    startButton.innerText = "START";

    startButton.style.cssText = `
      width: 50%;
      font-size: 10cqw;
      padding: 5px;
      margin-top: 80%;
      margin-left: 25%;
    `;

    document
      .querySelector("#app")
      ?.insertAdjacentElement("beforeend", startUIDiv);

    startUIDiv.insertAdjacentElement("afterbegin", startButton);

    startButton.addEventListener("pointerup", () => {
      startUIDiv.style.animation = "swipeOut 0.75s";

      startUIDiv.addEventListener("animationend", () => {
        if (BaseUIDiv.getInstance(startUIDiv))
          BaseUIDiv.getInstance(startUIDiv)!.customRemove();

        transitionManager.startTransition(SCENES.Level_1);
      });
    });
  }

  update() {}
}
