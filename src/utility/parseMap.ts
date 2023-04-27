import BaseScene from "../scenes/BaseScene";
import { iPlayer } from "../objects/Player";

import { Ball, iBall } from "../objects/Ball";

import { iBlock, iBlockSprite } from "../objects/Block";

import { SHEETS } from "../constants";

export const parseMap = (scene: BaseScene, map: Phaser.Tilemaps.Tilemap) => {
  // Get object layers
  const blocksLayer = map.getObjectLayer("blocks");
  const playerLayer = map.getObjectLayer("player");
  const ballLayer = map.getObjectLayer("ball");
  // const powersLayer = map.getObjectLayer("powers");
  const wallsLayer = map.getObjectLayer("walls");
  const decoObjLayer = map.getObjectLayer("deco-objects");

  // Psst! Controls are in here too...
  if (playerLayer) {
    playerLayer.objects.forEach((player) => {
      const myPlayer = player as iPlayer;

      myPlayer.x += map.tileWidth * 0.5;
      myPlayer.y -= map.tileHeight * 0.5;

      class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
        shiplight: Phaser.GameObjects.Light | null;

        constructor(scene: BaseScene, x: number, y: number) {
          super(scene, x, y, SHEETS.Tiles, 10);

          // this.shiplight = scene.lights.addLight(80, 120, 1000, 0x7f0000, 1);
          this.shiplight = null;
        }

        preUpdate() {
          if (this.shiplight) this.shiplight.setPosition(this.x, this.y);
        }
      }

      const sprite = new PlayerSprite(scene, myPlayer.x, myPlayer.y);

      scene.physics.add.existing(sprite);
      scene.add.existing(sprite);

      sprite.setSize(16, 3);

      sprite.scaleX += 1;

      sprite.setPipeline("Light2D");

      // This ship sprite (non physics) "attaches" to the
      // platform by matching its x position in preUpdate(){}
      class Ship extends Phaser.GameObjects.Sprite {
        platform: Phaser.Physics.Arcade.Sprite;
        constructor(
          scene: Phaser.Scene,
          x: number,
          y: number,
          platform: Phaser.Physics.Arcade.Sprite
        ) {
          super(scene, x, y + 10, SHEETS.Tiles, 40);

          this.platform = platform;

          scene.add.existing(this);
        }
        preUpdate() {
          this.x = this.platform.x;
        }
      }
      scene.setShip(
        new Ship(scene, myPlayer.x, myPlayer.y, sprite).setPipeline("Light2D")
      );

      scene.addToPlayerGrp(sprite);

      scene.setPlayer(sprite);

      scene.updatePlayerLoc(new Phaser.Math.Vector2(sprite.x, sprite.y));

      sprite.setDepth(10);

      /***********************************************/
      // Controls... how did these end up in here...
      /***********************************************/
      scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        if (!scene.checkIfStunned()) {
          sprite.x = pointer.worldX;
        }
      });
      scene.input.on("pointerdown", () => {
        if (scene.isClamped() && scene.getNewBall()) {
          scene.launchBall(-60);
          scene.setClamped(false);
        }
      });

      const touchMoveFunc = (e: TouchEvent) => {
        if (!scene.checkIfStunned()) {
          const canvasRect = scene.game.canvas.getBoundingClientRect();
          const scaleFactor =
            scene.game.canvas.width / scene.game.canvas.offsetWidth;

          const touchX =
            (e.changedTouches[0].clientX - canvasRect.left) * scaleFactor;
          // @ts-ignore
          // const touchY = (event.changedTouches[0].clientY - canvasRect.top) * scaleFactor;

          sprite.x = touchX;
        }
      };
      scene.setTouchMoveFunc(touchMoveFunc);
      document.addEventListener("touchmove", touchMoveFunc);

      const clickListenFunc = () => {
        if (scene.isClamped() && scene.getNewBall()) {
          scene.launchBall(-60);
          scene.setClamped(false);
        }
      };
      scene.setClickFunc(clickListenFunc);
      document.addEventListener("mousedown", clickListenFunc);
    });
  }

  if (ballLayer) {
    ballLayer.objects.forEach((ball) => {
      const myBall = ball as iBall;

      myBall.x += map.tileWidth * 0.5;
      myBall.y -= map.tileHeight * 0.5;

      const newBall = new Ball(
        scene,
        myBall.x,
        myBall.y,
        SHEETS.Tiles,
        myBall.gid - 1
      );

      scene.setNewBall(newBall);
    });
  }

  if (blocksLayer) {
    blocksLayer.objects.forEach((block) => {
      const myBlock = block as iBlock;

      myBlock.x += map.tileWidth * 0.5;
      myBlock.y -= map.tileHeight * 0.5;

      const blockSprite = scene.physics.add.sprite(
        myBlock.x,
        myBlock.y,
        SHEETS.Tiles,
        myBlock.gid - 1
      ) as iBlockSprite;

      if (myBlock.properties) {
        const blockProperties = myBlock.properties.reduce(
          (result, { name, value }) => {
            result[name] = value;
            return result;
          },
          {} as { [key: string]: any }
        );
        blockSprite.properties = blockProperties;
      }

      if (
        blockSprite.properties.color &&
        blockSprite.properties.color === "rock"
      ) {
        blockSprite.setCircle(8);
      }

      blockSprite.setPipeline("Light2D");

      scene.increaseBlockCnt();
      scene.addToBlockGrp(blockSprite);
    });
  }

  // // Not really using this layer
  // powersLayer.objects.forEach((power) => {
  //   // (power.properties[0].name);
  //   interface iPowerTile extends Phaser.Types.Tilemaps.TiledObject {
  //     x: number;
  //     y: number;
  //     gid: number;
  //   }
  //   const powerTile = power as iPowerTile;

  //   powerTile.x += map.tileWidth * 0.5;
  //   powerTile.y -= map.tileHeight * 0.5;

  //   new Power(
  //     scene,
  //     powerTile.x,
  //     powerTile.y,
  //     undefined,
  //     powerTile.gid - 1,
  //     tileset
  //   );
  // });

  if (wallsLayer) {
    wallsLayer.objects.forEach((wall: Phaser.Types.Tilemaps.TiledObject) => {
      // .log(ball.gid);
      // .log(map.tilesets[0].getTileCollisionGroup(ball.gid!));
      const collisionGroup = map.tilesets[0].getTileCollisionGroup(
        wall.gid!
      ) as any;

      // wall.x! += map.tileWidth * 0.5;
      wall.y! -= map.tileHeight;

      var objects = collisionGroup.objects;

      const debugGraphics = scene.add.graphics();

      if (
        collisionGroup.properties &&
        collisionGroup.properties.isInteractive
      ) {
        debugGraphics.lineStyle(2, 0x00ff00, 1);
      } else {
        debugGraphics.lineStyle(2, 0x00ffff, 1);
      }

      const debug = false;

      for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        var objectX = wall.x + object.x;
        var objectY = wall.y + object.y;

        // When objects are parsed by Phaser, they will be guaranteed to have one of the
        // following properties if they are a rectangle/ellipse/polygon/polyline.
        if (object.rectangle) {
          if (debug)
            debugGraphics.strokeRect(
              objectX,
              objectY,
              object.width,
              object.height
            );

          const wallSprite = scene.physics.add.sprite(
            (wall.x! += wall.width! / 2),
            (wall.y! += wall.height! / 2),
            SHEETS.Tiles,
            wall.gid! - 1
          );

          wallSprite.setSize(object.width, object.height);
          scene.addToWallGroup(wallSprite);
        } else if (object.ellipse) {
          // Ellipses in Tiled have a top-left origin, while ellipses in Phaser have a center
          // origin
          if (debug)
            debugGraphics.strokeEllipse(
              objectX + object.width / 2,
              objectY + object.height / 2,
              object.width,
              object.height
            );

          // const newZone = scene.add.zone(
          //   objectX + object.width / 2,
          //   objectY + object.height / 2,
          //   object.width,
          //   object.height
          // );

          const pos = (object.width / 2 + object.height / 2) / 2;

          // const myobj: any = scene.physics.add.existing(newZone, true);

          const wallSprite = scene.physics.add.sprite(
            (wall.x! += wall.width! / 2),
            (wall.y! += wall.height! / 2),
            SHEETS.Tiles,
            wall.gid! - 1
          );

          scene.addToWallGroup(wallSprite);

          wallSprite.setCircle(pos);
        }
      }
    });
  }

  if (decoObjLayer) {
    decoObjLayer.objects.forEach((decoObj: any) => {
      decoObj.x += map.tileWidth / 2;
      decoObj.y -= map.tileHeight / 2;

      scene.add.sprite(decoObj.x, decoObj.y, SHEETS.Tiles, decoObj.gid - 1);
    });
  }
};
