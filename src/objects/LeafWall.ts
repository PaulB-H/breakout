import BaseScene from "../scenes/BaseScene";

import { SHEETS } from "../constants";

class LeafWall extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y, SHEETS.Tiles, 34);

    this.setY((scene.game.config.height as number) - 8);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToLeafWallGrp(this);

    this.setPipeline("Light2D");

    this.setImmovable(true);

    this.setSize(16, 13);
    this.setDepth(100);
  }
}

export const buildWall = (scene: BaseScene) => {
  // This is split awkwardly into two groups, because I wanted to
  // build it out from each edge. Will come back to this later...

  breakWall(scene);
  new LeafWall(scene, 8, 50);
  new LeafWall(scene, 8 + 16, 50);
  new LeafWall(scene, 8 + 16 * 2, 50);
  new LeafWall(scene, 8 + 16 * 3, 50);
  new LeafWall(scene, 8 + 16 * 4, 50);

  const rightEdge = (scene.game.config.width as number) - 8;
  new LeafWall(scene, rightEdge, 50);
  new LeafWall(scene, rightEdge - 16, 50);
  new LeafWall(scene, rightEdge - 16 * 2, 50);
  new LeafWall(scene, rightEdge - 16 * 3, 50);
  new LeafWall(scene, rightEdge - 16 * 4, 50);

  if (scene.getLeafWallTimer()) scene.destroyleafWallTimer();

  scene.setLeafWallTimer(
    scene.time.delayedCall(5000, () => {
      breakWall(scene);
    })
  );
};

const breakWall = (scene: BaseScene) => {
  scene.destroyLeafWall();
};
