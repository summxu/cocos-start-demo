import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";

class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  mapInfo: Array<Array<ITile>>;
  mapRowCount: number = 0;
  mapColCount: number = 0;
  levelIndex: number = 1;
}

export default DataManager;
