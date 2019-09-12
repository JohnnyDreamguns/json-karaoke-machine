const kick = require('../samples/kick.wav');
const snare = require('../samples/snare.wav');
import types from '../data/sound-types';

const samples = {};
samples[types.KICK] = kick;
samples[types.SNARE] = snare;

export default samples;
