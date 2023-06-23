/*
 * @Author: Chenxu
 * @Date: 2023-06-19 20:53:39
 * @LastEditTime: 2023-06-19 23:07:13
 */
import { Animation, _decorator } from 'cc'
import { getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { ENITIY_STATE_ENUM, PARAM_NAME_ENUM } from '../../Enum'
import { DeathSubStateMachine } from './DeathSubStateMachine'
import { IdleSubStateMachine } from './IdleSubStateMachine'
const { ccclass, property } = _decorator

@ccclass('DoorStateMachine')
export class DoorStateMachine extends StateMachine {

  async init() {
    this.initParams()
    this.initStateMachines()
    await Promise.all(this.waitingList) // 这里用于加载完动画资源的判断
    // 为这个node添加一个animation组件
    this.animationComponent = this.addComponent(Animation);
  }

  // 初始化参数(变量)列表
  initParams() {
    this.params.set(PARAM_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DEATH, getInitParamsTrigger())
  }

  // 初始化状态机列表(子状态机)
  initStateMachines() {
    this.stateMachines.set(ENITIY_STATE_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.DEATH, new DeathSubStateMachine(this))
  }

  // 设置 transtation,当参数改变，修改当前的state
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAM_NAME_ENUM.DEATH):
        // 修改 currentState 触发 State 本身的 run 方法
        if (this.getParams(PARAM_NAME_ENUM.DEATH)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.DEATH)
        } else if (this.getParams(PARAM_NAME_ENUM.IDLE)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
    }
  }
}
