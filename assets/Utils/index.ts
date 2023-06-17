/*
 * @Author: Chenxu
 * @Date: 2023-06-17 08:26:59
 * @LastEditTime: 2023-06-17 08:31:12
 * @Msg: Nothing
 */
import { Node, UITransform, Layers } from "cc";

export const createUINode = (name: string = "") => {
  const node = new Node(name);
  const transform = node.addComponent(UITransform);
  transform.setAnchorPoint(0, 1); //设置原点为左上角
  node.layer = 1 << Layers.nameToLayer("UI_2D");
  return node;
};
