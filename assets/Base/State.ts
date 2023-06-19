/*
 * @Author: Chenxu
 * @Date: 2023-06-19 21:08:00
 * @LastEditTime: 2023-06-19 22:24:36
 * @Msg:
 * 1. 需要知道animationClip
 * 2. 需要播放动画的能力 animationComponent
 */

import { AnimationClip } from "cc";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";

export default class State {
  constructor(
    private fsm: PlayerStateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal
  ) {}
}
