/*
 * @Author: Chenxu
 * @Date: 2023-06-19 20:53:39
 * @LastEditTime: 2023-06-19 23:07:13
 */
import { Animation, _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { ENITIY_STATE_ENUM, PARAM_NAME_ENUM } from '../../Enum'
import { IdleSubStateMachine } from './IdleSubStateMachine'
const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {

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
  }

  // 初始化状态机列表(子状态机)
  initStateMachines() {
    this.stateMachines.set(ENITIY_STATE_ENUM.IDLE, new IdleSubStateMachine(this))
  }

  // 绑定一个动画事件,其他动画播放完成后，继续播放 idle动画
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      // 判断动画类型，使用 path 查找关键字
      const whiteList = []
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
        // 修改 currentState 触发 State 本身的 run 方法
        if (this.getParams(PARAM_NAME_ENUM.IDLE)) {
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
