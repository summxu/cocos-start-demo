/*
 * @Author: Chenxu
 * @Date: 2023-06-19 21:08:00
 * @LastEditTime: 2023-06-19 22:24:36
 * @Msg:
 * 1. 需要知道 animationClip
 * 2. 需要播放动画的能力 animationComponent
 * 3. 这是一个动态动画 state
 */

import { AnimationClip, Sprite, animation } from "cc";
import { loadDir } from "../RunTime/ResourceManage";
import { sortSpriteFrame } from "../Utils";
import { StateMachine } from "./StateMachine";

const ANIMATION_SPEED = 1 / 8; // 帧率，每秒8帧，代表速度

export default class State {
  private animationClip: AnimationClip
  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal
  ) {
    this.init()
  }

  async init() {
    // 创建一个animationClip，然后绑定到animationComponent上
    this.animationClip = new AnimationClip();

    // 创建一个对象轨道
    const track = new animation.ObjectTrack();
    // 指定轨道路径，就是指定哪个对象的哪个属性去做动画
    track.path = new animation.TrackPath()
      .toComponent(Sprite)
      .toProperty("spriteFrame");

    const promise = loadDir(this.path);
    this.fsm.waitingList.push(promise)
    const spriteFrames = await promise
    // 指定唯一的通道关键帧，指定每帧需要显示什么 spriteFrames
    track.channel.curve.assignSorted(
      // loadDir 读取顺序不一致，需要排序
      sortSpriteFrame(spriteFrames).map((item, index) => [index * ANIMATION_SPEED, item])
    );

    // 整个动画剪辑的周期,单位（秒）
    this.animationClip.duration = spriteFrames.length * ANIMATION_SPEED;
    this.animationClip.wrapMode = this.wrapMode;
    this.animationClip.name = this.path
    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track);
  }

  async run() {
    this.fsm.animationComponent.defaultClip = this.animationClip;
    this.fsm.animationComponent.play();
  }
}
