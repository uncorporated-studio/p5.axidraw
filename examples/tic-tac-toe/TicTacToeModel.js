const MoveType = {
    Center: "Center",
    Corner: "Corner",
    Edge: "Edge"
}

class WinningMoveScore{
    constructor(){
        this.score = 0;
        this.moves = [];
    }

    addMove(move){
        this.score ++;
        this.moves.push(move);
    }

    findMissingX(){
        if(this.move<2)return null;
        let positions = [false, false, false];
        let i=0;
        for(i=0;i<this.moves.length;i++){
            positions[this.moves[i].x] = true;
        }
        for(i=0;i<positions.length;i++){
            if(positions[i]===true)return i;
        }
        return null;
    }
}

class GameState{
    constructor(){
        this.history = [[], []];
        this.board = [
            [ -1, -1, -1],
            [ -1, -1, -1],
            [ -1, -1, -1]
        ];
    }

    addMove(player, move){
        this.history[player].push(move);
        this.board[move.x][move.y] = player;
    }

    isCellFree(move){
        return this.board[move.x][move.y]<0;
    }

    getNumNeighbors(move){
        let score = [0,0];
        let minX = move.x-1;
        let maxX = move.x+1;
        let minY = move.y-1;
        let maxY = move.y+1;
        if(move.x==0)minX += 1;
        if(move.x==2)maxX -= 1;
        if(move.y==0)minY += 1;
        if(move.y==2)maxY -= 1;
        for(let x=minX;x<=maxX;x++){
            for(let y=minY;y<=maxY;y++){
                if(x!=y){
                    score[this.board[x,y]] += 1;
                }
            }
        }
        return score;
    }
}