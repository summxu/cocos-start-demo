/*
 * @Author: Chenxu
 * @Date: 2023-06-16 21:09:28
 * @LastEditTime: 2023-06-17 22:46:11
 * @Msg: Nothing
 */
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, TILE_TYPE_ENUM } from "../Enum";
import level1 from "./level1";
import level2 from "./level2";

export interface IEntity {
  x: number;
  y: number;
  type: ENITIY_TYPE_ENUM;
  direction: DIRECTION_ENUM;
  state: ENITIY_STATE_ENUM;
}

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
