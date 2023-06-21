/*
* @Author: Chenxu
* @Date: 2023-06-21 09:08:17
* @Last Modified time: 2023-06-21 09:08:17
*/

import { AnimationClip } from "cc";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAM_NAME_ENUM } from "../../Enum";

const PUBLIC_PATH = `texture/player/idle`

export class IdleSubStateMachine extends SubStateMachine {

  constructor(fsm: StateMachine) {
    super(fsm)
    // 注册方向状态
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${PUBLIC_PATH}/top`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${PUBLIC_PATH}/bottom`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${PUBLIC_PATH}/left`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${PUBLIC_PATH}/right`, AnimationClip.WrapMode.Loop))
  }

  run() {
    // 获取方向(number)，然后设置状态
    const value = this.fsm.getParams(PARAM_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}