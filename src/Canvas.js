"use strict";


export const context2D = canvasElement => {
  return canvasElement.getContext("2d");
}

export const clearRectImpl = context => x => y => width => height => () => {
  context.clearRect(x, y, width, height);
}

export const setFillStyleImpl = context => colorString => () => {
  context.fillStyle = colorString;
}

export const fillRectImpl = context => x => y => width => height => () => {
  context.fillRect(x, y, width, height);
}

export const beginPath = context => () => {
  context.beginPath();
}

export const moveTo = context => x => y => () => {
  context.moveTo(x, y);
}

export const lineTo = context => x => y => () => {
  context.lineTo(x, y);
}

export const stroke = context => () => {
  context.stroke();
}
