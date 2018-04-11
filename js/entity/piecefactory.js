
import Piece from './piece'

let pieceFactory

export default class PieceFactory{
    constructor(){
        if( pieceFactory ){
            return pieceFactory
        }
        pieceFactory = this
    }

    product( type ){

        if( type == 0 ){
            return new Piece('#000000')
        }else{
            return new Piece('#ffffff')
        }
    }

}