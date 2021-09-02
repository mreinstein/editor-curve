class CodeExample {
  constructor(cvs) {
    this.cvs = cvs;
    //cvs.width = 200;
    //cvs.height = 200;
    this.ctx = cvs.getContext('2d');
  }


  reset(curve, evt) {
    //this.cvs.width = this.cvs.width;
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "none";
    if (evt && curve) {
      curve.mouse = { x: evt.offsetX, y: evt.offsetY };
    }
    this.randomIndex = 0;
  }

  setColor(c) {
    this.ctx.strokeStyle = c;
  }

  drawSkeleton(curve, offset, nocoords) {
    offset = offset || { x: 0, y: 0 };
    var pts = curve.points;
    this.ctx.strokeStyle = "lightgrey";
    this.drawLine(pts[0], pts[1], offset);
    if (pts.length === 3) {
      this.drawLine(pts[1], pts[2], offset);
    } else {
      this.drawLine(pts[2], pts[3], offset);
    }
    this.ctx.strokeStyle = "black";
    if (!nocoords)
      this.drawPoints(pts, offset);
  }

  drawCurve(curve, offset) {
    const ctx = this.ctx;
    offset = offset || { x: 0, y: 0 };
    var ox = offset.x;
    var oy = offset.y;
    ctx.beginPath();
    var p = curve.points,
      i;
    ctx.moveTo(p[0].x + ox, p[0].y + oy);
    if (p.length === 3) {
      ctx.quadraticCurveTo(p[1].x + ox, p[1].y + oy, p[2].x + ox, p[2].y + oy);
    }
    if (p.length === 4) {
      ctx.bezierCurveTo(
        p[1].x + ox,
        p[1].y + oy,
        p[2].x + ox,
        p[2].y + oy,
        p[3].x + ox,
        p[3].y + oy
      );
    }
    ctx.stroke();
    ctx.closePath();
  }

  drawLine(p1, p2, offset) {
    const ctx = this.ctx;
    offset = offset || { x: 0, y: 0 };
    var ox = offset.x;
    var oy = offset.y;
    ctx.beginPath();
    ctx.moveTo(p1.x + ox, p1.y + oy);
    ctx.lineTo(p2.x + ox, p2.y + oy);
    ctx.stroke();
  }


  drawPoints(points, offset) {
    offset = offset || { x: 0, y: 0 };
    points.forEach(p => this.drawCircle(p, 3, offset));
  }


  drawCircle(p, r, offset) {
    const ctx = this.ctx;
    offset = offset || { x: 0, y: 0 };
    var ox = offset.x;
    var oy = offset.y;
    ctx.beginPath();
    ctx.arc(p.x + ox, p.y + oy, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
}

export { CodeExample }
