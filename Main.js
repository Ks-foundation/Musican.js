class SoundLibrary {
  constructor(soundFilePath) {
    this.soundFilePath = soundFilePath;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.notes = {};
    this.loadBaseSound();
  }

  loadBaseSound() {
    const request = new XMLHttpRequest();
    request.open('GET', this.soundFilePath, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      this.context.decodeAudioData(request.response, (buffer) => {
        this.baseBuffer = buffer;
        this.generateNotes();
      });
    };

    request.send();
  }

  generateNotes() {
    const frequencies = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88
    };

    for (const [note, frequency] of Object.entries(frequencies)) {
      this.generateNoteBuffer(note, frequency);
    }
  }

  generateNoteBuffer(note, frequency) {
    const source = this.context.createBufferSource();
    source.buffer = this.baseBuffer;

    const playbackRate = frequency / 440; // Adjust playback rate based on frequency
    source.playbackRate.value = playbackRate;

    source.connect(this.context.destination);
    this.notes[note] = source;
  }

  playNoteByName(noteName) {
    const note = this.notes[noteName];
    if (!note) {
      throw new Error('Invalid note name');
    }

    note.start();
  }
}
