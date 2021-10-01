const synth = window.speechSynthesis;

const speak = (thingToSay) => {
  if (synth) {
    const utterThis = new SpeechSynthesisUtterance(thingToSay);
    synth.speak(utterThis);
  }
};

export default speak;
