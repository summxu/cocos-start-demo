import { color, Component, Node, Sprite, UITransform, _decorator } from "cc";
import { EVENT_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import levels from "../../Levels";
import DataManager from "../../Runtime/DataManage";
import EventManage from "../../Runtime/EventManage";
import { createUINode } from "../../Utils";
import { PlayerManage } from "../Player/PlayerManage";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManage";
import { TileMapManage } from "../Tile/TileMapManage";
const { ccclass, property } = _decorator;

@ccclass("BattleManage")
export class BattleManage extends Component {
  stage: Node;

  onLoad() {
    EventManage.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
  }

  onDestroy() {
    EventManage.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
  }

  start() {
    this.generateStage();
    this.initLevel();
  }

  initLevel() {
    this.clearLevel();
    // 拿到关卡数据，往数据中心存储
    const { mapInfo } = levels[`level${DataManager.Instance.levelIndex}`];
    DataManager.Instance.mapInfo = mapInfo;
    DataManager.Instance.mapRowCount = mapInfo.length || 0;
    DataManager.Instance.mapColCount = mapInfo[0].length || 0; // 列数

    this.generateTileMap();
    this.generatePlayer();
  }

  // 下一关执行的方法
  nextLevel() {
    DataManager.Instance.levelIndex++;
    this.initLevel();
  }

  // 清空舞台的所有子元素
  clearLevel() {
    this.stage.destroyAllChildren();
    DataManager.Instance.reset();
  }

  generateStage() {
    // 创建舞台node，里面包含人物，地图等
    this.stage = createUINode();
    this.stage.setParent(this.node);
  }

  generatePlayer() {
    const player = createUINode();
    player.setParent(this.stage);
    const playerManage = player.addComponent(PlayerManage); // 往瓦片地图node上添加脚本组件
    playerManage.init();
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
    const { mapRowCount, mapColCount } = DataManager.Instance;
    const disX = (TILE_WIDTH * mapColCount) / 2 - TILE_WIDTH / 2;
    const disY = (TILE_HEIGHT * mapRowCount) / 2 + 80;
    this.stage.setPosition(-disX, disY);
  }
}
