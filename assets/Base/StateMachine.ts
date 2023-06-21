/*
 * @Author: Chenxu
 * @Date: 2023-06-19 20:53:39
 * @LastEditTime: 2023-06-19 23:07:13
 * 这是一个抽象类，是手动实现的动画有限状态机FSM
 * 原理是一组动画，因为参数的改变，根据条件Transtion来指定到达下一个动画
 * https://docs.cocos.com/creator/manual/zh/animation/marionette/
 */
import { Animation, Component, SpriteFrame, _decorator } from 'cc'
import { FSM_PARAMS_TYPE_ENUM } from '../Enum'
import State from './State'
import { SubStateMachine } from './SubStateMachine'
const { ccclass, property } = _decorator

// 参数列表共有两个类型，number 表示方向 trigger 表示左转右转
type ParamsValueType = boolean | number

interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM // 有限状态机的参数(变量)有可能是 触发器/数字
  value: ParamsValueType
}

export const getInitParamsNumebr = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  animationComponent: Animation = null
  // 创建资源加载的 PromiseAll
  waitingList: Promise<SpriteFrame[]>[] = []
  // 定义当前的状态机，通过切换这个来播放动画
  private _currentState: State | SubStateMachine = null
  // 定义一个参数(变量)列表，来指定步骤改变状态
  params: Map<string, IParamsValue> = new Map()
  // 状态机列表，value是一个的动画 state 类
  stateMachines: Map<string, State | SubStateMachine> = new Map()

  set currentState(newState) {
    this._currentState = newState
    // 执行每个state的run方法，会加载一次state动画
    this._currentState.run()
  }

  get currentState() {
    return this._currentState
  }

  getParams(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  setParams(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      // 改变参数列表的 trigger 的时候，应该要改变 state
      this.run()
      // 运行完一次之后，改变trigger为false
      this.resetTrigger()
    }
  }

  // 把所有的 params trigger 都设置为false
  resetTrigger() {
    this.params.forEach((value, _) => {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    })
  }

  // 抽象方法，可被重写
  abstract init()

  abstract run()
}
