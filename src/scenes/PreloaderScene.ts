import { AUDIO, FONT_KEYS } from "../constants";

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("PreloaderScene");
  }

  preload() {
    // "tiles"
    this.load.spritesheet({
      key: "tiles",
      url: "assets/main-tileset/breakout-extruded.png",
      normalMap: "assets/main-tileset/breakout-extruded_n.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
        spacing: 2,
        margin: 1,
      },
    });

    this.load.tilemapTiledJSON("map", "assets/levels/breakout.json");

    const fonts = [
      {
        key: FONT_KEYS.VCR_WHITE,
        png: "assets/font/vcr-white/vcr-white.png",
        xml: "assets/font/vcr-white/vcr-white.xml",
      },
      {
        key: FONT_KEYS.VCR_BLACK,
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
      key: "cloud-atlas",
      textureURL: "assets/clouds/cloud-atlas.png",
      normalMap: "assets/clouds/cloud-atlas_n.png",
      atlasURL: "assets/clouds/cloud-atlas.json",
    });

    this.load.spritesheet({
      key: "volcanobg",
      url: "assets/backgrounds/volcanobg.png",
      normalMap: "assets/backgrounds/volcanobg_n.png",
      frameConfig: {
        frameWidth: 160,
        frameHeight: 240,
      },
    });

    this.load.image("bluegradientbg", "assets/backgrounds/bluegradientbg.png");

    this.load.image("mountainbg", [
      "assets/backgrounds/mountainbg.png",
      "assets/backgrounds/mountainbg_n.png",
    ]);
  }

  create() {
    this.scene.start("DemoScene");
  }
}
