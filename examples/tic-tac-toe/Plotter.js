class Plotter{
    constructor(_robot){
        this.robot = _robot;
        this.connected = false;
        this.skipped = false;
        this.minVal = 0;
        this.maxVal = 50;
        this.space = this.maxVal/3;
    }

    isStandingBy(){
        return (!this.connected && !this.skipped);
    }

    connect(){
        this.robot.connect().then(() => {
            this.connected = true;
            this.drawBoard();
        });
    }

    drawBoard(){
        // Draws the tic-tac-toe grid on the AxiDraw.
        this.robot.penUp();
        this.robot.moveTo(this.minVal, this.minVal); // Move to top-left corner.
        this.robot.penDown();
        this.robot.moveTo(this.maxVal, this.minVal); // Draw the top horizontal border.
        this.robot.moveTo(this.maxVal, this.maxVal); // Draw the right vertical border.
        this.robot.moveTo(this.minVal, this.maxVal); // Draw the bottom horizontal border.
        this.robot.moveTo(this.minVal, this.minVal); // Draw the left vertical border to complete the outer square.
        this.robot.penUp();

        // Draw vertical lines for the grid.
        this.robot.moveTo(this.minVal + this.space, this.minVal);
        this.robot.penDown();
        this.robot.moveTo(this.minVal + this.space, this.maxVal); // First vertical line inside the grid.
        this.robot.penUp();

        this.robot.moveTo(this.minVal + this.space * 2, this.maxVal);
        this.robot.penDown();
        this.robot.moveTo(this.minVal + this.space * 2, this.minVal); // Second vertical line.
        this.robot.penUp();

        // Draw horizontal lines for the grid.
        this.robot.moveTo(this.maxVal, this.minVal + this.space);
        this.robot.penDown();
        this.robot.moveTo(this.minVal, this.minVal + this.space); // First horizontal line inside the grid.
        this.robot.penUp();

        this.robot.moveTo(this.minVal, this.minVal + this.space * 2);
        this.robot.penDown();
        this.robot.moveTo(this.maxVal, this.minVal + this.space * 2); // Second horizontal line.
        this.robot.penUp();
    }

    drawArc(x, y, radius, startAngle, endAngle, pointCount = 16) {
        // Draws an arc by calculating points on the arc and moving the AxiDraw pen to them.
        const angleInc = (endAngle - startAngle) / pointCount;
        const x1 = radius * cos(startAngle);
        const y1 = radius * sin(startAngle);
        this.robot.moveTo(x + x1, y + y1);
        this.robot.penDown();
      
        for (let i = 0; i <= pointCount; i += 1) {
          const angle = startAngle + i * angleInc;
          const relX = radius * cos(angle);
          const relY = radius * sin(angle);
          this.robot.moveTo(x + relX, y + relY);
        }
      
        this.robot.penUp();
      }

    drawX(c){
        let ctr = createVector((c.x * this.space) + this.space / 2, (c.y * this.space) + this.space / 2);
        let xSz = 6; // Size of the X.
        if(this.connected){
            this.robot.penUp();
            this.robot.moveTo(ctr.x - xSz, ctr.y - xSz);
            this.robot.penDown();
            this.robot.moveTo(ctr.x + xSz, ctr.y + xSz); // First diagonal of the X.
            this.robot.penUp();
            this.robot.moveTo(ctr.x - xSz, ctr.y + xSz);
            this.robot.penDown();
            this.robot.moveTo(ctr.x + xSz, ctr.y - xSz); // Second diagonal of the X.
            this.robot.penUp();
        }
    }

    drawO(c){
        let ctr = createVector((c.x * this.space) + this.space / 2, (c.y * this.space) + this.space / 2);
        if(this.connected)drawArc(c.x, c.y, 6, 0, TWO_PI); // Only one full circle is needed here.
    }
}