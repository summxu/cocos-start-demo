/*
 * @Author: Chenxu
 * @Date: 2023-06-16 21:09:28
 * @LastEditTime: 2023-06-16 22:06:23
 * @Msg: Nothing
 */
import level1 from "./level1";

export interface ITile {
  src:number | null
  type:string | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
}

const levels:Record<string, ILevel> = {
  level1
}

export default levels
