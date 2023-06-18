import { _decorator, Component, Node } from "cc";
import { EVENT_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import EventManage from "../../Runtime/EventManage";
const { ccclass, property } = _decorator;

@ccclass("ControllerManage")
export class ControllerManage extends Component {
  playCtrlHandle(event: Event, direct: PLAYER_CTRL_ENUM) {
    EventManage.Instance.emit(EVENT_ENUM.PLAYER_CTRL, direct);
  }
}
