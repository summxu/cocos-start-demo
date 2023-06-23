/*
 * @Author: Chenxu
 * @Date: 2023-06-16 21:13:44
 * @LastEditTime: 2023-06-19 22:12:18
 * @Msg: Nothing
 */

/***
 * 地图瓦片枚举
 */
export enum TILE_TYPE_ENUM {
  WALL_ROW = "WALL_ROW",
  WALL_COLUMN = "WALL_COLUMN",
  WALL_LEFT_TOP = "WALL_LEFT_TOP",
  WALL_RIGHT_TOP = "WALL_RIGHT_TOP",
  WALL_LEFT_BOTTOM = "WALL_LEFT_BOTTOM",
  WALL_RIGHT_BOTTOM = "WALL_RIGHT_BOTTOM",
  CLIFF_LEFT = "CLIFF_ROW_START",
  CLIFF_CENTER = "CLIFF_ROW_CENTER",
  CLIFF_RIGHT = "CLIFF_ROW_END",
  FLOOR = "FLOOR",
}

export enum EVENT_ENUM {
  NEXT_LEVEL = "NEXT_LEVEL",
  PLAYER_CTRL = "PLAYER_CTRL",
  MOVE_OVER = "MOVE_OVER",
  PLAYER_FINISH = "PLAYER_FINISH",
}

export enum PLAYER_CTRL_ENUM {
  TOP = "TOP",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  BOTTOM = "BOTTOM",
  TURNLEFT = "TURNLEFT",
  TURNRIGHT = "TURNRIGHT",
}

export enum FSM_PARAMS_TYPE_ENUM {
  TRIGGER = "TRIGGER",
  NUMBER = "NUMBER",
}

export enum PARAM_NAME_ENUM {
  IDLE = "IDLE",
  TURNLEFT = "TURNLEFT",
  TURNRIGHT = "TURNRIGHT",
  DIRECTION = "DIRECTION",
  BLOCKFRONT = "BLOCKFRONT",
  BLOCKBACK = "BLOCKBACK",
  BLOCKLEFT = "BLOCKLEFT",
  BLOCKRIGHT = "BLOCKRIGHT",
  BLOCKTURNLEFT = "BLOCKTURNLEFT",
  BLOCKTURNRIGHT = "BLOCKTURNRIGHT",
  ATTACK = "ATTACK"
}

export enum DIRECTION_ENUM {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT'
}

// ENITIY_STATE_ENUM 表示角色的自身状态，除此之外还有方向状态，和 PARAM_NAME_ENUM 是不一致的
export enum ENITIY_STATE_ENUM {
  IDLE = "IDLE",
  TURNLEFT = "TURNLEFT",
  TURNRIGHT = "TURNRIGHT",
  BLOCKFRONT = "BLOCKFRONT",
  BLOCKBACK = "BLOCKBACK",
  BLOCKLEFT = "BLOCKLEFT",
  BLOCKRIGHT = "BLOCKRIGHT",
  BLOCKTURNLEFT = "BLOCKTURNLEFT",
  BLOCKTURNRIGHT = "BLOCKTURNRIGHT",
  ATTACK = "ATTACK"
}

export enum ENITIY_TYPE_ENUM {
  PLAYER = 'PLAYER',
  ENEMIES = 'ENEMIES'
}

export enum DIRECTION_ORDER_ENUM {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3
}