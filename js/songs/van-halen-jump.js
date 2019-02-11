import types from '../sound-types';

const jump = [
  [{ type: types.KICK }, { type: types.HIHAT }, { type: types.CYMBAL }], // 0
  [], // 1
  [{ type: types.HIHAT2 }], // 2
  [], // 3
  [{ type: types.SNARE }], //4
  [], // 5
  [{ type: types.HIHAT }], // 6
  [], // 7
  [{ type: types.KICK }], // 8
  [], // 9
  [{ type: types.HIHAT2 }], // 10
  [], // 11
  [{ type: types.SNARE }, { type: types.HIHAT }], // 12
  [], // 13
  [], // 14
  [], // 15
  [{ type: types.KICK }, { type: types.HIHAT2 }], // 16
  [], // 17
  [], // 18
  [], // 19
  [{ type: types.SNARE }, { type: types.HIHAT }], // 20
  [], // 21
  [], // 22
  [], // 23
  [{ type: types.KICK }, { type: types.HIHAT }], // 24
  [], // 25
  [{ type: types.HIHAT }, { type: types.HIHAT2 }, { type: types.CYMBAL }], // 26
  [], // 27
  [{ type: types.SNARE }, { type: types.HIHAT }], // 28
  [], // 29
  [], // 30
  [] // 31
];

export default jump;