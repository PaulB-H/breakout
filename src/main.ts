import Phaser from "phaser";

import DemoScene from "./scenes/DemoScene";
import PreloaderScene from "./scenes/PreloaderScene";
import Level_1 from "./scenes/levels/Level_1";
import Level_2 from "./scenes/levels/Level_2";
import Level_3 from "./scenes/levels/Level_3";
import Level_4 from "./scenes/levels/Level_4";
import Level_1_lava from "./scenes/levels/Level_1_lava";
import Level_1_ice from "./scenes/levels/Level_1_ice";
import StartScene from "./scenes/menus/Start";
import PauseScene from "./scenes/menus/Pause";
import Test_Nudge from "./scenes/levels/Test_Nudge";
import LevelSelect from "./scenes/menus/LevelSelect";
import Test from "./scenes/levels/Test";
import ice_2 from "./scenes/levels/ice_2";
import ice_3 from "./scenes/levels/ice_3";
import ice_4 from "./scenes/levels/ice_4";

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
  scene: [
    PreloaderScene,
    Test_Nudge,
    PauseScene,
    LevelSelect,
    StartScene,
    Level_1,
    Level_2,
    Level_3,
    Level_4,
    DemoScene,
    Level_1_lava,
    Level_1_ice,
    ice_2,
    ice_3,
    ice_4,
    Test,
  ],
  scale: {
    zoom: 1,
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default new Phaser.Game(config);
