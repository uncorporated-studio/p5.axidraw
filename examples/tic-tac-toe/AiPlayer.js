
class AiPlayer{
    constructor(){

    }

    move(g){
        if(g.countAllMoves()==1){
            return this.answerOpeningMove(g);
        }else{
            let c = this.findWinningOrBlockingMove(g);
            if(c.x>=0) return g.addMove(c, 1);

            return this.makeRandomMove(g);
        }
    }

    answerOpeningMove(g){
        let c = g.lastMove;
        let mt = g.getMoveType(c);
        let r;
        switch(mt){
            case MoveType.Center:
                //take a corner
                r = Math.floor(Math.random()*4);
                switch(r){
                    case 0:
                        return g.addMove(createVector(0,0), 1);
                    case 1:
                        return g.addMove(createVector(2,0), 1);
                    case 2:
                        return g.addMove(createVector(2,2), 1);
                    case 3:
                    default:
                        return g.addMove(createVector(0,2), 1);
                }
            case MoveType.Edge:
                //take the center or an adjacent corner
                r = Math.random();
                if(r>0.5){
                    return g.addMove(createVector(1,1), 1);
                }else{
                    let inc = r>0.25? 1:-1;
                    if(c.y==1){
                        //vertical edge
                        return g.addMove(createVector(c.x, c.y+inc), 1);
                    }else{
                        //horizontal edge
                        return g.addMove(createVector(c.x+inc, c.y), 1);
                    }
                }
            case MoveType.Corner:
                //take the center
                return g.addMove(createVector(1,1), 1);
            default:
                return MoveOutcome.Forbidden;
        }
    }

    findWinningOrBlockingMove(g){
        let c = createVector(-1,-1);
        for(let y=0;y<3;y++){
            for(let x=0;x<3;x++){
                if(g.board[y][x]<0){
                    let cm =createVector(x,y);
                    if(g.isWinningMove(cm)){
                        return cm;
                    }
                }
            }
        }
        return c;
    }

    makeRandomMove(g){
        let freeMoves = [];
        for(let y=0;y<3;y++){
            for(let x=0;x<3;x++){
                if(g.board[y][x]<0){
                    freeMoves.push(createVector(x,y));
                }
            }
        }
        let m = Math.floor(Math.random()*freeMoves.length);
        return g.addMove(freeMoves[m], 1);
    }

    /*constructor(){
        this.opponentFirstMove = MoveType.Center;
    }

    isCenter(move){
        return (move.x==1 && move.y==1);
    }

    isEdge(move){
        if(move.y==1){
            return (move.x==0 || move.x==2);
        }
        if(move.x==1){
            return (move.y==0 || move.y==2);
        }
        return false;
    }

    makeMove(gameState){
        if(gameState.history[0].length==1){
            return this.answerToOpeningMove(gameState.history);
        }else{
            let myWinningMove = this.findWinningMove(gameState.history[1]);
            if(myWinningMove!=null) return myWinningMove;

            let theirWinningMove = this.findWinningMove(gameState.history[0]);
            if(theirWinningMove!=null) return theirWinningMove;

            return this.getFreeNeighborMove(gameState);
        }
    }

    getFreeNeighborMove(gameState){
        let scores = [];
        let x=0;
        let y=0;
        for(x=0;x<3;x++){
            for(y=0;y<3;y++){
                let move = createVector(x,y);
                if(gameState.isCellFree(move)){
                    let score = new WinningMoveScore();
                    score.moves.push(move);
                    let n = gameState.getNumNeighbors(move);
                    score.score = n[1];
                    scores.push(score);
                }
            }
        }

        let maxScore = 0;
        let maxIdx = 0;
        for(let i=0;i<scores.length;i++){
            if(scores[i].score>maxScore){
                maxScore = scores[i].score;
                maxIdx = i;
            }
        }

        return scores[maxIdx].moves[0];
    }

    findWinningMove(playerMoves){
        if(playerMoves.length<2)return null;
        let sameXY = new WinningMoveScore();
        let oppositeXY = new WinningMoveScore();
        let x = 0;

        for(let i=0;i<playerMoves.length;i++){
            if(playerMoves[i].x == playerMoves[i].y){
                sameXY.addMove(playerMoves[i]);
                if(sameXY.score==2){
                    x = sameXY.findMissingX();
                    if(x===null) return null;
                    return createVector(x,x);
                }
                if(playerMoves[i].x==1){
                    oppositeXY.addMove(playerMoves[i]);
                }
            }else if(playerMoves[i].x==0 && playerMoves[i].y==2 || playerMoves[i].y==0 && playerMoves[i].x==2 ){
                oppositeXY.addMove(playerMoves[i]);
            }
        }

        if(oppositeXY.score==2){
            x = oppositeXY.findMissingX();
            if(x==null)return null;
            switch(x){
                case 0:
                    return createVector(0,2);
                case 1:
                    return createVector(1,1);
                case 2:
                default:
                    return createVector(2,0);
            }
        }

        return null;
    }

    answerToOpeningMove(moves){
        if(this.isCenter(moves[0][0])){
            //X opened in the center: take a corner
            this.opponentFirstMove = MoveType.Center;
            let rC = Math.floor(Math.random()*4);
            let c = createVector(0,0);
            switch(rC){
                case 0:
                    return createVector(0,0);
                case 1:
                    return createVector(2,0);
                case 2:
                    return createVector(2,2);
                case 3:
                default:
                    return createVector(0,2);
            }
        }else if(this.isEdge(moves[0][0])){
            //X opened on an edge: take the center or an adjacent corner
            this.opponentFirstMove = MoveType.Edge;
            let r = Math.random();
            if(r>0.5){
                return createVector(1,1);
            }else{
                let bR = r>0.25;
                let c = createVector(0,0);
                if(moves[0][0].x==0 || moves[0][0].x==2){
                    c.x = moves[0][0].x;
                    if(bR){
                        c.y = 0;
                    }else{
                        c.y = 2;
                    }
                }else{
                    c.y = moves[0][0].y;
                    if(bR){
                        c.x = 0;
                    }else{
                        c.x = 2;
                    }
                }
                return c;
            }
        }else{
            //X opened on a corner: take the center
            this.opponentFirstMove = MoveType.Corner;
            return createVector(1, 1);
        }
    }*/
}