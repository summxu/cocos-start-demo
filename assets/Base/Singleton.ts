/*
 * @Author: Chenxu
 * @Date: 2023-06-17 13:14:51
 * @LastEditTime: 2023-06-17 13:21:39
 * @Msg: Nothing
 */
export default class Singleton {
  private static _instance: any = null;

  static GetInstance<T>(): T {
    if (this._instance === null) {
      this._instance = new this();
    }

    return this._instance;
  }
}
