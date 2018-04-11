
export default class Background{
    constructor(ctx){
        this.canvas = wx.createCanvas()
        this.ctx = this.canvas.getContext('2d')
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0, canvas.width, canvas.height)
    }

    render(ctx){
        ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height)
    }
}