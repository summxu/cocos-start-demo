import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManage } from "../Scripts/Player/PlayerManage";
import { TileManage } from "../Scripts/Tile/TileManage";
import { WoodenSkeletonManager } from "../Scripts/WoodenSkeleton/WoodenSkeletonManager";

class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  mapInfo: Array<Array<ITile>>;
  mapRowCount: number = 0;
  mapColCount: number = 0;
  levelIndex: number = 1;
  tileList: Array<Array<TileManage>>  // 存放tile类
  player: PlayerManage
  door: DoorManager
  enemies: WoodenSkeletonManager[] = []

  reset() {
    this.mapInfo = [];
    this.mapRowCount = 0;
    this.mapColCount = 0;
    this.tileList = []
    this.door = null
    this.enemies = []
    this.player = null
  }
}

export default DataManager;
