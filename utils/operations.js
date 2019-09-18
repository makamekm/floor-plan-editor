/** Determines the distance of a point from a line.
 * @param x Point's x coordinate.
 * @param y Point's y coordinate.
 * @param x1 Line-Point 1's x coordinate.
 * @param y1 Line-Point 1's y coordinate.
 * @param x2 Line-Point 2's x coordinate.
 * @param y2 Line-Point 2's y coordinate.
 * @returns The distance.
 */
export function pointDistanceFromLine(x, y, x1, y1, x2, y2) {
  const tPoint = closestPointOnLine(x, y, x1, y1, x2, y2);
  const tDx = x - tPoint.x;
  const tDy = y - tPoint.y;
  return Math.sqrt(tDx * tDx + tDy * tDy);
}

/** Gets the projection of a point onto a line.
 * @param x Point's x coordinate.
 * @param y Point's y coordinate.
 * @param x1 Line-Point 1's x coordinate.
 * @param y1 Line-Point 1's y coordinate.
 * @param x2 Line-Point 2's x coordinate.
 * @param y2 Line-Point 2's y coordinate.
 * @returns The point.
 */
export function closestPointOnLine(x, y, x1, y1, x2, y2) {
  // Inspired by: http://stackoverflow.com/a/6853926
  const tA = x - x1;
  const tB = y - y1;
  const tC = x2 - x1;
  const tD = y2 - y1;

  const tDot = tA * tC + tB * tD;
  const tLenSq = tC * tC + tD * tD;
  const tParam = tDot / tLenSq;

  let tXx, tYy;

  if (tParam < 0 || (x1 == x2 && y1 == y2)) {
    tXx = x1;
    tYy = y1;
  }
  else if (tParam > 1) {
    tXx = x2;
    tYy = y2;
  }
  else {
    tXx = x1 + tParam * tC;
    tYy = y1 + tParam * tD;
  }

  return {
    x: tXx,
    y: tYy
  }
}

/** Gets the distance of two points.
 * @param x1 X part of first point.
 * @param y1 Y part of first point.
 * @param x2 X part of second point.
 * @param y2 Y part of second point.
 * @returns The distance.
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt(
    Math.pow(x2 - x1, 2)
    + Math.pow(y2 - y1, 2)
  );
}

/**  Gets the angle between 0,0 -> x1,y1 and 0,0 -> x2,y2 (-pi to pi)
 * @returns The angle.
 */
export function angle(x1, y1, x2, y2) {
  const tDot = x1 * x2 + y1 * y2;
  const tDet = x1 * y2 - y1 * x2;
  const tAngle = -Math.atan2(tDet, tDot);
  return tAngle;
}

/** shifts angle to be 0 to 2pi */
export function angle2pi(x1, y1, x2, y2) {
  let tTheta = angle(x1, y1, x2, y2);
  if (tTheta < 0) {
    tTheta += 2 * Math.PI;
  }
  return tTheta;
}

/** Checks if an array of points is clockwise.
 * @param points Is array of points with x,y attributes
 * @returns True if clockwise.
 */
export function isClockwise(points) {
  // make positive
  let tSubX = Math.min(0, Math.min.apply(null, map(points, function (p) {
    return p.x;
  })))
  let tSubY = Math.min(0, Math.min.apply(null, map(points, function (p) {
    return p.x;
  })))

  const tNewPoints = map(points, (p) => {
    return {
      x: p.x - tSubX,
      y: p.y - tSubY
    }
  })

  // determine CW/CCW, based on:
  // http://stackoverflow.com/questions/1165647
  let tSum = 0;
  for (let tI = 0; tI < tNewPoints.length; tI++) {
    const tC1 = tNewPoints[tI];
    let tC2;
    if (tI == tNewPoints.length - 1) {
      tC2 = tNewPoints[0];
    }
    else {
      tC2 = tNewPoints[tI + 1];
    }
    tSum += (tC2.x - tC1.x) * (tC2.y + tC1.y);
  }
  return (tSum >= 0);
}

/** Creates a Guid.
 * @returns A new Guid.
 */
export function guid() {
  const tS4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

  return tS4() + tS4() + '-' + tS4() + '-' + tS4() + '-' +
    tS4() + '-' + tS4() + tS4() + tS4();
}

/** both arguments are arrays of corners with x,y attributes */
export function polygonPolygonIntersect(firstCorners, secondCorners) {
  for (let tI = 0; tI < firstCorners.length; tI++) {
    const tFirstCorner = firstCorners[tI],
      tSecondCorner;

    if (tI == firstCorners.length - 1) {
      tSecondCorner = firstCorners[0];
    } else {
      tSecondCorner = firstCorners[tI + 1];
    }

    if (linePolygonIntersect(
      tFirstCorner.x, tFirstCorner.y,
      tSecondCorner.x, tSecondCorner.y,
      secondCorners)) {
      return true;
    }
  }
  return false;
}

/** Corners is an array of points with x,y attributes */
export function linePolygonIntersect(x1, y1, x2, y2, corners) {
  for (let tI = 0; tI < corners.length; tI++) {
    const tFirstCorner = corners[tI],
      tSecondCorner;
    if (tI == corners.length - 1) {
      tSecondCorner = corners[0];
    }
    else {
      tSecondCorner = corners[tI + 1];
    }

    if (lineLineIntersect(x1, y1, x2, y2,
      tFirstCorner.x, tFirstCorner.y,
      tSecondCorner.x, tSecondCorner.y)) {
      return true;
    }
  }
  return false;
}

/** */
export function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const tCCW = (p1, p2, p3) => {
    const tA = p1.x,
      tB = p1.y,
      tC = p2.x,
      tD = p2.y,
      tE = p3.x,
      tF = p3.y;
    return (tF - tB) * (tC - tA) > (tD - tB) * (tE - tA);
  }

  const tP1 = { x: x1, y: y1 },
    tP2 = { x: x2, y: y2 },
    tP3 = { x: x3, y: y3 },
    tP4 = { x: x4, y: y4 };
  return (tCCW(tP1, tP3, tP4) != tCCW(tP2, tP3, tP4)) && (tCCW(tP1, tP2, tP3) != tCCW(tP1, tP2, tP4));
}

/**
  @param corners Is an array of points with x,y attributes
  @param startX X start coord for raycast
  @param startY Y start coord for raycast
*/
export function pointInPolygon(x, y, corners, startX, startY) {
  startX = startX || 0;
  startY = startY || 0;

  //ensure that point(startX, startY) is outside the polygon consists of corners
  let tMinX = 0,
    tMinY = 0;

  if (startX === undefined || startY === undefined) {
    for (let tI = 0; tI < corners.length; tI++) {
      tMinX = Math.min(tMinX, corners[tI].x);
      tMinY = Math.min(tMinX, corners[tI].y);
    }
    startX = tMinX - 10;
    startY = tMinY - 10;
  }

  let tIntersects = 0;
  for (let tI = 0; tI < corners.length; tI++) {
    const tFirstCorner = corners[tI],
      tSecondCorner;
    if (tI == corners.length - 1) {
      tSecondCorner = corners[0];
    }
    else {
      tSecondCorner = corners[tI + 1];
    }

    if (lineLineIntersect(startX, startY, x, y,
      tFirstCorner.x, tFirstCorner.y,
      tSecondCorner.x, tSecondCorner.y)) {
      tIntersects++;
    }
  }
  // odd intersections means the point is in the polygon
  return ((tIntersects % 2) == 1);
}

/** Checks if all corners of insideCorners are inside the polygon described by outsideCorners */
export function polygonInsidePolygon(insideCorners, outsideCorners, startX, startY) {
  startX = startX || 0;
  startY = startY || 0;

  for (let tI = 0; tI < insideCorners.length; tI++) {
    if (!pointInPolygon(
      insideCorners[tI].x, insideCorners[tI].y,
      outsideCorners,
      startX, startY)) {
      return false;
    }
  }
  return true;
}

/** Checks if any corners of firstCorners is inside the polygon described by secondCorners */
export function polygonOutsidePolygon(insideCorners, outsideCorners, startX, startY) {
  startX = startX || 0;
  startY = startY || 0;

  for (let tI = 0; tI < insideCorners.length; tI++) {
    if (pointInPolygon(
      insideCorners[tI].x, insideCorners[tI].y,
      outsideCorners,
      startX,
      startY,
    )) {
      return false;
    }
  }
  return true;
}

// arrays

export function forEach(array, action) {
  for (let tI = 0; tI < array.length; tI++) {
    action(array[tI]);
  }
}

export function forEachIndexed(array, action) {
  for (let tI = 0; tI < array.length; tI++) {
    action(tI, array[tI]);
  }
}

export function map(array, func) {
  const tResult = [];
  array.forEach(element => {
    tResult.push(func(element));
  });
  return tResult;
}

/** Remove elements in array if func(element) returns true */
export function removeIf(array, func) {
  const tResult = [];
  array.forEach((element) => {
    if (!func(element)) {
      tResult.push(element);
    }
  });
  return tResult;
}

/** Shift the items in an array by shift (positive integer) */
export function cycle(arr, shift) {
  const tReturn = arr.slice(0);
  for (let tI = 0; tI < shift; tI++) {
    const tmp = tReturn.shift();
    tReturn.push(tmp);
  }
  return tReturn;
}

/** Returns in the unique elemnts in arr */
export function unique(arr, hashFunc) {
  const tResults = [];
  const tMap = {};
  for (let tI = 0; tI < arr.length; tI++) {
    if (!tMap.hasOwnProperty(arr[tI])) {
      tResults.push(arr[tI]);
      tMap[hashFunc(arr[tI])] = true;
    }
  }
  return tResults;
}

/** Remove value from array, if it is present */
export function removeValue(array, value) {
  for (let tI = array.length - 1; tI >= 0; tI--) {
    if (array[tI] === value) {
      array.splice(tI, 1);
    }
  }
}

/** Checks if value is in array */
export const hasValue = (array, value) => {
  for (let tI = 0; tI < array.length; tI++) {
    if (array[tI] === value) {
      return true;
    }
  }
  return false;
}

/** Subtracts the elements in subArray from array */
export function subtract(array, subArray) {
  return removeIf(array, (el) => {
    return hasValue(subArray, el);
  });
}
