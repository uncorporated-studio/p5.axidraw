class Screen{
    constructor(){}

    drawBoard(){
        background(0, 255, 0);
        // Draw grid lines on the canvas to visualize the tic-tac-toe board.
        let xx = width / 3;
        let yy = height / 3;
        strokeWeight(1);
        stroke(0, 0, 0);
        line(xx, 0, xx, height); // First vertical line.
        line(0, yy, width, yy); // First horizontal line.
        xx = width * 2 / 3;
        yy = height * 2 / 3;
        line(xx, 0, xx, height); // Second vertical line.
        line(0, yy, width, yy); // Second horizontal line.
    }

    drawX(c){
        let w = width/3;
        let h = height/3;
        line(c.x * w, c.y * h, (c.x+1)*w, (c.y+1)*h);
        line(c.x * w, (c.y+1)*h, (c.x+1)*w, c.y * h);
    }

    drawO(c){
        let mX = width/6;
        let mY = height/6;
        let w = width/3;
        let h = height/3;
        ellipse(mX + (w*c.x), mY + (h*c.y), 30);
    }

    drawMoves(g){
        stroke(0);
        noFill();
        let m=0;
        for(let y=0;y<3;y++){
            for(let x=0;x<3;x++){
                strokeWeight(1);
                let c = createVector(x,y);
                switch(g.board[c.y][c.x]){
                    case 0:
                        if(g.winner==0)strokeWeight(3);
                        this.drawX(c);
                        break;
                    case 1:
                        if(g.winner==1)strokeWeight(3);
                        this.drawO(c);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}