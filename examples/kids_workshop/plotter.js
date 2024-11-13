class Plotter{
    constructor(robot){
        this.robot = robot;
    }

    drawPoly(poly){
        if(!this.robot.connected)return;
        if(poly.length<1) return;

        this.robot.penUp();
        this.robot.moveTo(poly[0].x, poly[0].y);
        this.robot.penDown();
        if(poly.length>1){
            for(let i=1;i<poly.length;i++){
                this.robot.moveTo(poly[i].x, poly[i].y);
            }
            this.robot.moveTo(poly[0].x, poly[0].y);
        }
        this.penUp();
    }
}