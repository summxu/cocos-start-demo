/*
* @Author: Chenxu
* @Date: 2023-06-20 14:58:23
* @Last Modified time: 2023-06-20 14:58:23
*/

import { Sorting, _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENITIY_STATE_ENUM, ENITIY_TYPE_ENUM, EVENT_ENUM, PLAYER_CTRL_ENUM } from "../../Enum";
import DataManager from "../../Runtime/DataManage";
import EventManage from "../../Runtime/EventManage";
import { TileManage } from "../Tile/TileManage";
import { ControllerManage } from "../UI/ControllerManage";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass, property } = _decorator;

@ccclass("PlayerManage")
export class PlayerManage extends EntityManager {
  targetY: number = 0;
  targetX: number = 0;
  private isMoveing: boolean = false
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
    EventManage.Instance.on(EVENT_ENUM.ENEMIES_ATTACK, this.deathHandle, this);
  }

  onDestroy() {
    EventManage.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle);
    EventManage.Instance.off(EVENT_ENUM.ENEMIES_ATTACK, this.deathHandle);
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
      Math.abs(this.targetX - this.x) < 0.1 &&
      this.isMoveing
    ) {
      this.isMoveing = false
      // 相等既停止移动，不会走任何判断
      this.x = this.targetX;
      this.y = this.targetY;

      // 停止移动之后，发送移动完成事件,isMoveing 保证只触发一次
      EventManage.Instance.emit(EVENT_ENUM.MOVE_OVER)
    }
  }

  deathHandle(type: ENITIY_STATE_ENUM.DEATH | ENITIY_STATE_ENUM.AIRDEATH) {
    this.state = type
  }

  inputHandle(direct: PLAYER_CTRL_ENUM) {
    if (this.isMoveing) return
    // 死亡,攻击的时候不能移动
    if (
      this.state === ENITIY_STATE_ENUM.DEATH ||
      this.state === ENITIY_STATE_ENUM.AIRDEATH ||
      this.state === ENITIY_STATE_ENUM.ATTACK
    ) {
      return
    }
    if (this.willBlock(direct)) return
    // 判断前方是否有怪物
    const enemiesId = this.hasEnemies(direct)
    if (enemiesId) {
      EventManage.Instance.emit(EVENT_ENUM.PLAYER_ATTACK, enemiesId)
      this.state = ENITIY_STATE_ENUM.ATTACK
      return
    }
    this.move(direct)
  }

  // 按钮Click实际走的方法
  move(direct: PLAYER_CTRL_ENUM) {
    if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
      this.isMoveing = true
      this.targetY++;
    } else if (direct === PLAYER_CTRL_ENUM.TOP) {
      this.isMoveing = true
      this.targetY--;
    } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
      this.isMoveing = true
      this.targetX--;
    } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
      this.isMoveing = true
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
      EventManage.Instance.emit(EVENT_ENUM.MOVE_OVER)
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
      EventManage.Instance.emit(EVENT_ENUM.MOVE_OVER)
    }
  }

  hasEnemies(direct: PLAYER_CTRL_ENUM): string {
    // 找到没死的敌人
    const enemies = DataManager.Instance.enemies
      .filter(item => item.state !== ENITIY_STATE_ENUM.DEATH)

    for (let index = 0; index < enemies.length; index++) {
      const element = enemies[index];
      // 判断前方是否有敌人，并且是存活者的
      if (direct === this.direction as unknown as PLAYER_CTRL_ENUM) {
        if (direct === PLAYER_CTRL_ENUM.TOP) {
          const next2Y = this.targetY - 2
          if (element.x === this.targetX && element.y === next2Y) {
            return element.id
          }
        }
        if (direct === PLAYER_CTRL_ENUM.RIGHT) {
          const next2X = this.targetX + 2
          if (element.x === next2X && element.y === this.targetY) {
            return element.id
          }
        }
        if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
          const next2Y = this.targetY + 2
          if (element.x === this.targetX && element.y === next2Y) {
            return element.id
          }
        }
        if (direct === PLAYER_CTRL_ENUM.LEFT) {
          const next2X = this.targetX - 2
          if (element.x === next2X && element.y === this.targetY) {
            return element.id
          }
        }
      }
    }
    return ''
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
      return this.moveBlock(playerNextTile, weaponNextTile, direct)
    } else if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
      const playerNextTile = DataManager.Instance.tileList[x][y + 1]
      const weaponNextTile = DataManager.Instance.tileList[weaponX][weaponY + 1]
      return this.moveBlock(playerNextTile, weaponNextTile, direct)
    } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
      const playerNextTile = DataManager.Instance.tileList[x + 1][y]
      const weaponNextTile = DataManager.Instance.tileList[weaponX + 1][weaponY]
      return this.moveBlock(playerNextTile, weaponNextTile, direct)
    } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
      const playerNextTile = DataManager.Instance.tileList[x - 1][y]
      const weaponNextTile = DataManager.Instance.tileList[weaponX - 1][weaponY]
      return this.moveBlock(playerNextTile, weaponNextTile, direct)
    } else if (direct === PLAYER_CTRL_ENUM.TURNLEFT) {
      if (direction === DIRECTION_ENUM.TOP) {
        // 判断人物的左和左上
        const leftTile = DataManager.Instance.tileList[x - 1][y]
        const leftTopTile = DataManager.Instance.tileList[x - 1][y - 1]
        if (leftTile.turnable && leftTopTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNLEFT
          return true
        }
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        // 判断人物的上和右上
        const topTile = DataManager.Instance.tileList[x][y - 1]
        const rightTopTile = DataManager.Instance.tileList[x + 1][y - 1]
        if (topTile.turnable && rightTopTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNLEFT
          return true
        }
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        // 判断人物的右和右下
        const rightTile = DataManager.Instance.tileList[x + 1][y]
        const rightBottomTile = DataManager.Instance.tileList[x + 1][y + 1]
        if (rightTile.turnable && rightBottomTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNLEFT
          return true
        }
      } else if (direction === DIRECTION_ENUM.LEFT) {
        // 判断人物的和下左下
        const bottomTile = DataManager.Instance.tileList[x][y + 1]
        const leftBottomTile = DataManager.Instance.tileList[x - 1][y + 1]
        if (bottomTile.turnable && leftBottomTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNLEFT
          return true
        }
      }
    } else if (direct === PLAYER_CTRL_ENUM.TURNRIGHT) {
      if (direction === DIRECTION_ENUM.TOP) {
        // 判断人物的右和右上
        const rightTile = DataManager.Instance.tileList[x + 1][y]
        const rightTopTile = DataManager.Instance.tileList[x + 1][y - 1]
        if (rightTile.turnable && rightTopTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNRIGHT
          return true
        }
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        // 判断人物的下和右下
        const bottomTile = DataManager.Instance.tileList[x][y + 1]
        const rightBottomTile = DataManager.Instance.tileList[x + 1][y + 1]
        if (bottomTile.turnable && rightBottomTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNRIGHT
          return true
        }
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        // 判断人物的左和左下
        const leftTile = DataManager.Instance.tileList[x - 1][y]
        const leftBottomTile = DataManager.Instance.tileList[x - 1][y + 1]
        if (leftTile.turnable && leftBottomTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNRIGHT
          return true
        }
      } else if (direction === DIRECTION_ENUM.LEFT) {
        // 判断人物的和上左上
        const leftTopTile = DataManager.Instance.tileList[x - 1][y - 1]
        const topTile = DataManager.Instance.tileList[x][y - 1]
        if (leftTopTile.turnable && topTile.turnable) { } else {
          this.state = ENITIY_STATE_ENUM.BLOCKTURNRIGHT
          return true
        }
      }
    }

    return false;
  }

  private moveBlock(playerNextTile: TileManage, weaponNextTile: TileManage, direct: PLAYER_CTRL_ENUM) {
    const { direction } = this
    if (playerNextTile && playerNextTile.moveable &&
      weaponNextTile && weaponNextTile.moveable) {
      // empty
    } else {
      // 按钮方向下，还需分别判断玩家方向
      if (direct === PLAYER_CTRL_ENUM.TOP) {
        if (direction === DIRECTION_ENUM.TOP) {
          this.state = ENITIY_STATE_ENUM.BLOCKFRONT
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          this.state = ENITIY_STATE_ENUM.BLOCKLEFT
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          this.state = ENITIY_STATE_ENUM.BLOCKBACK
        } else if (direction === DIRECTION_ENUM.LEFT) {
          this.state = ENITIY_STATE_ENUM.BLOCKRIGHT
        }
      } else if (direct === PLAYER_CTRL_ENUM.RIGHT) {
        if (direction === DIRECTION_ENUM.TOP) {
          this.state = ENITIY_STATE_ENUM.BLOCKRIGHT
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          this.state = ENITIY_STATE_ENUM.BLOCKFRONT
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          this.state = ENITIY_STATE_ENUM.BLOCKLEFT
        } else if (direction === DIRECTION_ENUM.LEFT) {
          this.state = ENITIY_STATE_ENUM.BLOCKBACK
        }
      } else if (direct === PLAYER_CTRL_ENUM.LEFT) {
        if (direction === DIRECTION_ENUM.TOP) {
          this.state = ENITIY_STATE_ENUM.BLOCKLEFT
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          this.state = ENITIY_STATE_ENUM.BLOCKBACK
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          this.state = ENITIY_STATE_ENUM.BLOCKRIGHT
        } else if (direction === DIRECTION_ENUM.LEFT) {
          this.state = ENITIY_STATE_ENUM.BLOCKFRONT
        }
      } else if (direct === PLAYER_CTRL_ENUM.BOTTOM) {
        if (direction === DIRECTION_ENUM.TOP) {
          this.state = ENITIY_STATE_ENUM.BLOCKBACK
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          this.state = ENITIY_STATE_ENUM.BLOCKRIGHT
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          this.state = ENITIY_STATE_ENUM.BLOCKFRONT
        } else if (direction === DIRECTION_ENUM.LEFT) {
          this.state = ENITIY_STATE_ENUM.BLOCKLEFT
        }
      }
      return true
    }
  }
}
