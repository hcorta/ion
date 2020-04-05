'use strict'

import { SCALE_UNIT } from '../constants/index.mjs'
import { config } from '../config/index.mjs'

function getIntersectionPointsBetween2Lines (pA1, pA2, pB1, pB2) {
  if ((pA1.x === pA2.x && pA1.y === pA2.y) || (pB1.x === pB2.x && pB1.y === pB2.y)) {
    return false
  }

  const denominator = ((pB2.y - pB1.y) * (pA2.x - pA1.x) - (pB2.x - pB1.x) * (pA2.y - pA1.y))

  let ua = ((pB2.x - pB1.x) * (pA1.y - pB1.y) - (pB2.y - pB1.y) * (pA1.x - pB1.x)) / denominator

  return {
    x: pA1.x + ua * (pA2.x - pA1.x),
    y: pA1.y + ua * (pA2.y - pA1.y)
  }
}

function generateObstacle ({ u, color }) {
  const width = u * SCALE_UNIT
  const height = u * 50 * SCALE_UNIT * Math.random()
  const length = u * SCALE_UNIT * Math.random()
  const oX = Math.random() * u * 100 * SCALE_UNIT * (Math.round(Math.random()) * 2 - 1)

  return {
    width,
    height,
    length,
    color: [color, color, color],
    speed: u * 50,
    position: {
      x: oX,
      y: 250 * u * SCALE_UNIT
    },
  }
}

function generateCloud () {
  const oX = Math.random() * 5000 * SCALE_UNIT * (Math.round(Math.random()) * 2 - 1)
  const width = 2000 * SCALE_UNIT * Math.random()
  const height = 200 * SCALE_UNIT * Math.random()
  const length = 5000 * SCALE_UNIT * Math.random()
  const elevation = 5000 * SCALE_UNIT * Math.random()

  return {
    d: {
      x: oX,
      y: 100000 * SCALE_UNIT
    },
    limit: config.itemsLimit,
    interval: 1000,
    width,
    height,
    length,
    elevation
  }
}

function generateWorld () {
  const u = Math.random() * 50
  const color = Math.floor(Math.random() * 255) + 1

  return {
    obstacle: {
      limit: config.itemsLimit,
      interval: 50,
      color,
      u,
    },
    cloud: generateCloud()
  }
}

export const utils = {
  getIntersectionPointsBetween2Lines,
  generateCloud,
  generateObstacle,
  generateWorld,
}