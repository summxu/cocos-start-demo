/*
 * @Author: Chenxu
 * @Date: 2023-06-17 08:21:57
 * @LastEditTime: 2023-06-17 08:42:55
 * @Msg: Nothing
 */
import { Component, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import { TILE_TYPE_ENUM } from "../../Enum";
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileManage")
export class TileManage extends Component {

  type: TILE_TYPE_ENUM
  moveable: boolean // 碰撞状态可走
  turnable: boolean // 碰撞状态可转

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, col: number, row: number) {
    // 给node添加一个 sprite
    const sprite = this.node.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;

    const transform = this.node.addComponent(UITransform);
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
    this.node.setPosition(col * TILE_WIDTH, -row * TILE_HEIGHT);

    this.type = type
    // 判断 node 的类型，并添加碰撞检测机制
    if (this.type.includes('WALL')) { // 墙壁
      this.moveable = false
      this.turnable = false
    } else if (this.type.includes('CLIFF')) { // 悬崖
      this.moveable = false
      this.turnable = true
    } else { // 地板
      this.turnable = true
      this.moveable = true
    }
  }
}
