import Phaser from "phaser";

import DemoScene from "./scenes/DemoScene";
import PreloaderScene from "./scenes/PreloaderScene";
import Level_1 from "./scenes/levels/Level_1";
import Level_2 from "./scenes/levels/Level_2";

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
  scene: [PreloaderScene, Level_1, Level_2, DemoScene],
  scale: {
    zoom: 1,
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default new Phaser.Game(config);
