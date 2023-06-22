/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM } from "../../Enum";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EntityManager {
  async init() {
    // 初始化动画状态机
    this.fsm = this.addComponent(WoodenSkeletonStateMachine);
    await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: 7,
      y: 7,
      state: ENITIY_STATE_ENUM.IDLE,
      direction: DIRECTION_ENUM.TOP,
      type: ENITIY_TYPE_ENUM.WOODENSKELETON
    })
  }
}
