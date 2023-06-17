import { Component, Node, _decorator } from "cc";
import levels from "../../Levels";
import { DataManagerInstance } from "../../RunTime/DataManage";
import { createUINode } from "../../Utils";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManage";
import { TileMapManage } from "../Tile/TileMapManage";
const { ccclass, property } = _decorator;

@ccclass("BattleManage")
export class BattleManage extends Component {
  stage: Node;

  start() {
    this.generateStage();
    this.initLevel();
  }

  initLevel() {
    // 拿到关卡数据，往数据中心存储
    const level = 1;
    const { mapInfo } = levels[`level${level}`];
    DataManagerInstance.mapInfo = mapInfo;
    DataManagerInstance.mapRowCount = mapInfo.length || 0;
    DataManagerInstance.mapColCount = mapInfo[0].length || 0; // 列数

    this.generateTileMap();
  }

  generateStage() {
    // 创建舞台node，里面包含人物，地图等
    this.stage = createUINode();
    this.stage.setParent(this.node); // 脚本挂到 cavas 上，this.node 就是当前 canvas
  }

  generateTileMap() {
    const tileMap = createUINode();
    tileMap.setParent(this.stage);

    const tileMapManage = tileMap.addComponent(TileMapManage); // 往瓦片地图node上添加脚本组件
    tileMapManage.init();

    // 创建好瓦片之后，再调整舞台适配
    this.adaptPositon();
  }

  // 设置舞台位置适配不同屏幕大小
  adaptPositon() {
    const { mapRowCount, mapColCount } = DataManagerInstance;
    const disX = (TILE_WIDTH * mapColCount) / 2 - 25;
    const disY = (TILE_HEIGHT * mapRowCount) / 2 + 80;
    this.stage.setPosition(-disX, disY);
  }
}
