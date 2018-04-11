
export default class Piece {

    constructor( color ){
        this.color = color
    }

    render( ctx, screenX, screenY, sideLenght){
        ctx.beginPath()
        ctx.fillStyle=this.color;
        ctx.arc(screenX,screenY,sideLenght,0,2*Math.PI)
        ctx.fill();
    }

}