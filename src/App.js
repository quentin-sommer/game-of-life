import Inferno from 'inferno'
import Component from 'inferno-component'
import "./app.css"

const width = 875
const cellsPerLine = 175
const cellSize = (width / cellsPerLine)

const genGrid = () => new Array(cellsPerLine * cellsPerLine).fill(0)

const genInterestingGrid = () => genGrid().map((cell, index) => (index % 2 === 0) ? 1 : 0)

const sameLine = (oldIdx, newIdx) => Math.floor(oldIdx / cellsPerLine) === Math.floor(newIdx / cellsPerLine)

const getNextState = (array, index) => {
  let ret = 0
  // top left diag
  if (array[index - cellsPerLine - 1] !== undefined
    && sameLine(index - cellsPerLine, index - cellsPerLine - 1)
    && array[index - cellsPerLine - 1] !== 0) {
    ret += 1
  }
  // top
  if (array[index - cellsPerLine] !== undefined
    && array[index - cellsPerLine] !== 0) {
    ret += 1
  }
  // top right diag
  if (array[index - cellsPerLine + 1] !== undefined
    && sameLine(index - cellsPerLine, index - cellsPerLine + 1)
    && array[index - cellsPerLine + 1] !== 0) {
    ret += 1
  }
  // left
  if (array[index - 1] !== undefined
    && sameLine(index, index - 1)
    && array[index - 1] !== 0) {
    ret += 1
  }
  // right
  if (array[index + 1] !== undefined
    && sameLine(index, index + 1)
    && array[index + 1] !== 0) {
    ret += 1
  }
  // down left diag
  if (array[index + cellsPerLine - 1] !== undefined
    && sameLine(index + cellsPerLine, index + cellsPerLine - 1)
    && array[index + cellsPerLine - 1] !== 0) {
    ret += 1
  }
  // down
  if (array[index + cellsPerLine] !== undefined
    && array[index + cellsPerLine] !== 0) {
    ret += 1
  }
  // down right diag
  if (array[index + cellsPerLine + 1] !== undefined
    && sameLine(index + cellsPerLine, index + cellsPerLine + 1)
    && array[index + cellsPerLine + 1] !== 0) {
    ret += 1
  }
  switch (ret) {
    case 3:
      return 1
    case 2:
      return array[index]
    default:
      return 0
  }
}

const cellStyle = {
  height: `${cellSize}px`,
  width: `${cellSize}px`,
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cells: genGrid(),
      iterations: 0,
      fps: 30,
      playing: false,
    }
    console.log('nb cells', this.state.cells.length)
    console.log('cell size', `${cellSize}px`)
  }

  startGame = () => {
    this.setState({
      playing: true
    }, () => this.nextState())
  }
  stopGame = () => {
    this.setState({
      playing: false,
    })
  }

  resetGame = () => {
    this.setState({
      playing: false,
      cells: genGrid(),
      iterations: 0,
    })
  }

  loadInterestingGrid = () => {
    this.setState({
      cells: genInterestingGrid(),
      iterations: 0,
    })
  }

  nextState = () => {
    const newCells = [...this.state.cells]
    this.state.cells.forEach((cell, index) => {
      newCells[index] = getNextState(this.state.cells, index)
    })
    this.setState({
      cells: newCells,
      iterations: this.state.iterations + 1,
    }, () => {
      setTimeout(() => this.state.playing ? requestAnimationFrame(this.nextState) : null
        , 1000 / this.state.fps)
    })
  }

  toggleAlive = (idx) => {
    console.log(idx)
    const newArray = [...this.state.cells]
    newArray[idx] = (newArray[idx] === 1) ? 0 : 1
    this.setState({
      cells: newArray,
    })
  }

  render() {
    return (
      <div style={{
        maxWidth: '1600px',
        width: '100%',
        margin: 'auto',
      }} >
        <div style={{
          display: 'flex',
        }} >
          <div>
            <h1>Game of life</h1>
            <button onClick={this.startGame} >Start</button>
            <button onClick={this.stopGame} >Stop</button>
            <button onClick={this.resetGame} >Reset</button>
            <button onClick={this.loadInterestingGrid} >Load nice grid</button>
            <div>Iterations : {this.state.iterations}</div>
            <input
              type="range"
              min={1}
              max={60}
              value={this.state.fps}
              onInput={(e) => {
                this.setState({
                  fps: parseInt(e.target.value, 10),
                })
              }}
            />
            <div>FPS: {this.state.fps}</div>

          </div>
          <div style={{
            boxSizing: 'content-box',
            height: `${width}px`,
            width: `${width}px`,
            display: 'flex',
            flexWrap: 'wrap',
            border: '1px solid black',
            margin: 'auto',
            flexShrink: '0',
          }} >
            {this.state.playing
              ?
              /* Game is playing, using simple divs as cells for speed */
              this.state.cells.map((cell, index) =>
                cell === 1
                  ? <div
                    className="alive-cell"
                    style={cellStyle}
                    key={index}
                  />
                  : <div
                    className="dead-cell"
                    style={cellStyle}
                    key={index}
                  />)
              :
              /* Game isn't playing, using cells with onclick callbacks to build shapes */
              this.state.cells.map((cell, index) =>
                cell === 1
                  ?
                  <div
                    onClick={() => this.toggleAlive(index)}
                    className="alive-cell edit"
                    style={cellStyle}
                    key={index}
                  />
                  :
                  <div
                    onClick={() => this.toggleAlive(index)}
                    className="dead-cell edit"
                    style={cellStyle}
                    key={index}
                  />
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App

