import React, { useState } from 'react';
import Modal from 'react-modal';

//Modal.setAppElement('#root');

const NoSoundModal = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button
        id="btn-no-sound"
        className="btn-no-sound"
        onClick={() => setVisible(true)}
      >
        No Sound?
      </button>
      <Modal
        isOpen={visible}
        contentLabel="Example Modal"
        className="no-sound-modal"
      >
        <h2>Hello</h2>
        <button id="btn-close" onClick={() => setVisible(false)}>
          X
        </button>
        <p>
          If you can't hear anything when it looks like it should be playing
          then please check that your volume is up.
        </p>

        <p>
          If using a mobile please ensure that the silent / mute switch is off.
        </p>
        <p>
          If you still can't hear anything please raise an issue on the{' '}
          <a href="https://github.com/JohnnyDreamguns/json-karaoke-machine">
            GitHub page
          </a>
          , including your OS, browser and version.
        </p>
        <p>Thanks!</p>
      </Modal>
      <input
        type="hidden"
        id="isVisible"
        value={visible ? 'visible' : 'hidden'}
      ></input>
    </div>
  );
};

export default NoSoundModal;
