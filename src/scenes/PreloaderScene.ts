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

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("PreloaderScene");
  }

  preload() {
    // // "tiles"
    // this.load.spritesheet({
    //   key: SHEETS.Tiles,
    //   url: "assets/main-tileset/breakout-extruded.png",
    //   normalMap: "assets/main-tileset/breakout-extruded_n.png",
    //   frameConfig: {
    //     frameWidth: 16,
    //     frameHeight: 16,
    //     spacing: 2,
    //     margin: 1,
    //     startFrame: 0,
    //     endFrame: 99,
    //   },
    // });

    this.load.image(
      "breakout-extruded_n",
      "assets/main-tileset/breakout-extruded_n.png"
    );
    this.load.spritesheet(
      SHEETS.Tiles,
      "assets/main-tileset/breakout-extruded.png",
      { frameWidth: 16, frameHeight: 16, margin: 1, spacing: 2 }
    );
    this.load.once("complete", function (loader: Phaser.Loader.LoaderPlugin) {
      const sheet = loader.textureManager.get(SHEETS.Tiles);
      const normalMap = loader.textureManager.get("breakout-extruded_n");
      const normalMapSrcImg = normalMap.getSourceImage();

      if (
        normalMapSrcImg instanceof HTMLImageElement ||
        normalMapSrcImg instanceof HTMLCanvasElement
      ) {
        sheet.setDataSource(normalMapSrcImg);
      }
    });

    this.load.tilemapTiledJSON(SCENES.DemoScene, "assets/levels/breakout.json");
    this.load.tilemapTiledJSON(SCENES.Level_1, "assets/levels/level-1.json");
    this.load.tilemapTiledJSON(SCENES.Level_2, "assets/levels/level-2.json");
    this.load.tilemapTiledJSON(SCENES.Level_3, "assets/levels/level-3.json");
    this.load.tilemapTiledJSON(SCENES.Level_4, "assets/levels/level-4.json");
    this.load.tilemapTiledJSON(
      SCENES.Level_1_lava,
      "assets/levels/level-1-lava.json"
    );
    // prettier-ignore
    this.load.tilemapTiledJSON(SCENES.Test_Nudge, 
      "assets/levels/test-ai-nudge.json");

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

    // "cloud-atlas"
    this.load.atlas({
      key: ATLAS.Cloud,
      textureURL: "assets/clouds/cloud-atlas.png",
      normalMap: "assets/clouds/cloud-atlas_n.png",
      atlasURL: "assets/clouds/cloud-atlas.json",
    });

    this.load.image("volcanobg_n", "assets/backgrounds/volcanobg_n.png");
    this.load.spritesheet(
      SHEETS.VolcanoBG,
      "assets/backgrounds/volcanobg.png",
      { frameWidth: 160, frameHeight: 240 }
    );
    this.load.once("complete", function (loader: Phaser.Loader.LoaderPlugin) {
      const sheet = loader.textureManager.get(SHEETS.VolcanoBG);
      const normalMap = loader.textureManager.get("volcanobg_n");
      const normalMapSrcImg = normalMap.getSourceImage();

      if (
        normalMapSrcImg instanceof HTMLImageElement ||
        normalMapSrcImg instanceof HTMLCanvasElement
      ) {
        sheet.setDataSource(normalMapSrcImg);
      }
    });

    this.load.image(IMAGES.BlueGradBG, "assets/backgrounds/bluegradientbg.png");

    this.load.image(IMAGES.MountainBG, [
      "assets/backgrounds/mountainbg.png",
      "assets/backgrounds/mountainbg_n.png",
    ]);

    this.load.image(BUTTONS.MenuBTN, "assets/ui/menu-btn.png");
    this.load.image(BUTTONS.ResumeBTN, "assets/ui/resume-btn.png");

    this.registry.set(REGISTRY.score, 0);
  }

  create() {
    this.scene.start(SCENES.StartScene);
  }
}
