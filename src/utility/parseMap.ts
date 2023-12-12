import BaseScene from "../scenes/BaseScene";
import { iPlayer, PlayerSprite } from "../objects/Player";

import { Ball, iBall } from "../objects/Ball";

import { iBlock, iBlockSprite } from "../objects/Block";

import { IMAGES, PIPELINES, SHEETS } from "../constants";

export const parseMap = (scene: BaseScene, map: Phaser.Tilemaps.Tilemap) => {
  // Get object layers
  const blocksLayer = map.getObjectLayer("blocks");
  const playerLayer = map.getObjectLayer("player");
  const ballLayer = map.getObjectLayer("ball");
  // const powersLayer = map.getObjectLayer("powers");
  const wallsLayer = map.getObjectLayer("walls");
  const decoObjLayer = map.getObjectLayer("deco-objects");

  // Player Layer - Psst! Controls are in here too...
  if (playerLayer) {
    playerLayer.objects.forEach((player) => {
      const myPlayer = player as iPlayer;

      myPlayer.x += map.tileWidth * 0.5;
      myPlayer.y -= map.tileHeight * 0.5;

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
          super(scene, x, y + 10, SHEETS.ships, 0);

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
        if (!scene.checkIfStunned() && !scene.checkAiEnabled()) {
          sprite.x = pointer.worldX;
        }
      });
      scene.input.on("pointerdown", () => {
        setTimeout(() => {
          if (
            !scene.scene.isPaused() &&
            scene.isClamped() &&
            scene.getNewBall()
          ) {
            scene.launchBall(-60);
            scene.setClamped(false);
          }
        }, 100);
      });

      const touchMoveFunc = (e: TouchEvent) => {
        if (!scene.checkIfStunned() && !scene.checkAiEnabled()) {
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
      const global1 = { event: "touchmove", function: touchMoveFunc };

      const clickListenFunc = () => {
        setTimeout(() => {
          if (
            !scene.scene.isPaused() &&
            scene.isClamped() &&
            scene.getNewBall()
          ) {
            scene.launchBall(-60);
            scene.setClamped(false);
          }
        }, 100);
      };
      scene.setClickFunc(clickListenFunc);
      document.addEventListener("mousedown", clickListenFunc);
      const global2 = { event: "mousedown", function: clickListenFunc };

      scene.registry.set("globals", [global1, global2]);
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
      const collisionGroup = map.tilesets[0].getTileCollisionGroup(
        wall.gid!
      ) as any;

      const collisionObjs = collisionGroup.objects;

      // This takes the wall.properties array, which is originally structured as:
      // [ { name: "color", type: "string", value: "" }, { name: "useWallHeight", type: bool, value: true }]
      // and changes it into this, so we can more easily access properties:
      // { name: "color", value: "" , name: "useWallHeight", value: true }
      const wallObjProps = wall.properties.reduce((acc: any, property: any) => {
        acc[property.name] = property.value;
        return acc;
      }, {});

      collisionObjs.forEach((collisionObj: any) => {
        if (collisionObj.rectangle) {
          const rectX = wall.x! + wall.width! / 2 + collisionObj.x;
          const rectY = wall.y! - wall.height! / 2 + collisionObj.y;

          const rectangleSprite = scene.physics.add.sprite(
            rectX - wall.width! / 2,
            rectY - wall.height! / 2,
            "null"
          );
          rectangleSprite.setOrigin(0);

          /*  
            We generate the graphics texture for the sprite after the 
            sprite is created so the generated texture fits the sprite
          */
          scene.make
            .graphics()
            .fillStyle(0x202020, 1)
            .fillRect(0, 0, rectangleSprite.width, rectangleSprite.height)
            .generateTexture(
              "wallTexture",
              rectangleSprite.width,
              rectangleSprite.height
            );

          rectangleSprite.setTexture("wallTexture");

          rectangleSprite.setPipeline(PIPELINES.Light2D);

          let spriteHeight = collisionObj.height;
          if (wallObjProps.useWallHeight === true) {
            spriteHeight = wall.height!;
          }

          let spriteWidth = collisionObj.width;
          if (wallObjProps.useWallWidth === true) {
            spriteWidth = wall.width!;
          }

          if (wallObjProps.doubleHeight === true) {
            spriteHeight *= 2;
          }

          rectangleSprite.setDisplaySize(spriteWidth, spriteHeight);

          scene.addToWallGroup(rectangleSprite);
        } else if (collisionObj.ellipse) {
          const rectX = wall.x! + wall.width! / 2 + collisionObj.x;
          const rectY = wall.y! - wall.height! / 2 + collisionObj.y;

          const circleSprite = scene.physics.add.sprite(
            rectX - wall.width! / 2,
            rectY - wall.height! / 2,
            "null"
          );

          circleSprite.setOrigin(0);

          circleSprite.setDisplaySize(collisionObj.width, collisionObj.height);

          circleSprite.setSize(collisionObj.width, collisionObj.height);
          circleSprite.setCircle(collisionObj.width);

          scene.make
            .graphics()
            .fillStyle(0x202020, 1)
            .fillCircle(0, 0, circleSprite.width)
            .generateTexture(
              "wallTexture",
              circleSprite.width,
              circleSprite.height
            );

          circleSprite.setTexture("wallTexture");

          circleSprite.setPipeline(PIPELINES.Light2D);

          scene.addToWallGroup(circleSprite);
        }
      });
    });
  }

  if (decoObjLayer) {
    decoObjLayer.objects.forEach((decoObj: any) => {
      decoObj.x += map.tileWidth / 2;
      decoObj.y -= map.tileHeight / 2;

      scene.add.sprite(decoObj.x, decoObj.y, SHEETS.Tiles, decoObj.gid - 1);
    });
  }

  if (map.getLayer("deco")) {
    const decoLayer = map.createLayer("deco", IMAGES.BreakoutExtruded);
    if (decoLayer) decoLayer.setPipeline("Light2D");
  }
};
