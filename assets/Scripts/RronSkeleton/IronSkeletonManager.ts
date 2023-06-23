/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { _decorator } from "cc";
import { EnemiesManager } from "../../Base/EnemiesManager";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";
const { ccclass, property } = _decorator;

@ccclass("IronSkeletonManager")
export class IronSkeletonManager extends EnemiesManager {
  async init() {
    // 初始化动画状态机
    this.fsm = this.addComponent(IronSkeletonStateMachine);
    await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: 7,
      y: 7
    })
  }
}
