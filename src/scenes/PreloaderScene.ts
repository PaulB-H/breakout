import {
  AUDIO,
  FONTS,
  SCENES,
  SHEETS,
  ATLAS,
  IMAGES,
  BUTTONS,
  REGISTRY,
} from "../constants";

import SaveGame from "../utility/SaveGame";

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("PreloaderScene");
  }

  preload() {
    // SHEETS.Tiles
    this.load.spritesheet({
      key: SHEETS.Tiles,
      url: "assets/main-tileset/breakout-extruded.png",
      normalMap: "assets/main-tileset/breakout-extruded_n.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
        spacing: 2,
        margin: 1,
      },
    });

    // SHEETS.ships
    this.load.spritesheet({
      key: SHEETS.ships,
      url: "assets/ships/ships.png",
      normalMap: "assets/ships/ships_n.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    });

    ///////////////////
    // Load Tilemaps
    // prettier-ignore
    {
      this.load.tilemapTiledJSON(SCENES.DemoScene, "assets/levels/breakout.json");
      this.load.tilemapTiledJSON(SCENES.mountain_1, "assets/levels/mountain-1.json");
      this.load.tilemapTiledJSON(SCENES.mountain_2, "assets/levels/mountain-2.json");
      this.load.tilemapTiledJSON(SCENES.mountain_3, "assets/levels/mountain-3.json");
      this.load.tilemapTiledJSON(SCENES.mountain_4, "assets/levels/mountain-4.json");
      this.load.tilemapTiledJSON(SCENES.lava_blank, "assets/levels/lava-blank.json");
      this.load.tilemapTiledJSON(SCENES.lava_1, "assets/levels/lava-1.json");
      this.load.tilemapTiledJSON(SCENES.lava_2, "assets/levels/lava-2.json");
      this.load.tilemapTiledJSON(SCENES.lava_3, "assets/levels/lava-3.json");
      this.load.tilemapTiledJSON(SCENES.lava_4, "assets/levels/lava-4.json");
      this.load.tilemapTiledJSON(SCENES.Test_Nudge, "assets/levels/test-ai-nudge.json");
      this.load.tilemapTiledJSON(SCENES.Test, "assets/levels/test.json");
      this.load.tilemapTiledJSON(SCENES.ice_1, "assets/levels/ice-1.json");
      this.load.tilemapTiledJSON(SCENES.ice_2, "assets/levels/ice-2.json");
      this.load.tilemapTiledJSON(SCENES.ice_3, "assets/levels/ice-3.json");
      this.load.tilemapTiledJSON(SCENES.ice_4, "assets/levels/ice-4.json");
    }

    const fonts = [
      {
        key: FONTS.VCR_WHITE,
        png: "assets/font/vcr-white/vcr-white.png",
        xml: "assets/font/vcr-white/vcr-white.xml",
      },
      {
        key: FONTS.VCR_BLACK,
        png: "assets/font/vcr-black/vcr-black.png",
        xml: "assets/font/vcr-black/vcr-black.xml",
      },
    ];

    for (const font of fonts) {
      this.load.bitmapFont(font.key, font.png, font.xml);
    }

    this.load.audio([
      { key: AUDIO.FIRE, url: "assets/sounds/fire.mp3" },
      { key: AUDIO.BUBBLE, url: "assets/sounds/bubble.mp3" },
      { key: AUDIO.LEAF, url: "assets/sounds/leaf.mp3" },
      { key: AUDIO.ELECTRIC, url: "assets/sounds/electric.mp3" },
      { key: AUDIO.KISS, url: "assets/sounds/kiss.mp3" },
      { key: AUDIO.LASER, url: "assets/sounds/laser.mp3" },
      { key: AUDIO.HURT, url: "assets/sounds/hurt.mp3" },
      { key: AUDIO.PLANK, url: "assets/sounds/planks.mp3" },
      { key: AUDIO.BEEP, url: "assets/sounds/beep.mp3" },
      { key: AUDIO.GLASS, url: "assets/sounds/glass.mp3" },
      { key: AUDIO.METAL, url: "assets/sounds/metal.mp3" },
      { key: AUDIO.METALBREAK, url: "assets/sounds/metalbreak.mp3" },
      { key: AUDIO.ROCK, url: "assets/sounds/rock.mp3" },
      { key: AUDIO.CREAK, url: "assets/sounds/woodcreak.mp3" },
    ]);

    // ATLAS.Cloud
    this.load.atlas({
      key: ATLAS.Cloud,
      textureURL: "assets/clouds/cloud-atlas.png",
      normalMap: "assets/clouds/cloud-atlas_n.png",
      atlasURL: "assets/clouds/cloud-atlas.json",
    });

    this.load.image(IMAGES.volcano, [
      "assets/backgrounds/volcano.png",
      "assets/backgrounds/volcano_n.png",
    ]);

    // SHEETS.lavafall
    this.load.spritesheet({
      key: SHEETS.lavafall,
      url: "assets/backgrounds/lavafall_sheet.png",
      normalMap: "assets/backgrounds/lavafall_sheet_n.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    });

    // SHEETS.lavafall_top
    this.load.spritesheet({
      key: SHEETS.lavafall_top,
      url: "assets/backgrounds/lavafall_top_sheet.png",
      normalMap: "assets/backgrounds/lavafall_top_sheet_n.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    });

    this.load.image(IMAGES.BlueGradBG, "assets/backgrounds/bluegradientbg.png");

    this.load.image(IMAGES.IcebergBG, [
      "assets/backgrounds/icebergbg.png",
      "assets/backgrounds/icebergbg_n.png",
    ]);

    this.load.image(IMAGES.NewMountainBG, [
      "assets/backgrounds/new-mountainbg.png",
      "assets/backgrounds/new-mountainbg_n.png",
    ]);

    // SHEETS.WaterLoop
    this.load.spritesheet(
      SHEETS.WaterLoop,
      "assets/videos/waterloop_sheet.png",
      {
        frameWidth: 160,
        frameHeight: 60,
      }
    );

    this.load.image(BUTTONS.MenuBTN, "assets/ui/menu-btn.png");
    this.load.image(BUTTONS.ResumeBTN, "assets/ui/resume-btn.png");

    this.registry.set(REGISTRY.score, 0);

    // We might work this into the save game file
    // but for now game will start with base ship selected
    this.registry.set("shipType", "base");

    const mySave = new SaveGame();
    console.log(mySave);

    // const checkSavedGame = (savegame: Set<string>) => {
    //   savegame.forEach((item: string) => {
    //     if (!SCENES.hasOwnProperty(item)) {
    //       savegame.delete(item);
    //     }
    //   });
    // };

    if (localStorage.getItem("savegame")) {
      const foundSave = JSON.parse(localStorage.getItem("savegame") as string);

      // try {
      //   foundSave = JSON.parse(localStorage.getItem("savegame") as string);
      //   if (!Array.isArray(foundSave)) {
      //     console.error("Found save not array...");
      //   } else {
      //     foundSave = new Set(foundSave);
      //   }
      // } catch (err) {
      //   console.error("Error parsing existing save...");
      // }

      // if (foundSave.size > 0) checkSavedGame(foundSave);

      this.game.registry.set("savegame", JSON.stringify(foundSave));
    } else {
      const mySave = new SaveGame();

      localStorage.setItem("savegame", JSON.stringify(mySave));
      this.game.registry.set("savegame", JSON.stringify(mySave));
    }
  }

  create() {
    this.scene.start(SCENES.StartScene);
  }
}
