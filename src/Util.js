"use strict";

export function offsetX(event) {
  return event.offsetX;
}

export function offsetY(event) {
  return event.offsetY;
}

export const requestFullscreenImpl = elem => () => {
  elem.requestFullscreen().then(
    (access) => {
      return true;
    },
    (reason) => {
      return false;
    }
  );
}
