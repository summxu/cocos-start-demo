/*
 * @Author: Chenxu
 * @Date: 2023-06-18 15:20:57
 * @LastEditTime: 2023-06-19 23:06:04
 * @Msg: https://docs.cocos.com/creator/manual/zh/animation/use-animation-curve.html
 */
import {
  Component,
  Sprite,
  UITransform,
  _decorator
} from "cc";
import { EVENT_ENUM, PARAM_NAME_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import EventManage from "../../Runtime/EventManage";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManage";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass, property } = _decorator;

@ccclass("PlayerManage")
export class PlayerManage extends Component {
  targetY: number = 0;
  targetX: number = 0;
  fsm: PlayerStateMachine = null;
  x: number = 0;
  y: number = 0; // x,y表示当前位置，需要实时移动才能有动画
  private readonly speed: number = 1 / 10; // 每帧移动的距离，表示速度

  async init() {
    // 创建人物 Sprite
    await this.render();
    // 初始化动画状态机
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init(); // 先加载完动画资源
    // 初始化状态机的默认状态
    this.fsm.setParams(PARAM_NAME_ENUM.IDLE, true)
  }

  onLoad() {
    EventManage.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this);
  }

  onDestroy() {
    EventManage.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move);
  }

  update() {
    this.updateXY();
    // 循环设置人物位置
    this.node.setPosition(
      TILE_WIDTH * this.x - TILE_WIDTH * 2,
      -TILE_HEIGHT * this.y + TILE_HEIGHT * 2
    );
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed;
    } else if (this.x > this.targetX) {
      this.x -= this.speed;
    }

    if (this.y < this.targetY) {
      this.y += this.speed;
    } else if (this.y > this.targetY) {
      this.y -= this.speed;
    }

    // 移动过程中，如果目标位置和当前位置的差值小于0.1的时候，认定为停止移动
    if (
      Math.abs(this.targetY - this.y) < 0.1 &&
      Math.abs(this.targetX - this.x) < 0.1
    ) {
      // 相等既停止移动，不会走任何判断
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  // 按钮Click实际走的方法
  move(direct: PLAYER_CTRL_ENUM) {
    if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
      this.targetY++;
    } else if (direct === PLAYER_CTRL_ENUM.TOP) {
      this.targetY--;
    } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
      this.targetX--;
    } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
      this.targetX++;
    } else if (direct === PLAYER_CTRL_ENUM.TURNLEFT) {
      this.fsm.setParams(PARAM_NAME_ENUM.TURNLEFT, true);
    }
  }

  async render() {
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);
  }
}
