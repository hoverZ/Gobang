import Background from './runtime/background'
import Checkerboard from './entity/checkerboard'
import PieceFactory from './entity/piecefactory'

let ctx = canvas.getContext('2d')
let pieceFactory = new PieceFactory()

export default class Main{

    constructor(){
        this.row = 15
        this.col = 15
        this.blackPlayer = 1
        this.whitePlayer = 2
        this.player = 0
        
        this.init()
        this.start()
        wx.onTouchStart((data) => {
            this.touche = data.touches[0]
        })
        // 棋盘位置定位
        wx.onTouchEnd(() => {
            this.lazi(this.touche)
        })
    }

    // 下棋子动作
    lazi(touche){
        if(this.gameOver){
            return
        }
        let piece = pieceFactory.product(this.player)
        // 屏幕的坐标
        let x = touche.clientX
        let y = touche.clientY
        let anchor = this.checkerboard.computeLocation(x,y)
        if( anchor === false){
            console.log("无效区域")
            return
        }
        if( this.gameData[anchor.row][anchor.col] != 0){
            console.log("该地方已经有棋子了")
            return 
        }
        // 游戏区二位数组赋值
        this.gameData[anchor.row][anchor.col] = this.player + 1
        // piece.render( ctx, anchor.locationX, anchor.locationY, this.checkerboard.getPieceSideLength())
        // 在棋盘画布上绘制棋子
        this.background.render(ctx)
        this.checkerboard.renderPiece( ctx, piece, anchor.pieceX, anchor.pieceY)
        // 绘制完棋子后检查是否决出胜负
        if(this.checkerboard.checkWin(this.gameData, anchor.row, anchor.col)){
            console.log( "Player "+this.player+" win")
            this.gameOver = true
            let winner = this.player === 1 ? "白棋" : "黑棋"
            wx.showModal({
                title: "Tips",
                content: winner + " win",
                showCancel: false,
                confirmText: "OK",
                confirmColor: "blue",
                success: (data) => {
                    if(data.confirm){
                        this.restart()
                    }
                }
            })
        }
        this.player = (this.player + 1) % 2     
    }

    // 初始化
    init(){
        this.gameData = []
        // 初始化背景
        this.background = new Background(ctx)
        // 初始化棋盘
        this.checkerboard = new Checkerboard()
    }

    // 重置游戏区数据
    clearGameData(){
        for( let row = 0; row < this.row; row ++){
            this.gameData[row] = []
            for( let col = 0; col < this.col; col ++){
                this.gameData[row][col] = 0
            }
        }
    }

    start(){
        this.gameOver = false
        this.clearGameData()
        // image.onload 方法延迟导致页面背景渲染问题，比如棋盘变成背景图
        // 初始化场地和棋盘
        this.checkerboard.init(ctx,()=>{
            this.background.render(ctx)
        })
    }

    // 重新开始
    restart(){
        this.start()
    }

}