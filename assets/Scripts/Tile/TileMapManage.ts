import { Component, _decorator } from "cc";
import DataManager from "../../Runtime/DataManage";
import { loadDir } from "../../Runtime/ResourceManage";
import { createUINode, randomByRange } from "../../Utils";
import { TileManage } from "./TileManage";
const { ccclass, property } = _decorator;

@ccclass("TileMapManage")
export class TileMapManage extends Component {
  start() {}

  async init() {
    const tileImgs = await loadDir("texture/tile/tile");

    const { mapInfo } = DataManager.Instance;
    // 遍历所有的瓦片图数据
    mapInfo.forEach((item, col) => {
      item.forEach((element, row) => {
        if (element.src && element.type) {
          // 随机三种不同材质
          if (
            (element.type === "FLOOR" ||
              element.type === "WALL_ROW" ||
              element.type === "WALL_COLUMN") &&
            !(col % 2) &&
            !(row % 2) // 偶数才会随机不同材质
          ) {
            element.src = element.src + randomByRange(0, 4);
          }

          // 找到每一个应该渲染的瓦片描述
          let SpriteFrame =
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
}
