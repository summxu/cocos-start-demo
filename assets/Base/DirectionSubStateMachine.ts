/*
* @Author: Chenxu
* @Date: 2023-06-21 09:08:17
* @Last Modified time: 2023-06-21 09:08:17
*/

import { DIRECTION_ORDER_ENUM, PARAM_NAME_ENUM } from "../Enum"
import { SubStateMachine } from "./SubStateMachine"

export class DirectionSubStateMachine extends SubStateMachine {

  run() {
    // 获取方向(number)，然后设置状态
    const value = this.fsm.getParams(PARAM_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}