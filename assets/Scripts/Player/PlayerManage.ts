/*
 * @Author: Chenxu
 * @Date: 2023-06-18 15:20:57
 * @LastEditTime: 2023-06-18 22:59:09
 * @Msg: https://docs.cocos.com/creator/manual/zh/animation/use-animation-curve.html
 */
import {
  animation,
  Animation,
  AnimationClip,
  Component,
  Event,
  Sprite,
  UITransform,
  _decorator,
} from "cc";
import { EVENT_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import EventManage from "../../Runtime/EventManage";
import { loadDir } from "../../Runtime/ResourceManage";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManage";
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8; // 帧率，每秒8帧，代表速度

@ccclass("PlayerManage")
export class PlayerManage extends Component {
  targetY: number = 0;
  targetX: number = 0;

  x: number = 0;
  y: number = 0; // x,y表示当前位置，需要实时移动才能有动画
  private readonly speed: number = 1 / 10; // 每帧移动的距离，表示速度

  async init() {
    await this.render();
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

  move(direct: PLAYER_CTRL_ENUM) {
    if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
      this.targetY++;
    } else if (direct === PLAYER_CTRL_ENUM.TOP) {
      this.targetY--;
    } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
      this.targetX--;
    } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
      this.targetX++;
    }
  }

  async render() {
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    // 为这个node添加一个animation
    const animationComponent = this.addComponent(Animation);

    // 创建一个animationClip，然后绑定到animationComponent上
    const animationClip = new AnimationClip();

    // 创建一个对象轨道
    const track = new animation.ObjectTrack();
    // 指定轨道路径，就是指定哪个对象的哪个属性去做动画
    track.path = new animation.TrackPath()
      .toComponent(Sprite)
      .toProperty("spriteFrame");

    const spriteFrames = await loadDir("texture/player/idle/top");

    // 指定唯一的通道关键帧，指定每帧需要显示什么 spriteFrames
    track.channel.curve.assignSorted(
      spriteFrames.map((item, index) => [index * ANIMATION_SPEED, item])
    );

    // 整个动画剪辑的周期,单位（秒）
    animationClip.duration = spriteFrames.length * ANIMATION_SPEED;
    animationClip.wrapMode = AnimationClip.WrapMode.Loop;
    // 最后将轨道添加到动画剪辑以应用
    animationClip.addTrack(track);

    animationComponent.defaultClip = animationClip;
    animationComponent.play();
  }
}
