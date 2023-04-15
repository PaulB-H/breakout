export interface iBlockSprite extends Phaser.Physics.Arcade.Sprite {
  properties: { [key: string]: any };
}
export interface iBlock extends Phaser.Types.Tilemaps.TiledObject {
  x: number;
  y: number;
  gid: number;
  properties: { name: string; value: any }[];
}
