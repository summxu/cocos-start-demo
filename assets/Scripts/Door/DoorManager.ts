/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import DataManager from "../../Runtime/DataManage";
import EventManage from "../../Runtime/EventManage";
import { DoorStateMachine } from "./DoorStateMachine";
const { ccclass, property } = _decorator;

@ccclass("DoorManager")
export class DoorManager extends EntityManager {
  async init() {
    // 初始化动画状态机
    this.fsm = this.addComponent(DoorStateMachine);
    await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: 7,
      y: 8,
      state: ENITIY_STATE_ENUM.IDLE,
      direction: DIRECTION_ENUM.TOP,
      type: ENITIY_TYPE_ENUM.DOOR
    })

    EventManage.Instance.on(EVENT_ENUM.OPEN_DOOR, this.onOpenDoor, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManage.Instance.off(EVENT_ENUM.OPEN_DOOR, this.onOpenDoor)
  }

  onOpenDoor() {
    // 判断敌人数量是不是都死了
    const enemies = DataManager.Instance.enemies
    const allDeath = enemies.every(item => item.state === ENITIY_STATE_ENUM.DEATH)
    if (allDeath) {
      this.direction = DIRECTION_ENUM.LEFT
      this.state = ENITIY_STATE_ENUM.DEATH
    }
  }
}
