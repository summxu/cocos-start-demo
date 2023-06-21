/*
* @Author: Chenxu
* @Date: 2023-06-21 08:55:53
* @Last Modified time: 2023-06-21 08:55:53
* 手动实现子状态机,抽象类
*/
import State from './State'
import { StateMachine } from './StateMachine'

export abstract class SubStateMachine {
  // 定义当前的状态机，通过切换这个来播放动画
  _currentState: State = null
  // 状态机列表，value是一个的动画 state 类
  stateMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) { }

  set currentState(newState) {
    this._currentState = newState
    // 执行每个state的run方法，会加载一次state动画
    this._currentState.run()
  }

  get currentState() {
    return this._currentState
  }

  abstract run()
}
