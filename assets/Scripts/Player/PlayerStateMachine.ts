/*
 * @Author: Chenxu
 * @Date: 2023-06-19 20:53:39
 * @LastEditTime: 2023-06-19 23:07:13
 */
import { Animation, _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { getInitParamsNumebr, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { ENITIY_STATE_ENUM, PARAM_NAME_ENUM } from '../../Enum'
import { BlockBackSubStateMachine } from './BlockBackSubStateMachine'
import { BlockFrontSubStateMachine } from './BlockFrontSubStateMachine'
import { BlockLeftSubStateMachine } from './BlockLeftSubStateMachine'
import { BlockRightSubStateMachine } from './BlockRightSubStateMachine'
import { BlockTurnLeftSubStateMachine } from './BlockTurnLeftSubStateMachine'
import { BlockTurnRightSubStateMachine } from './BlockTurnRightSubStateMachine'
import { IdleSubStateMachine } from './IdleSubStateMachine'
import { TurnLeftSubStateMachine } from './TurnLeftSubStateMachine'
import { TurnRightSubStateMachine } from './TurnRightSubStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

  async init() {
    this.initParams()
    this.initStateMachines()
    await Promise.all(this.waitingList) // 这里用于加载完动画资源的判断
    // 为这个node添加一个animation组件
    this.animationComponent = this.addComponent(Animation);
    this.initAnimationEvent()
  }

  // 初始化参数(变量)列表
  initParams() {
    this.params.set(PARAM_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DIRECTION, getInitParamsNumebr())
    this.params.set(PARAM_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.TURNRIGHT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.BLOCKBACK, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.BLOCKTURNRIGHT, getInitParamsTrigger())
  }

  // 初始化状态机列表(子状态机)
  initStateMachines() {
    this.stateMachines.set(ENITIY_STATE_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this))
    this.stateMachines.set(ENITIY_STATE_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this))
  }

  // 绑定一个动画事件,其他动画播放完成后，继续播放 idle动画
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      // 判断动画类型，使用 path 查找关键字
      const whiteList = ['blockfront', 'blockback', 'blockleft', 'blockright', 'blocktrunleft', 'blocktrunright', 'turn']
      const name = this.animationComponent.defaultClip.name
      if (whiteList.some(item => name.includes(item))) {
        this.node.getComponent(EntityManager).state = ENITIY_STATE_ENUM.IDLE
      }
    }, this)
  }

  // 设置 transtation,当参数改变，修改当前的state
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.TURNRIGHT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCKLEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCKBACK):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCKTURNRIGHT):
        // 修改 currentState 触发 State 本身的 run 方法
        if (this.getParams(PARAM_NAME_ENUM.BLOCKFRONT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCKFRONT)
        } else if (this.getParams(PARAM_NAME_ENUM.BLOCKLEFT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCKLEFT)
        } if (this.getParams(PARAM_NAME_ENUM.BLOCKBACK)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCKBACK)
        } if (this.getParams(PARAM_NAME_ENUM.BLOCKRIGHT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCKRIGHT)
        } if (this.getParams(PARAM_NAME_ENUM.BLOCKTURNLEFT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCKTURNLEFT)
        } if (this.getParams(PARAM_NAME_ENUM.BLOCKTURNRIGHT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCKTURNRIGHT)
        } else if (this.getParams(PARAM_NAME_ENUM.IDLE)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        } else if (this.getParams(PARAM_NAME_ENUM.TURNLEFT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT)
        } else if (this.getParams(PARAM_NAME_ENUM.TURNRIGHT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURNRIGHT)
        } else {
          this.currentState = this.currentState
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
    }
  }
}
