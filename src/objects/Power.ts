import BaseScene from "../scenes/BaseScene";

import { PIPELINES, SCENES, SHEETS } from "../constants";

export default class Power extends Phaser.Physics.Arcade.Sprite {
  gid: number;
  properties: { power: string };

  // todo - hardcode in texture better
  // right now you must pass in undefined for texture

  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    texture = SHEETS.Tiles,
    frame: number,
    tileset: any
  ) {
    super(scene, x, y, texture, frame);

    // We are hardcoding the tileset used to get a power here, but could
    // pass in any tileset and it would get properties from that
    tileset = scene.cache.tilemap.get(SCENES.Level_1).data.tilesets[0];

    // this.tileset = tileset;
    this.gid = frame;

    // interface TileProperties {
    //   [key: number]: {
    //     power: string;
    //   };
    // }

    // const tileProperties = tileset.tileProperties as TileProperties;

    this.properties = {
      // power: tileProperties[this.gid].power,
      power: tileset.tiles[this.gid].properties[0].value,
    };

    scene.add.existing(this);
    scene.physics.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    scene.addToPowerGrp(this);

    this.setVelocityY(Math.floor(Math.random() * 31) + 30);

    this.setPipeline(PIPELINES.Light2D);
  }
}
