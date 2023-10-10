export default class TransitionManager {
  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  startTransition(nextSceneKey: string, data: any) {
    if (this.scene.registry.get("globals")) {
      this.scene.registry
        .get("globals")
        .forEach(
          (eventListener: { event: string; function: EventListener }) => {
            document.removeEventListener(
              eventListener.event,
              eventListener.function
            );
          }
        );
    }

    this.scene.scene.start(nextSceneKey, data);
  }
}
