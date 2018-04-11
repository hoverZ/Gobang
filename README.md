#微信小游戏——五子棋玩家自玩版(使用前需要删除 README.md)
## 文件目录
```
images
 |_checkerboardbg.jpg
 |_GobangCheckerboard.jpg(没用)
js
 |-base
 |-entity
    |_checkerboard.js（棋盘）
    |_piece.js（棋子）
    |_piecefactory.js（棋子工厂）
 |-libs
    |_symbol.js
    |_weapp-adapter.js
 |-runtime
    |_background.js（场地）
    |_databus.js（没用）
 |_main.js
game.js
game.json
project.config.json
```
## 开发流程

- 界面绘制
- 检查胜负
- 遇到的问题

## 界面绘制

1、画场地

以一屏黑为场地 background.js

```
        this.canvas = wx.createCanvas()
        this.ctx = this.canvas.getContext('2d')
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0, canvas.width, canvas.height)
```
2、画棋盘 checkerboard.js

- 初始化数据 init(ctx, cb)
- 画线 drawCheckerboardLine()
- 画棋子 renderPiece( ctx,piece, x, y)

实现逻辑：
```
棋盘底图是一个边长能被平均分成16份的正方形，边长为 this.sideLength，
棋盘上的每一个小正方形的边长为 this.pieceAreaSide = this.sideLength/16
棋子的有效半径为 this.pieceSideLength = Math.floor(this.pieceAreaSide/2) - 2
棋盘左上角在主画布上的坐标为（this.startX, this.startY）
计算落子位置 computeLocation()
```

## 检查胜负
检查以落子位置为中心，边长为9的正方形，中经过落子的所有方向

## 遇到的问题
1、屏幕触点坐标
是用 client 还是 screen

2、真机画布渲染问题（例如：图片成背景）
当在初始化画布时 存在image.onload方法，需要把画布渲染动作在 onload 回调中实现 
