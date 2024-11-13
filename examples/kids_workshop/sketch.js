const AppState = {
    Idle: 0,
    AxisConnected: 1,
    AxisSkipped: 2
}

const axi = new axidraw.AxiDraw();

let svgLibrary;
let plotter;
let curAppState = AppState.Idle;

///
/// AXI
///

function connectAxi(){
    axi.connect().then(() => {
        curAppState = AppState.AxisConnected;
    });
}



///
/// p5
///

function setup(){
    createCanvas(400, 400);
    ellipseMode(CENTER);
    textAlign(CENTER);

    svgLibrary = new SvgLibrary();
    plotter = new Plotter(axi);
}

function draw(){
    if(curAppState ==  AppState.Idle){
        background(255,0,0);
        text('\'c\' to connect to AXI\n\'s\' to skip connection', width / 2, height / 2);
        return;
    }

    background(150,150,150);
    svgLibrary.drawScreen();
}

function keyPressed(){
    if(curAppState == AppState.Idle){
        if(key=='c'){
            connectAxi();
        }else if(key=='s'){
            curAppState = AppState.AxisSkipped;
        }
    }
}

function mouseClicked(){
    if(curAppState == AppState.Idle)return;

    svgLibrary.addPolyAtPosition(0, createVector(mouseX, mouseY), plotter);
}