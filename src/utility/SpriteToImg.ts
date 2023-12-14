export const SpriteToImg = (
  scene: Phaser.Scene,
  sheet: string,
  frame: number
) => {
  const sprite = scene.add.sprite(0, 0, sheet, frame);

  // Create a separate canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const baseTexture = scene.textures.get(sheet);
  // Retrieve the frame from the texture
  const frameData = baseTexture.get(frame);

  canvas.width = sprite.width;
  canvas.height = sprite.height;

  // Draw the specific frame onto the canvas
  context!.drawImage(
    frameData.texture.source[0].image,
    sprite.frame.cutX,
    sprite.frame.cutY,
    sprite.frame.cutWidth,
    sprite.frame.cutHeight,
    0,
    0,
    sprite.width,
    sprite.height
  );

  const dataURL = canvas.toDataURL("image/png");
  const img = document.createElement("img");
  img.src = dataURL;

  canvas.remove();

  return img;
};
