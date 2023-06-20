/*
 * @Author: Chenxu
 * @Date: 2023-06-19 20:53:39
 * @LastEditTime: 2023-06-19 23:07:13
 * @Msg: 手动实现动画有限状态机FSM
 * 是一组动画，因为参数的改变，根据条件Transtion来指定到达下一个动画
 */
import { Animation, AnimationClip, Component, SpriteFrame, _decorator, cclegacy } from 'cc'
import State from '../../Base/State'
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM } from '../../Enum'
const { ccclass, property } = _decorator

type ParamsValueType = boolean | number

interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM // 有限状态机的参数(变量)有可能是 触发器/数字
  value: ParamsValueType
}

export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

@ccclass('PlayerStateMacihne')
export class PlayerStateMachine extends Component {
  animationComponent: Animation = null
  // 创建资源加载的 PromiseAll
  waitingList: Promise<SpriteFrame[]>[] = []
  // 定义当前的状态机，通过切换这个来播放动画
  private _currentState: State = null
  // 定义一个参数(变量)列表，来指定步骤改变状态
  params: Map<PARAM_NAME_ENUM, IParamsValue> = new Map()
  // 状态机列表，value是一个的动画 state 类
  stateMachines: Map<PARAM_NAME_ENUM, State> = new Map()

  set currentState(newState) {
    this._currentState = newState
    // 执行每个state的run方法，会加载一次state动画
    this._currentState.run()
  }

  get currentState() {
    return this._currentState
  }

  getParams(paramsName: PARAM_NAME_ENUM) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  setParams(paramsName: PARAM_NAME_ENUM, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      // 改变参数列表的 trigger 的时候，应该要改变 state
      this.run()
      // 运行完一次之后，改变trigger为false
      this.resetTrigger()
    }
  }

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
  }

  // 初始化状态机列表
  initStateMachines() {
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(PARAM_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top'))
  }

  // 把所有的 params trigger 都设置为false
  resetTrigger() {
    this.params.forEach((value, _) => {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    })
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
