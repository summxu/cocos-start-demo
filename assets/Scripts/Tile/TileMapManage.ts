import { Component, resources, SpriteFrame, _decorator } from "cc";
import { DataManagerInstance } from "../../RunTime/DataManage";
import { createUINode } from "../../Utils";
import { TileManage } from "./TileManage";
const { ccclass, property } = _decorator;

@ccclass("TileMapManage")
export class TileMapManage extends Component {
  start() {}

  async init() {
    const tileImgs = await this.loadTileImgs();

    const { mapInfo } = DataManagerInstance;
    // 遍历所有的瓦片图数据
    mapInfo.forEach((item, col) => {
      item.forEach((element, row) => {
        if (element.src && element.type) {
          // 找到每一个应该渲染的瓦片描述
          const SpriteFrame =
            tileImgs.find((item) => item.name === `tile (${element.src})`) ||
            tileImgs[0];

          // 创建每一个 瓦片图节点
          const node = createUINode("Tile");
          const tileManage = node.addComponent(TileManage);
          // 初始化 tile节点管理脚本
          tileManage.init(SpriteFrame, col, row);

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
