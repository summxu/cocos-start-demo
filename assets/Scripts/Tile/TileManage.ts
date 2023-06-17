/*
 * @Author: Chenxu
 * @Date: 2023-06-17 08:21:57
 * @LastEditTime: 2023-06-17 08:42:55
 * @Msg: Nothing
 */
import { Component, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileManage")
export class TileManage extends Component {
  start() {}

  init(spriteFrame: SpriteFrame, col: number, row: number) {
    // 给node添加一个 sprite
    const sprite = this.node.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;

    const transform = this.node.addComponent(UITransform);
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

    this.node.setPosition(col * TILE_WIDTH, -row * TILE_HEIGHT);
  }
}
