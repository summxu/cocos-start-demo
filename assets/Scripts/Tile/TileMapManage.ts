import {
  _decorator,
  Component,
  Node,
  resources,
  SpriteFrame,
  Sprite,
  Layers,
  UITransform,
} from "cc";
import levels from "../../Levels";
const { ccclass, property } = _decorator;
export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;
@ccclass("TileMapManage")
export class TileMapManage extends Component {
  start() {}

  update(deltaTime: number) {}

  async init() {
    const tileImgs = await this.loadTileImgs();
    // 便利所有的瓦片图位置
    const level = 1;
    const { mapInfo } = levels[`level${level}`];
    mapInfo.forEach((item, col) => {
      item.forEach((element, row) => {
        if (element.src && element.type) {
          // 找到每一个应该渲染的瓦片描述
          const tileImg =
            tileImgs.find((item) => item.name === `tile (${element.src})`) ||
            tileImgs[0];

          // 创建一个 node
          const node = new Node();
          const sprite = node.addComponent(Sprite);
          sprite.spriteFrame = tileImg;

          const transform = node.addComponent(UITransform);
          transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

          node.layer = 1 << Layers.nameToLayer("UI_2D");
          node.setPosition(col * TILE_WIDTH, -row * TILE_HEIGHT);
          node.setParent(this.node);
        }
      });
    });
  }

  loadTileImgs() {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(
        "texture/tile/tile",
        SpriteFrame,
        (err, spriteFrames) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(spriteFrames);
        }
      );
    });
  }
}
