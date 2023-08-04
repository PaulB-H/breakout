export default class TransitionManager {
  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  startTransition(nextSceneKey: string) {
    this.scene.scene.start(nextSceneKey);
  }
}
