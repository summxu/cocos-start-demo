import { _decorator, Component, Node } from "cc";
import { LEVEL_ENUM } from "../../Enum";
import EventManage from "../../Runtime/EventManage";
const { ccclass, property } = _decorator;

@ccclass("ControllerManage")
export class ControllerManage extends Component {
  nextLevelHandle() {
    EventManage.Instance.emit(LEVEL_ENUM.NEXT_LEVEL);
  }
}
