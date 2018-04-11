
let checkerboardInstance
let checkerboardImage = 'images/checkerboardbg.jpg'
export default class Checkerboard{
    constructor(){
        if( checkerboardInstance ){
            return checkerboardInstance
        }
        checkerboardInstance = this
    }

    // 初始化场地和棋盘
    init(ctx, cb){
        this.lineNum = 15
        this.winLength = 5
        this.canvas = wx.createCanvas()
        this.ctx = this.canvas.getContext('2d')
        this.image = wx.createImage()
        this.image.onload = () => {
            // this.canvas.width = this.image.width
            // this.canvas.height = this.image.height
            this.sideLength = canvas.width / 10 * 9
            // 计算棋盘边长（必须能整除 16 ）
            this.sideLength = this.sideLength % 16 + this.sideLength
            // 棋子有效区域边长
            this.pieceAreaSide = this.sideLength / 16 
            // 棋子半径
            this.pieceSideLength = Math.floor(this.pieceAreaSide/2) - 2
            // 画布边长
            this.canvas.width = this.sideLength
            this.canvas.height = this.sideLength
            // 画布居中的左上角坐标
            this.startX = (canvas.width - this.sideLength) / 2
            this.startY = (canvas.height - this.sideLength) / 2
            // 画棋盘底图
            this.ctx.drawImage(this.image, 0, 0)
            // 画棋盘线
            this.drawCheckerboardLine()
            cb()
            // 将画布加入到主画板中
            ctx.drawImage(this.canvas, this.startX, this.startY, this.sideLength, this.sideLength)
        }
        this.image.src = checkerboardImage
    }

    // 画棋盘线
    drawCheckerboardLine(){
        this.ctx.strokeStyle = "#000000";
        for (let row = 1; row <= this.lineNum; row++) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.pieceAreaSide, this.pieceAreaSide * row)
            this.ctx.lineTo(this.pieceAreaSide * (this.lineNum), this.pieceAreaSide * row)
            this.ctx.stroke()
        }
        for (let col = 1; col <= this.lineNum; col++) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.pieceAreaSide * col, this.pieceAreaSide)
            this.ctx.lineTo(this.pieceAreaSide * col, this.pieceAreaSide  * (this.lineNum) )
            this.ctx.stroke()
        }
    }

    // 检查是否结束游戏
    checkWin( gameData, row, col){
        let max = 0;
        let length = 0
        for (let type = 1; type <= 4; type++) {
            length = this.checkIndexPiece(row, col, gameData, type)
            if( length > max){
                max = length
            }
        }
        if( max >= 5){
            return true
        }else{
            return false
        }
    }

    // 以下的棋子检查 4 个方向
    checkIndexPiece( row, col, gameData, type){
        let addRow, addCol
        let startRow = row ,startCol = col
        switch(type){
            case 1: // 横向：左到右
                addRow = 0
                addCol = 1
                startCol -= 4
                break
            case 2: // 左上：由左向右
                addRow = 1
                addCol = 1
                startRow -= 4
                startCol -= 4
                break
            case 3: // 竖向：由上向下
                addRow = 1
                addCol = 0
                startRow -= 4
                break
            case 4: // 左下：由左向右
                addRow = -1
                addCol = 1
                startRow += 4
                startCol -= 4
                break
            default:
                return 0
        }
        let player = gameData[row][col]
        let max = 0
        let tmp = 0
        
        for(let index = 0 ; index < 9; index ++){
            // 线上中断，判断最大长度与临时长度，谁长就赋值给 max
            if( startRow < 0 || startCol < 0 || startRow > 14 || startCol > 14 
                || gameData[startRow][startCol] != player){
                max = max > tmp ? max : tmp
                tmp = 0
                
                startRow += addRow
                startCol += addCol
                
                continue
            }
            tmp ++
            startRow += addRow
            startCol += addCol
            
        }
        max = max > tmp ? max : tmp
        return max
    }

    // 计算棋子在棋盘的位置
    computeLocation( screenX, screenY){

        // 可点击区域，存在于棋盘边 - (pieceValidSideLength / 2) 的范围内
        let mistake = Math.floor(this.pieceAreaSide / 2)
        // 计算范围内坐标
        let x = screenX - this.startX - mistake 
        let y = screenY - this.startY - mistake
        // 落子位置的有效范围
        let sideLength = this.pieceAreaSide
        
        // 在有效区外
        if( x < 0 || x > this.width - mistake || y < 0 || y > this.height - mistake ){
            return false
        }
        let col = Math.floor( x / sideLength) 
        let row = Math.floor( y / sideLength) 
        // 边界值
        if( col >= this.lineNum || row >= this.lineNum){
            return false
        }
        let pieceX = col * sideLength + this.pieceAreaSide
        let pieceY = row * sideLength + this.pieceAreaSide
        let locationX = pieceX +this.startX
        let locationY = pieceY + this.startY
        return {
            col: col,
            row: row,
            locationX: locationX,
            locationY: locationY,
            pieceX: pieceX,
            pieceY: pieceY,
        }
    }

    // 渲染棋子
    renderPiece( ctx,piece, x, y){
        piece.render( this.ctx, x, y, this.pieceSideLength)
        ctx.drawImage(this.canvas, this.startX, this.startY, this.sideLength, this.sideLength)
    }

}