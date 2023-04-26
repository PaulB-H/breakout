import Phaser from "phaser";

import DemoScene from "./scenes/DemoScene";
import PreloaderScene from "./scenes/PreloaderScene";
import Level_1 from "./scenes/levels/Level_1";
import Level_2 from "./scenes/levels/Level_2";
import Level_3 from "./scenes/levels/Level_3";
import Test_Nudge from "./scenes/levels/Test_Nudge";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 160,
  height: 240,
  backgroundColor: "#add8e6",
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [PreloaderScene, Level_1, Level_2, Level_3, DemoScene, Test_Nudge],
  scale: {
    zoom: 1,
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default new Phaser.Game(config);
