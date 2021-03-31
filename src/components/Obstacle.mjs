'use strict'

import { config } from '../config/index.mjs'
import { utils } from '../utils/index.mjs'
import { SCALE_UNIT } from '../constants/index.mjs'

export class Obstacle {
  constructor ({ length, width, ctx, canvas, position, height, color }) {
    this.length = length
    this.width = width
    this.height = height
    this.ctx = ctx
    this.canvas = canvas
    this.position = position
    this.color = [
      150,
      150,
      150
    ]
  }

  getVanishingPoints = ({ perspectiveOrigin: { x, y } }) => {
    return {
      o: { x, y },
      f1: { x: x - config.viewPointHeight, y },
      f2: { x: x + config.viewPointHeight, y },
    }
  }

  getVertex = ({ sectionPosition }) => {
    const { position, width, length, canvas } = this

    return {
      v1: { x: position.x + sectionPosition.x, y: position.y + canvas.height + sectionPosition.y },
      v2: { x: position.x + width + sectionPosition.x, y: position.y + canvas.height + sectionPosition.y },
      v3: { x: position.x + width + sectionPosition.x, y: position.y + canvas.height + length + sectionPosition.y },
      v4: { x: position.x + sectionPosition.x, y: position.y + canvas.height + length + sectionPosition.y },
    }
  }

  getProyectionPoints = ({ sectionPosition }) => {
    return {
      p1: { x: this.position.x + sectionPosition.x, y: this.canvas.height },
      p2: { x: this.position.x + this.width + sectionPosition.x, y: this.canvas.height },
    }
  }

  getIntersectionPoints = (pA1, pA2, pB1, pB2) => {
    return utils.getIntersectionPointsBetween2Lines(pA1, pA2, pB1, pB2)
  }

  getPoints = props => {
    const { v1, v2, v3, v4 } = this.getVertex(props)
    const { f1, f2, o } = this.getVanishingPoints(props)
    const { p1, p2 } = this.getProyectionPoints(props)
    const { sun } = props

    const sunProyection = {
      ...sun.position,
      y: this.canvas.height / 2
    }

    const h1 = { x: p1.x, y: p1.y - this.height }
    const h2 = { x: p2.x, y: p2.y - this.height }

    let i1
    let i2
    let i3
    let i4
    let i5
    let i6
    let i7
    let i8
    let s1
    let s2
    let s3

    if (v1.y >= this.canvas.height) {
      const x1 = { x: 0, y: this.canvas.height }
      const x2 = { x: 1, y: this.canvas.height }

      const a = this.getIntersectionPoints(v1, v3, x1, x2)
      const b = this.getIntersectionPoints(v2, v4, x1, x2)

      i1 = this.getIntersectionPoints(a, f2, p1, o)
      i2 = this.getIntersectionPoints(b, f1, p2, o)
      i3 = this.getIntersectionPoints(a, f2, p2, o)
      i4 = this.getIntersectionPoints(b, f1, p1, o)
      i5 = this.getIntersectionPoints(i1, { x: i1.x, y: 0 }, o, h1)
      i6 = this.getIntersectionPoints(i2, { x: i2.x, y: 0 }, o, h2)
      i7 = this.getIntersectionPoints(i3, { x: i3.x, y: 0 }, o, h2)
      i8 = this.getIntersectionPoints(i4, { x: i4.x, y: 0 }, o, h1)
      s1 = this.getIntersectionPoints(i2, sunProyection, i6, sun.position)
      s2 = this.getIntersectionPoints(i1, sunProyection, i5, sun.position)
      s3 = this.getIntersectionPoints(i4, sunProyection, i8, sun.position)
    } else {
      const tan45 = Math.tan(45 * Math.PI / 180)

      const auxV1 = {
        x: p1.x - ((v1.y - p1.y) / tan45),
        y: this.canvas.height
      }

      const auxV2 = {
        x: p2.x - ((v2.y - p2.y) / tan45),
        y: this.canvas.height,
      }

      const auxV3 = {
        x: p2.x - ((v3.y - p2.y) / tan45),
        y: this.canvas.height
      }

      const auxV4 = {
        x: p1.x - ((v4.y - p1.y) / tan45),
        y: this.canvas.height
      }

      i1 = this.getIntersectionPoints(o, p1, auxV1, f2)
      i2 = this.getIntersectionPoints(o, p2, auxV2, f2)
      i3 = this.getIntersectionPoints(o, p2, auxV3, f2)
      i4 = this.getIntersectionPoints(o, p1, auxV4, f2)
      i5 = this.getIntersectionPoints(i1, { x: i1.x, y: 0 }, o, h1)
      i6 = this.getIntersectionPoints(i2, { x: i2.x, y: 0 }, o, h2)
      i7 = this.getIntersectionPoints(i3, { x: i3.x, y: 0 }, o, h2)
      i8 = this.getIntersectionPoints(i4, { x: i4.x, y: 0 }, o, h1)
    }

    return {
      o,
      i1,
      i2,
      i3,
      i4,
      i5,
      i6,
      i7,
      i8,
      s1,
      s2,
      s3
    }
  }

  renderBaseLine = () => {
    const { i1, i3, i2, i4 } = this.getPoints()

    if (this.position.y > 1) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, i1.y)
      this.ctx.lineTo(this.canvas.width, i1.y)
      this.ctx.closePath()
      this.ctx.strokeStyle = `rgba(50,50,50,${0.25})`
      this.ctx.lineWidth = 1
      this.ctx.stroke()
    }

    if (i1.x > this.canvas.width / 2) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, i4.y)
      this.ctx.lineTo(i4.x, i4.y)
      this.ctx.lineTo(i1.x, i1.y)
      this.ctx.lineTo(0, i1.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgba(50, 50, 50, 1)`
      this.ctx.fill()

      this.ctx.beginPath()
      this.ctx.moveTo(this.canvas.width, i3.y)
      this.ctx.lineTo(i2.x, i3.y)
      this.ctx.lineTo(i2.x, i2.y)
      this.ctx.lineTo(this.canvas.width, i2.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgba(50, 50, 50, 1)`
      this.ctx.fill()
    }

    if (i2.x > this.canvas.width / 2) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, i4.y)
      this.ctx.lineTo(i1.x, i4.y)
      this.ctx.lineTo(i1.x, i1.y)
      this.ctx.lineTo(0, i1.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgba(50, 50, 50, 1)`
      this.ctx.fill()

      this.ctx.beginPath()
      this.ctx.moveTo(this.canvas.width, i3.y)
      this.ctx.lineTo(i3.x, i3.y)
      this.ctx.lineTo(i2.x, i2.y)
      this.ctx.lineTo(this.canvas.width, i2.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgba(50, 50, 50, 1)`
      this.ctx.fill()
    }
  }

  renderShadow = ({ o, i1, i2, i3, i4, i5, i8, i6, i7, s1, s2, s3 }) => {
    if (s1 && s2 && s3) {
      this.ctx.beginPath()
      this.ctx.moveTo(i1.x, i1.y)

      this.ctx.lineTo(i2.x, i2.y)
      this.ctx.lineTo(s1.x, s1.y)
      this.ctx.lineTo(s2.x, s2.y)
      this.ctx.lineTo(s3.x, s3.y)
      this.ctx.lineTo(i4.x, i4.y)
      this.ctx.lineTo(i1.x, i1.y)

      this.ctx.closePath()

      this.ctx.fillStyle = `rgb(0, 0, 0, 0.1)`
      this.ctx.fill()
    }
  }

  renderFaces = ({ o, i1, i2, i3, i4, i5, i8, i6, i7, s1, s2, s3 }) => {
    this.ctx.beginPath()
    this.ctx.moveTo(i1.x, i1.y)
    this.ctx.lineTo(i2.x, i2.y)
    this.ctx.lineTo(i2.x, i2.y)
    this.ctx.lineTo(i6.x, i6.y)
    this.ctx.lineTo(i5.x, i5.y)
    this.ctx.lineTo(i1.x, i1.y)
    this.ctx.closePath()
    this.ctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]},${1})`
    this.ctx.fill()
    this.ctx.strokeStyle = `rgb(80,80,80,${1})`
    this.ctx.lineWidth = 1
    this.ctx.stroke()

    if (i5.y > this.canvas.height / 2) {
      this.ctx.beginPath()
      this.ctx.moveTo(i5.x, i5.y)
      this.ctx.lineTo(i6.x, i6.y)
      this.ctx.lineTo(i7.x, i7.y)
      this.ctx.lineTo(i8.x, i8.y)
      this.ctx.lineTo(i5.x, i5.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgb(${this.color[0] + 50},${this.color[1] + 50},${this.color[2] + 50},${1})`
      this.ctx.fill()
      this.ctx.strokeStyle = `rgb(80,80,80,${1})`
      this.ctx.lineWidth = 1
      this.ctx.stroke()
    }

    if (i1.x > this.canvas.width / 2) {
      this.ctx.beginPath()
      this.ctx.moveTo(i1.x, i1.y)
      this.ctx.lineTo(i4.x, i4.y)
      this.ctx.lineTo(i8.x, i8.y)
      this.ctx.lineTo(i5.x, i5.y)
      this.ctx.lineTo(i1.x, i1.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgb(${this.color[0] + 50},${this.color[1] + 50},${this.color[2] + 50},${1})`
      this.ctx.fill()
      this.ctx.strokeStyle = `rgb(80,80,80,${1})`
      this.ctx.lineWidth = 1
      this.ctx.stroke()
    }

    if (i2.x < this.canvas.width / 2) {
      this.ctx.beginPath()
      this.ctx.moveTo(i2.x, i2.y)
      this.ctx.lineTo(i3.x, i3.y)
      this.ctx.lineTo(i7.x, i7.y)
      this.ctx.lineTo(i6.x, i6.y)
      this.ctx.lineTo(i2.x, i2.y)
      this.ctx.closePath()
      this.ctx.fillStyle = `rgb(${this.color[0] + 100},${this.color[1] + 100},${this.color[2] + 100},${1})`
      this.ctx.fill()
      this.ctx.strokeStyle = `rgb(80,80,80,${1})`
      this.ctx.lineWidth = 1
      this.ctx.stroke()
    }
  }

  render = props => {
    const points = this.getPoints(props)

    // this.renderBaseLine(points)
    // this.renderShadow(points)
    this.renderFaces(points)
  }
}