"use strict";

export const requestAccessImpl = just => nothing => () => {
  return navigator.requestMIDIAccess().then(
    (access) => {
      return just(access);
    },
    (reason) => {
      return nothing;
    });
};

export const getOutputImpl = just => nothing => access => id => {
  let result = access.outputs.get(id);
  if (result === undefined) {
    return nothing;
  } else {
    return (just(result));
  }
}

export const outputIDs = access => {
  return (Array.from(access.outputs.keys()));
}

export const outputName = output => {
  return (output.name);
}

export const sendMessage = output => message => () => {
  output.send(message);
}
