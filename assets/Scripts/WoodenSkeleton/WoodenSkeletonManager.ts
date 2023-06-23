/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { _decorator } from "cc";
import { EnemiesManager } from "../../Base/EnemiesManager";
import { ENITIY_STATE_ENUM, EVENT_ENUM } from "../../Enum";
import DataManager from "../../Runtime/DataManage";
import EventManage from "../../Runtime/EventManage";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EnemiesManager {
  async init() {
    // 初始化动画状态机
    this.fsm = this.addComponent(WoodenSkeletonStateMachine);
    await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: 2,
      y: 5
    })

    EventManage.Instance.on(EVENT_ENUM.MOVE_OVER, this.attackHandle, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManage.Instance.off(EVENT_ENUM.MOVE_OVER, this.attackHandle)
  }

  // 根据玩家位置改变 attack
  attackHandle() {
    if (!DataManager.Instance.player || this.state === ENITIY_STATE_ENUM.DEATH) return
    const { x: playerX, y: playerY } = DataManager.Instance.player
    // 判断距离怪物的相对位置
    const [relativeX, relativeY] = [Math.abs(playerX - this.x), Math.abs(playerY - this.y)]
    if (relativeX <= 1 && relativeY <= 1 && relativeX !== relativeY) {
      this.state = ENITIY_STATE_ENUM.ATTACK
      // 发送攻击事件
      EventManage.Instance.emit(EVENT_ENUM.ENEMIES_ATTACK, ENITIY_STATE_ENUM.DEATH)
    } else {
      this.state = ENITIY_STATE_ENUM.IDLE
    }
  }

}
