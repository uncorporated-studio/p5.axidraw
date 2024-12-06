const MoveType = {
    Center: "Center",
    Corner: "Corner",
    Edge: "Edge"
}

const MoveOutcome = {
    Forbidden: -1,
    Done: 0,
    Win: 1
}

class Game{
    constructor(){
        this.board = [
            [ -1, -1, -1],
            [ -1, -1, -1],
            [ -1, -1, -1]
        ];
        this.moveTypes = [
            [MoveType.Corner,   MoveType.Edge,      MoveType.Corner],
            [MoveType.Edge,     MoveType.Center,    MoveType.Edge],
            [MoveType.Corner,   MoveType.Edge,      MoveType.Corner]
        ];
        this.winner = -1;
        this.lastMove = createVector(0,0);
    }

    isGameWon(){
        return this.winner>=0;
    }

    isCellFree(c){
        if(c.x<0)c.x=0;
        if(c.x>2)c.x=2;
        if(c.y<0)c.y=0;
        if(c.y>2)c.y=2;
        let r = this.board[c.y][c.x]<0;
        return r;
    }

    addMove(cell, player){
        if(!this.isCellFree(cell))return MoveOutcome.Forbidden;
        this.board[cell.y][cell.x] = player;
        this.lastMove = cell;
        if(this.isWinningMove(cell)){
            this.winner = player;
            console.log("Player "+player+" won");
            return MoveOutcome.Win;
        }
        return MoveOutcome.Done;
    }

    getMoveType(c){
        return this.moveTypes[c.y][c.x];
    }

    isWinningMove(c){
        let p = this.board[c.y][c.x];
        if(p<0)return false;
        
        let mt = this.getMoveType(c);
        switch(mt){
            case MoveType.Edge:
                if(this.isVerticalLineWinningForPlayer(c.x, p))return true;
                return this.isHorizontalLineWinningForPlayer(c.y, p);
            case MoveType.Corner:
                if(this.isHorizontalLineWinningForPlayer(c.y, p)) return true;
                if(this.isVerticalLineWinningForPlayer(c.x, p)) return true;
                if(this.board[1][1]!=p)return false;
                let oppositeCrn;
                if(c.x!=c.y){
                    oppositeCrn = createVector(c.y, c.x);
                }else{
                    if(c.x==0){
                        oppositeCrn = createVector(2,2);
                    }else{
                        oppositeCrn = createVector(0,0);
                    }
                }
                return this.board[oppositeCrn.y][oppositeCrn.x] == p;
            case MoveType.Center:
                if(this.isHorizontalLineWinningForPlayer(c.y, p)) return true;
                if(this.isVerticalLineWinningForPlayer(c.x, p)) return true;
                if(this.board[0][0]==p && this.board[2][2]==p)return true;
                return this.board[2][0]==p && this.board[0][2]==p;
            default:
                return false;
        }
    }

    isVerticalLineWinningForPlayer(x, player){
        return this.board[0][x]==player && this.board[1][x]==player && this.board[2][x]==player; 
    }

    isHorizontalLineWinningForPlayer(y, player){
        return this.board[y][0]==player && this.board[y][1]==player && this.board[y][2]==player;
    }

    countAllMoves(){
        let n = 0;
        for(let y=0;y<3;y++){
            for(let x=0;x<3;x++){
                if(this.board[y][x]>=0)n++;
            }
        }
        return n;
    }

    findFirstMoveForPlayer(p){
        let c = createVector(-1,-1);
        for(let y=0;y<3;y++){
            for(let x=0;x<3;x++){
                if(this.board[y][x]==p){
                    c.y = y;
                    c.x = x;
                    return c;
                }
            }
        }
        return c;
    }
}

/*class WinningMoveScore{
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
}*/