/*
 * @Author: Chenxu
 * @Date: 2023-06-18 15:20:57
 * @LastEditTime: 2023-06-18 17:14:01
 * @Msg: https://docs.cocos.com/creator/manual/zh/animation/use-animation-curve.html
 */
import {
  _decorator,
  Component,
  Node,
  AnimationClip,
  animation,
  Sprite,
  UITransform,
  Animation,
  SpriteFrame,
} from "cc";
import { LEVEL_ENUM } from "../../Enum";
import EventManage from "../../Runtime/EventManage";
import { loadDir } from "../../Runtime/ResourceManage";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManage";
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8; // 帧率，每秒8帧，代表速度

@ccclass("PlayerManage")
export class PlayerManage extends Component {
  async init() {
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
