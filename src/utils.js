function distance(x1, y1, x2, y2) {
  return Math.sqrt(
    (x2 - x1) * (x2 - x1) +
      (y2 - y1) * (y2 - y1)
  );
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

