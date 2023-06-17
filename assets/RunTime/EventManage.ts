/*
 * @Author: Chenxu
 * @Date: 2023-06-17 13:14:51
 * @LastEditTime: 2023-06-17 22:26:35
 * @Msg: 创建一个单例的事件中心
 * 实际上实践中心就是一个 Map，创建好之后可以整个都绑定不同的 scenes
 * 事件管理中心就是维护这个map的基本方法
 */

import Singleton from "../Base/Singleton";

interface IItem {
  func: Function;
  ctx: unknown;
}

export default class EventManage extends Singleton {
  static get Instance() {
    // 重写方法，为了传入泛型
    return super.GetInstance<EventManage>();
  }

  private eventDic: Map<string, Array<IItem>> = new Map();

  on(eventName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).push({ func, ctx });
    } else {
      this.eventDic.set(eventName, [{ func, ctx }]);
    }
  }

  off(eventName: string, func: Function) {
    if (this.eventDic.has(eventName)) {
      const index = this.eventDic
        .get(eventName)
        .findIndex((item) => item.func === func);
      index > -1 && this.eventDic.get(eventName).splice(index, 1);
    }
  }

  emit(eventName: string, ...params: unknown[]) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).forEach(({ func, ctx }) => {
        ctx ? func(...params).apply(ctx) : func(...params);
      });
    }
  }

  clear() {
    this.eventDic.clear();
  }
}
