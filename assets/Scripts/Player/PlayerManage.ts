/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, EVENT_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import DataManager from "../../Runtime/DataManage";
import EventManage from "../../Runtime/EventManage";
import { TileManage } from "../Tile/TileManage";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass, property } = _decorator;

@ccclass("PlayerManage")
export class PlayerManage extends EntityManager {
  targetY: number = 0;
  targetX: number = 0;

  private readonly speed: number = 1 / 10; // 每帧移动的距离，表示速度

  async init() {
    // 初始化动画状态机
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init(); // 先加载完动画资源

    super.init({
      x: 2,
      y: 8,
      state: ENITIY_STATE_ENUM.IDLE,
      direction: DIRECTION_ENUM.TOP,
      type: ENITIY_TYPE_ENUM.PLAYER
    })

    this.targetX = this.x
    this.targetY = this.y

    EventManage.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this);
  }

  update() {
    this.updateXY();
    super.update()
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

  inputHandle(direct: PLAYER_CTRL_ENUM) {
    if (this.willBlock(direct)) return
    this.move(direct)
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
      this.state = ENITIY_STATE_ENUM.TURNLEFT
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
    } else if (direct === PLAYER_CTRL_ENUM.TURNRIGHT) {
      this.state = ENITIY_STATE_ENUM.TURNRIGHT
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      }
    }
  }

  // 碰撞判断
  willBlock(direct: PLAYER_CTRL_ENUM): boolean {
    const { targetX: x, targetY: y, direction } = this

    // 根据当前方向，找出当前枪的 x,y
    let weaponX = x
    let weaponY = y
    if (direction === DIRECTION_ENUM.TOP) {
      weaponY = y - 1
    } else if (direction === DIRECTION_ENUM.RIGHT) {
      weaponX = x + 1
    } else if (direction === DIRECTION_ENUM.BOTTOM) {
      weaponY = y + 1
    } else if (direction === DIRECTION_ENUM.LEFT) {
      weaponX = x - 1
    }

    if (direct === PLAYER_CTRL_ENUM.TOP) {
      const playerNextTile = DataManager.Instance.tileList[x][y - 1]
      const weaponNextTile = DataManager.Instance.tileList[weaponX][weaponY - 1]
      return this.moveBlock(playerNextTile, weaponNextTile)
    } else if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
      const playerNextTile = DataManager.Instance.tileList[x][y + 1]
      const weaponNextTile = DataManager.Instance.tileList[weaponX][weaponY + 1]
      return this.moveBlock(playerNextTile, weaponNextTile)
    } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
      const playerNextTile = DataManager.Instance.tileList[x + 1][y]
      const weaponNextTile = DataManager.Instance.tileList[weaponX + 1][weaponY]
      return this.moveBlock(playerNextTile, weaponNextTile)
    } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
      const playerNextTile = DataManager.Instance.tileList[x - 1][y]
      const weaponNextTile = DataManager.Instance.tileList[weaponX - 1][weaponY]
      return this.moveBlock(playerNextTile, weaponNextTile)
    } else if (direct === PLAYER_CTRL_ENUM.TURNLEFT) {
      if (direction === DIRECTION_ENUM.TOP) {
        // 判断人物的左和左上
        const leftTile = DataManager.Instance.tileList[x - 1][y]
        const leftTopTile = DataManager.Instance.tileList[x - 1][y - 1]
        if (leftTile.turnable && leftTopTile.turnable) { } else { return true }
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        // 判断人物的上和右上
        const topTile = DataManager.Instance.tileList[x][y - 1]
        const rightTopTile = DataManager.Instance.tileList[x + 1][y - 1]
        if (topTile.turnable && rightTopTile.turnable) { } else { return true }
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        // 判断人物的右和右下
        const rightTile = DataManager.Instance.tileList[x + 1][y]
        const rightBottomTile = DataManager.Instance.tileList[x + 1][y + 1]
        if (rightTile.turnable && rightBottomTile.turnable) { } else { return true }
      } else if (direction === DIRECTION_ENUM.LEFT) {
        // 判断人物的和下左下
        const bottomTile = DataManager.Instance.tileList[x][y + 1]
        const leftBottomTile = DataManager.Instance.tileList[x - 1][y + 1]
        if (bottomTile.turnable && leftBottomTile.turnable) { } else { return true }
      }
    } else if (direct === PLAYER_CTRL_ENUM.TURNRIGHT) {

    }

    return false;
  }

  private moveBlock(playerNextTile: TileManage, weaponNextTile: TileManage) {
    if (playerNextTile && playerNextTile.moveable &&
      weaponNextTile && weaponNextTile.moveable) {
      // empty
    } else {
      return true
    }
  }
}
