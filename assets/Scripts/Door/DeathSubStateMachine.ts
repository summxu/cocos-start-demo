/*
 * @Author: Chenxu 
 * @Date: 2023-06-21 14:36:40 
 * @Last Modified by: Chenxu
 * @Last Modified time: 2023-06-21 14:37:01
 */

import { DirectionSubStateMachine } from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enum";

const PUBLIC_PATH = `texture/door/death`

export class DeathSubStateMachine extends DirectionSubStateMachine {

  constructor(fsm: StateMachine) {
    super(fsm)
    // 注册方向状态
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${PUBLIC_PATH}`))
  }
}