import DemoScene from "../DemoScene";

export default class Power extends Phaser.Physics.Arcade.Sprite {
  gid: number;
  properties: { power: string };

  // todo - hardcode in texture better
  // right now you must pass in undefined for texture

  constructor(
    scene: DemoScene,
    x: number,
    y: number,
    texture = "tiles",
    frame: number,
    tileset: Phaser.Tilemaps.Tileset
  ) {
    super(scene, x, y, texture, frame);

    // this.tileset = tileset;
    this.gid = frame;

    interface TileProperties {
      [key: number]: {
        power: string;
      };
    }

    const tileProperties = tileset.tileProperties as TileProperties;

    this.properties = {
      power: tileProperties[this.gid].power,
    };

    scene.powerGroup.add(this);

    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(Math.floor(Math.random() * 31) + 30);
  }
}
