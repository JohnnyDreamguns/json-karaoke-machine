import types from '../data/sound-types';
import notes from '../data/note-frequencies';

const drums = [
    [{ type: types.KICK }], // 0
    [], // 1
    [], // 2
    [], // 3
    [{ type: types.SNARE }], //4
    [], // 5
    [], // 6
    [], // 7
    [{ type: types.KICK }], // 8
    [], // 9
    [], // 10
    [], // 11
    [{ type: types.SNARE }], // 12
    [], // 13
    [], // 14
    [], // 15
    [{ type: types.KICK }], // 16
    [], // 17
    [], // 18
    [], // 19
    [{ type: types.SNARE }], // 20
    [], // 21
    [], // 22
    [], // 23
    [{ type: types.KICK }], // 24
    [], // 25
    [], // 26
    [], // 27
    [{ type: types.SNARE }], // 28
    [], // 29
    [], // 30
    [], // 31
    [{ type: types.KICK }], // 32
    [], // 33
    [], // 34
    [], // 35
    [{ type: types.SNARE }], // 36
    [], // 37
    [], // 38
    [], // 39
    [{ type: types.KICK }], // 40
    [], // 41
    [], // 42
    [], // 43
    [{ type: types.SNARE }], // 44
    [], // 45
    [], // 46
    [], // 47
    [{ type: types.KICK }], // 48
    [], // 49
    [], // 50
    [], // 51
    [{ type: types.SNARE }], // 52
    [], // 53
    [], // 54
    [], // 55
    [{ type: types.KICK }], // 56
    [], // 57
    [], // 58
    [], // 59
    [{ type: types.SNARE }], // 60
    [], // 61
    [], // 62
    [] // 63
  ];

const bass = [
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 0
    [], // 1
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 2
    [], // 3
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], //4
    [], // 5
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 6
    [], // 7
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 8
    [], // 9
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 10
    [], // 11
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 12
    [], // 13
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 14
    [], // 15
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 16
    [], // 17
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 18
    [], // 19
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 20
    [], // 21
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 22
    [], // 23
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 24
    [], // 25
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 26
    [], // 27
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 28
    [], // 29
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 30
    [], // 31
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 32
    [], // 33
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 34
    [], // 35
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 36
    [], // 37
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 38
    [], // 39
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 40
    [], // 41
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 42
    [], // 43
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 44
    [], // 45
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 46
    [], // 47
    [{ note: notes.C, octave: -1, duration: 1 }, { note: notes.C, octave: -2, duration: 1 }], // 48
    [], // 49
    [{ note: notes.F, octave: -1, duration: 1 }, { note: notes.F, octave: -2, duration: 1 }], // 50
    [], // 51
    [{ note: notes.F, octave: -1, duration: 1 }, { note: notes.F, octave: -2, duration: 1 }], // 52
    [], // 53
    [{ note: notes.G, octave: -1, duration: 1 }, { note: notes.G, octave: -2, duration: 1 }], // 54
    [], // 55
    [{ note: notes.G, octave: -1, duration: 1 }, { note: notes.G, octave: -2, duration: 1 }], // 56
    [], // 57
    [{ note: notes.F, octave: -1, duration: 1 }, { note: notes.F, octave: -2, duration: 1 }], // 58
    [], // 59
    [{ note: notes.G, octave: -1, duration: 1 }, { note: notes.G, octave: -2, duration: 1 }], // 60
    [], // 61
    [{ note: notes.F, octave: -1, duration: 1 }, { note: notes.F, octave: -2, duration: 1 }], // 62
    [] // 63
  ];

const polySynth = [
  [], // 0
  [], // 1
  [], // 2
  [], // 3
  [{ note: notes.G, octave: 1, duration: 1 }, { note: notes.B, octave: 1, duration: 1 }, { note: notes.D, octave: 2, duration: 1 }], //4
  [], // 5
  [], // 6
  [], // 7
  [], // 8
  [], // 9
  [{ note: notes.G, octave: 1, duration: 1 }, { note: notes.C, octave: 2, duration: 1 }, { note: notes.E, octave: 2, duration: 1 }], // 10
  [], // 11
  [], // 12
  [], // 13
  [], // 14
  [], // 15
  [{ note: notes.F, octave: 1, duration: 1 }, { note: notes.A, octave: 1, duration: 1 }, { note: notes.C, octave: 2, duration: 1 }], // 16
  [], // 17
  [], // 18
  [], // 19
  [], // 20
  [], // 21
  [{ note: notes.F, octave: 1, duration: 1 }, { note: notes.A, octave: 1, duration: 1 }, { note: notes.C, octave: 2, duration: 1 }], // 22
  [], // 23
  [], // 24
  [], // 25
  [{ note: notes.G, octave: 1, duration: 1 }, { note: notes.B, octave: 1, duration: 1 }, { note: notes.D, octave: 2, duration: 1 }], // 26
  [], // 27
  [], // 28
  [], // 29
  [{ note: notes.G, octave: 1, duration: 2.5 }, { note: notes.B, octave: 1, duration: 2.5 }, { note: notes.D, octave: 2, duration: 2.5 }], // 30
  [], // 31
  [], // 32
  [], // 33
  [], // 34
  [], // 35
  [{ note: notes.G, octave: 1, duration: 1 }, { note: notes.C, octave: 2, duration: 1 }, { note: notes.E, octave: 2, duration: 1 }], // 36
  [], // 37
  [], // 38
  [], // 39
  [], // 40
  [], // 41
  [{ note: notes.F, octave: 1, duration: 1 }, { note: notes.A, octave: 1, duration: 1 }, { note: notes.C, octave: 2, duration: 1 }], // 42
  [], // 43
  [], // 44
  [], // 45
  [{ note: notes.F, octave: 1, duration: 1 }, { note: notes.A, octave: 1, duration: 1 }, { note: notes.C, octave: 2, duration: 1 }], // 46
  [], // 47
  [], // 48
  [], // 49
  [{ note: notes.C, octave: 0, duration: 1 }, { note: notes.F, octave: 1, duration: 1 }, { note: notes.A, octave: 1, duration: 1 }], // 50
  [], // 51
  [], // 52
  [], // 53 
  [{ note: notes.C, octave: 0, duration: 6 }, { note: notes.F, octave: 1, duration: 6 }, { note: notes.G, octave: 1, duration: 6 }], // 54
  [], // 55
  [], // 56
  [], // 57
  [], // 58
  [], // 59
  [], // 60
  [], // 61
  [], // 62
  [] // 63
];

const jump = {
  drums,
  bass,
  polySynth
};

export default jump;