/*
 * @Author: Chenxu
 * @Date: 2023-06-17 08:26:59
 * @LastEditTime: 2023-06-18 17:19:18
 * @Msg: Nothing
 */
import { Node, UITransform, Layers, Vec2, SpriteFrame } from "cc";

export const createUINode = (name: string = "") => {
  const node = new Node(name);
  node.layer = 1 << Layers.nameToLayer("UI_2D");
  const transform = node.addComponent(UITransform);
  transform.setAnchorPoint(0, 1);
  return node;
};

export const randomByRange = (start: number, end: number) => {
  return Math.floor(start + (end - start) * Math.random());
}

const getNumberWithinString = (str: string) => {
  const reg = /\((\d+)\)/
  return parseInt(str.match(reg)[1] || '0')
}

export const sortSpriteFrame = (list: SpriteFrame[]) => {
  return list.sort((a, b) => {
    return getNumberWithinString(a.name) - getNumberWithinString(b.name)
  })
}