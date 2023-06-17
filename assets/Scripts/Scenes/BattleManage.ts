import { Component, _decorator } from "cc";
import { createUINode } from "../../Utils";
import { TileMapManage } from "../Tile/TileMapManage";
const { ccclass, property } = _decorator;

@ccclass("BattleManage")
export class BattleManage extends Component {
  start() {
    this.generateTileMap();
  }

  update(deltaTime: number) {}

  generateTileMap() {
    const stage = createUINode(); //  创建舞台node，里面包含人物，地图等
    stage.setParent(this.node); // 脚本挂到 cavas 上，this.node 就是当前 canvas

    const tileMap = createUINode();
    tileMap.setParent(stage);

    const tileMapManage = tileMap.addComponent(TileMapManage); // 往瓦片地图node上添加脚本组件
    tileMapManage.init();
  }
}
