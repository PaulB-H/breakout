import Phaser from "phaser";

import DemoScene from "./scenes/DemoScene";
import PreloaderScene from "./scenes/PreloaderScene";
import Mountain_1 from "./scenes/levels/Mountain_1";
import Mountain_2 from "./scenes/levels/Mountain_2";
import Mountain_3 from "./scenes/levels/Mountain_3";
import Mountain_4 from "./scenes/levels/Mountain_4";
import Lava_1 from "./scenes/levels/Lava_1";
import Lava_2 from "./scenes/levels/Lava_2";
import Lava_3 from "./scenes/levels/Lava_3";
import Lava_4 from "./scenes/levels/Lava_4";
import StartScene from "./scenes/menus/Start";
import PauseScene from "./scenes/menus/Pause";
import Test_Nudge from "./scenes/levels/Test_Nudge";
import LevelSelect from "./scenes/menus/LevelSelect";
import Test from "./scenes/levels/Test";
import Ice_1 from "./scenes/levels/Ice_1";
import Ice_2 from "./scenes/levels/Ice_2";
import Ice_3 from "./scenes/levels/Ice_3";
import Ice_4 from "./scenes/levels/Ice_4";

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
    Mountain_1,
    Mountain_2,
    Mountain_3,
    Mountain_4,
    DemoScene,
    Lava_1,
    Lava_2,
    Lava_3,
    Lava_4,
    Ice_1,
    Ice_2,
    Ice_3,
    Ice_4,
    Test,
  ],
  scale: {
    zoom: 1,
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  maxLights: 50,
};

export default new Phaser.Game(config);
