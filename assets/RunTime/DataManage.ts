import { ITile } from "../Levels";

class DataManager {
  mapInfo: Array<Array<ITile>>;
  mapRowCount: number;
  mapColCount: number;
}

export const DataManagerInstance = new DataManager();
