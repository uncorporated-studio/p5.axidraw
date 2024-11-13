const txtTriangle = '\
<?xml version="1.0" encoding="UTF-8"?>\
<svg>\
    <polygon points="0,0,50,0,25,50"/>\
</svg>';

class SvgDrawable{
    constructor(el){
        this.svgElement = el;
        this.polygon = [];
        let elPolygon = this.svgElement.querySelectorAll('polygon');
        let sVtx = elPolygon[0].getAttribute('points').split(',')
        for(let i=0;i<sVtx.length;i+=2){
            this.polygon.push(createVector(sVtx[i], sVtx[i+1]));
        }
    }

    draw(x, y){
        push();
        translate(x,y);
        noFill();
        beginShape();
        for(let i=0;i<this.polygon.length;i++){
            vertex(this.polygon[i].x, this.polygon[i].y);
        }
        endShape(CLOSE);
        pop();
    }
}

class PlacedSvg{
    constructor(idx, pos){
        this.svgIdx = idx;
        this.position = pos;
    }
}

class SvgLibrary{
    constructor(){
        this.parser = new DOMParser();
        
        this.svgs = [];
        this.svgs.push(this.loadSvgFromString(txtTriangle));

        this.placedSvgs = [];
    }

    loadSvgFromString(s){
        let svgDoc = this.parser.parseFromString(s, 'image/svg+xml');
        return new SvgDrawable(svgDoc.querySelector('svg'));
    }

    addPolyAtPosition(idx, pos, plotter){
        let psvg = new PlacedSvg(idx, pos);
        this.placedSvgs.push(psvg);
        plotter.drawPoly(this.makeScreenSpacePoly(psvg));
    }

    makeScreenSpacePoly(placedSvg){
        let poly = [];
        let svg = this.svgs[placedSvg.svgIdx];
        for(let i=0;i<svg.polygon.length;i++){
            poly.push(createVector(svg.polygon[i].x + placedSvg.position.x, svg.polygon[i].y) + placedSvg.position.y);
        }
        return poly;
    }

    drawScreen(){
        for(let i=0;i<this.placedSvgs.length;i++){
            this.svgs[this.placedSvgs[i].svgIdx].draw(this.placedSvgs[i].position.x, this.placedSvgs[i].position.y);
        }
    }
}