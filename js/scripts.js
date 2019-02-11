import { init, play } from './music-machine';
import jump from './songs/van-halen-jump';

let songData = jump;

// Load Song
window.addEventListener("load", () => { init(songData); });

// Toggle Play button
const playAnchor = document.querySelector(".play");
playAnchor.addEventListener("click", play);

//              _,.,
//            ,'   ,'
//           /   ,'
//           '.__|
//            |  |
//            |__|
//            |  |
//            |__|
//            |  |
//            |--|
//            |__|
//            |__|        ,-.
//            |__|'     ,'  /
//       _,.-'     ',_,' o /
//      /     8888        /
//      |                /
//       1              /
//      `L   8888     /
//        |           /
//       /    ====    \
//      /     ____     \
//     /     (____)  o  \
//    /             o    \
//   /             o     ,'
//  /               _,.'^
// /        __,.-"~^
//',,..--~~^       