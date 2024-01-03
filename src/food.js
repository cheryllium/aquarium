export default class Food {
  constructor (type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.angle = 0;
  }

  update () {
    push();

    translate(this.x, this.y);
    rotate(radians(this.angle));
    imageMode(CENTER); 
    image(foodImages[this.type], 0, 0);
    
    this.angle += 2;
    this.y += 1;

    if (this.y > GAME_HEIGHT) {
      this.remove = true;
    }
    
    pop();
  }
}
