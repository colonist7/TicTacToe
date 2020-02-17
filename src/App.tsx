import React from 'react';
import './App.css';
import Square from './Square';
import styled, { keyframes } from 'styled-components';


interface Appstate {
  score?: Array<number>
  player: number,
  board: Array<number>,
  dialogVisible: boolean,
  reset?: boolean
}

interface Props {}

const FadeIn = keyframes`
                0%{
                  opacity: 0;
                }

                100% {
                  opacity: 1;
                }
              `;

const Board = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px auto;
    `;

const Score = styled.div`
                font-size: 30px;
                text-align: center;
                transition: all .3s ease-in-out;
                color: red;
              `;

const Turn = styled.div`
                font-weight: bold;
                text-align: center;
              `;

const Dialog = styled.div`
                  position: fixed;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  height: 100%;
                  background: rgba(255,255,255, 0.5);
                  top: 0;
                  left: 0; 
                  animation: ${FadeIn} 0.5s linear;

                  & > div {
                    width: 300px;
                    padding: 20px;
                    box-shadow 0 0 20px 0 rgba(0,0,0,0.4);

                    h2 {
                      color: green;
                      text-align: center;
                    }

                    p {
                      text-align: center;
                    }
                  }
                `;

const ActionBtn = styled.button`
                    width: 60px;
                    height: 30px;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    outline: none;
                    cursor: pointer;
                    margin: 5px;
                  `;

const GoodBtn = styled(ActionBtn)`
                  background-color: green;
                `;

const BadBtn = styled(ActionBtn)`
                background-color: red;
              `;

const ButtonGroup = styled.div`
                      display: flex;
                      justify-content: center; 
                    `;

let initialState:Appstate = {player: 0, board: [],dialogVisible: false};
class App extends React.Component<Props, Appstate> {
  state:Appstate = {
    score: [0,0],
    player: 1,
    board : [0, 0, 0,
             0, 0, 0,
             0, 0, 0],
    dialogVisible: false,
    reset: false
  };

  componentDidMount() {
    initialState = {...this.state};
  }

  appendDialog = ():void => {
    this.setState({dialogVisible: true});
  }

  calculateWinner = ():number => {
    const list:Array<Array<number>> = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let winner:number = 0;

    for(let i of list) {
      if(this.state.board[i[0]] === this.state.board[i[1]] && 
         this.state.board[i[0]] === this.state.board[i[2]]
         && this.state.board[i[0]] !== 0) {
           winner = this.state.board[i[0]];
         }
    }
    
    return winner;
  }

  isGameOver = (): boolean => {
    let gameover: boolean = true;

    this.state.board.map((x:number) => {
      if(x === 0) {
        gameover = false;
      }
      return null;
    })

    if(this.calculateWinner() > 0) {
      return true;
    }
    return gameover;
  }

  resetBoard = ():void => {
    let newScore:Array<number> = this.state.score ? {...this.state.score} : [0,0];
    if(this.calculateWinner() !== 0) {
      newScore[this.calculateWinner() - 1] = newScore[this.calculateWinner() - 1] + 1;
    }
    this.setState({...initialState, reset: true,score: newScore}, () => {
      this.setState({reset : false});
    });
  }

  closeDialog = ():void => {
    this.setState({...initialState, reset: true,score: [0,0]}, () => {
      this.setState({reset : false});
    });
  } 

  turn = (id:string, player:number) => {
    if(!this.isGameOver()) {
      let newBoard: Array<number> = [...this.state.board];
      if(player === 1) {
        newBoard[parseInt(id)] = 1;
        this.setState({player: 2, board: newBoard}, () => {    
          if(this.calculateWinner() > 0) {
            this.appendDialog();
          };
          if(this.isGameOver()) {
            this.appendDialog();
          };
        })
      } else {
        newBoard[parseInt(id)] = 2;
        this.setState({player: 1, board: newBoard}, () => {
            if(this.calculateWinner() > 0) {
              this.appendDialog();
            };
            if(this.isGameOver()) {
              this.appendDialog();
            };
        });
      }
    } 
  }

  dialogClass = () => {
    return this.state.dialogVisible ? "" : "none";
  }

  renderSquare = (i:number) => {
    let id:string = i.toString();
    return <Square disabled={this.isGameOver()} turn={this.turn} player={this.state.player} id={id} gameOver={this.state.reset? this.state.reset : false}/>
  }

  render () {
    let score1: number = this.state.score ? this.state.score[0] : 0;
    let score2: number = this.state.score ? this.state.score[1] : 0;
    return (
      <div>
          <Score>
              <h2>{score1 + " : " + score2}</h2>
          </Score>
          <Turn>
            It's a player {this.state.player} turn
          </Turn>
        <Board>
            <div className="row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
        </Board>
       <Dialog className={this.dialogClass()}>
        <div>
          <h2>{this.calculateWinner() ? "Player " +  this.calculateWinner() + " wins!!!" : "Free" }</h2>
          <p>Do you want to play again ?</p>
          <ButtonGroup>
            <GoodBtn onClick={this.resetBoard}>YES</GoodBtn>
            <BadBtn onClick={this.closeDialog}>NO</BadBtn>
          </ButtonGroup>
        </div>
        </Dialog>
      </div>
    );
  }
}

export default App;
