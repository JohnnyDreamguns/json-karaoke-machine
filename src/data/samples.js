import types from '../data/sound-types';
const kick = require('../samples/kick.wav');
const snare = require('../samples/snare.wav');

const samples = {};
samples[types.KICK] = kick;
samples[types.SNARE] = snare;

export default samples;
