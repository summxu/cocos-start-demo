/*
* @Author: Chenxu
* @Date: 2023-06-21 14:34:25
* @Last Modified time: 2023-06-21 14:34:25
* @Msg: 
*/

import { DirectionSubStateMachine } from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enum";

const PUBLIC_PATH = `texture/door/idle`

export class IdleSubStateMachine extends DirectionSubStateMachine {

  constructor(fsm: StateMachine) {
    super(fsm)
    // 注册方向状态
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${PUBLIC_PATH}/top`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${PUBLIC_PATH}/left`))
  }
}