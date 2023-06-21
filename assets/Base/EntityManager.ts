/*
 * @Author: Chenxu 
 * @Date: 2023-06-21 14:46:18 
 * @Last Modified by: Chenxu
 * @Last Modified time: 2023-06-21 14:55:49
 * @msg: 抽取人物基类（包括怪物）
 */

import { Component, Sprite, UITransform, _decorator } from "cc";
import { IEntity } from "../Levels";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";
import { TILE_HEIGHT, TILE_WIDTH } from "../Scripts/Tile/TileManage";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, PARAM_NAME_ENUM } from "../Enum";
const { ccclass, property } = _decorator;

@ccclass("EntityManager")
export class EntityManager extends Component {
  fsm: PlayerStateMachine;
  // x,y表示当前位置
  x: number = 0;
  y: number = 0;
  type: ENITIY_TYPE_ENUM

  // 设置人物的方向和动画状态，数据驱动视图
  private _direction: DIRECTION_ENUM
  private _state: ENITIY_STATE_ENUM

  get direction() {
    return this._direction
  }

  set direction(newState) {
    this._direction = newState
    this.fsm.setParams(PARAM_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction]);
  }

  get state() {
    return this._state
  }

  set state(newState) {
    this._state = newState
    this.fsm.setParams(this._state, true);
  }

  init(params: IEntity) {
    // 创建人物 Sprite
    this.render();

    this.x = params.x
    this.y = params.y
    this.state = params.state
    this.type = params.type
    this.direction = params.direction
  }

  update() {
    // 循环设置人物位置
    this.node.setPosition(TILE_WIDTH * this.x - TILE_WIDTH * 2, -TILE_HEIGHT * this.y + TILE_HEIGHT * 2);
  }

  render() {
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);
  }
}
