/*
 * @Author: Chenxu
 * @Date: 2023-06-16 21:09:28
 * @LastEditTime: 2023-06-17 22:46:11
 * @Msg: Nothing
 */
import { TILE_TYPE_ENUM } from "../Enum";
import level1 from "./level1";
import level2 from "./level2";

export interface ITile {
  src: number | null;
  type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>;
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
};

export default levels;
