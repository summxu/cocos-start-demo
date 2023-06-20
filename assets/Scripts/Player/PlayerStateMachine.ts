/*
 * @Author: Chenxu
 * @Date: 2023-06-19 20:53:39
 * @LastEditTime: 2023-06-19 23:07:13
 */
import { Animation, AnimationClip, _decorator } from 'cc'
import State from '../../Base/State'
import { StateMachine, getInitParamsNumebr, getInitParamsTrigger } from '../../Base/StateMachine'
import { PARAM_NAME_ENUM } from '../../Enum'
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
    this.params.set(PARAM_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DIRECTION, getInitParamsNumebr())
  }

  // 初始化状态机列表
  initStateMachines() {
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(PARAM_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top'))
  }

  // 绑定一个动画事件,其他动画播放完成后，继续播放 idle动画
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      // 判断动画类型，使用 path 查找关键字
      const whiteList = ['turn']
      const name = this.animationComponent.defaultClip.name
      if (whiteList.some(item => name.includes(item))) {
        this.setParams(PARAM_NAME_ENUM.IDLE, true)
      }
    }, this)
  }

  // 设置 transtation,当参数改变，修改当前的state
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT):
        // 检查params的trigger value，是否为 true
        if (this.getParams(PARAM_NAME_ENUM.IDLE)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        }

        if (this.getParams(PARAM_NAME_ENUM.TURNLEFT)) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT)
        }
        break;

      default:
        this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
    }
  }
}
