/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { cclegacy, _decorator } from "cc";
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, EVENT_ENUM } from "../Enum";
import { IEntity } from "../Levels";
import DataManager from "../Runtime/DataManage";
import EventManage from "../Runtime/EventManage";
import { EntityManager } from "./EntityManager";
const { ccclass, property } = _decorator;

@ccclass("EnemiesManager")
export class EnemiesManager extends EntityManager {
  init(params: Partial<IEntity>) {
    // // 初始化动画状态机
    // this.fsm = this.addComponent(WoodenSkeletonStateMachine);
    // await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: params.x,
      y: params.y,
      state: ENITIY_STATE_ENUM.IDLE,
      direction: DIRECTION_ENUM.TOP,
      type: ENITIY_TYPE_ENUM.ENEMIES
    })

    EventManage.Instance.on(EVENT_ENUM.MOVE_OVER, this.seePlayHandle, this)
    EventManage.Instance.on(EVENT_ENUM.PLAYER_FINISH, this.seePlayHandle, this)
    EventManage.Instance.on(EVENT_ENUM.PLAYER_ATTACK, this.deathHandle, this)
    this.seePlayHandle()
  }

  onDestroy() {
    super.onDestroy()
    EventManage.Instance.off(EVENT_ENUM.MOVE_OVER, this.seePlayHandle)
    EventManage.Instance.off(EVENT_ENUM.PLAYER_FINISH, this.seePlayHandle)
    EventManage.Instance.off(EVENT_ENUM.PLAYER_ATTACK, this.deathHandle)
  }

  // 骷髅死亡
  deathHandle(attackId: string) {
    if (attackId !== this.id) return
    if (this.state === ENITIY_STATE_ENUM.DEATH) return
    this.state = ENITIY_STATE_ENUM.DEATH
  }

  // 跟随玩家位置改变转向
  seePlayHandle() {
    if (!DataManager.Instance.player || this.state === ENITIY_STATE_ENUM.DEATH) return
    const { x: playerX, y: playerY } = DataManager.Instance.player
    // 判断距离怪物的相对位置
    const [relativeX, relativeY] = [Math.abs(playerX - this.x), Math.abs(playerY - this.y)]
    if (playerX <= this.x && playerY <= this.y) {
      // 在怪物方向的第一象限
      if (relativeX - relativeY === 0) {
        // empty
      } else if (relativeX - relativeY > 0) {
        this.direction = DIRECTION_ENUM.LEFT
      } else {
        this.direction = DIRECTION_ENUM.TOP
      }
    } else if (playerX <= this.x && playerY >= this.y) {
      // 在怪物方向的第三象限
      if (relativeX - relativeY === 0) {
        // empty
      } else if (relativeX - relativeY > 0) {
        this.direction = DIRECTION_ENUM.LEFT
      } else {
        this.direction = DIRECTION_ENUM.BOTTOM
      }
    } else if (playerX >= this.x && playerY <= this.y) {
      // 在怪物方向的第二象限
      if (relativeX - relativeY === 0) {
        // empty
      } else if (relativeX - relativeY > 0) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else {
        this.direction = DIRECTION_ENUM.TOP
      }
    } else if (playerX >= this.x && playerY >= this.y) {
      // 在怪物方向的第四象限
      if (relativeX - relativeY === 0) {
        // empty
      } else if (relativeX - relativeY > 0) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else {
        this.direction = DIRECTION_ENUM.BOTTOM
      }
    }
  }
}
