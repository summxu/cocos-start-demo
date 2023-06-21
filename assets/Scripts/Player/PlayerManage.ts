/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, EVENT_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import EventManage from "../../Runtime/EventManage";
import { PlayerStateMachine } from "./PlayerStateMachine";
import DataManager from "../../RunTime/DataManage";
const { ccclass, property } = _decorator;

@ccclass("PlayerManage")
export class PlayerManage extends EntityManager {
  targetY: number = 0;
  targetX: number = 0;

  private readonly speed: number = 1 / 10; // 每帧移动的距离，表示速度

  async init() {
    // 初始化动画状态机
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: 0,
      y: 0,
      state: ENITIY_STATE_ENUM.IDLE,
      direction: DIRECTION_ENUM.TOP,
      type: ENITIY_TYPE_ENUM.PLAYER
    })
  }

  onLoad() {
    EventManage.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this);
  }

  onDestroy() {
    EventManage.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move);
  }

  update() {
    this.updateXY();
    super.update()
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed;
    } else if (this.x > this.targetX) {
      this.x -= this.speed;
    }

    if (this.y < this.targetY) {
      this.y += this.speed;
    } else if (this.y > this.targetY) {
      this.y -= this.speed;
    }

    // 移动过程中，如果目标位置和当前位置的差值小于0.1的时候，认定为停止移动
    if (
      Math.abs(this.targetY - this.y) < 0.1 &&
      Math.abs(this.targetX - this.x) < 0.1
    ) {
      // 相等既停止移动，不会走任何判断
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  // 按钮Click实际走的方法
  move(direct: PLAYER_CTRL_ENUM) {
    console.log(DataManager.Instance.mapInfo)
    if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
      this.targetY++;
    } else if (direct === PLAYER_CTRL_ENUM.TOP) {
      this.targetY--;
    } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
      this.targetX--;
    } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
      this.targetX++;
    } else if (direct === PLAYER_CTRL_ENUM.TURNLEFT) {
      this.state = ENITIY_STATE_ENUM.TURNLEFT
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
    }
  }
}
