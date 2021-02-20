class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.stack = [];

    // total_cell and remaining cells are used for displaying percentage in snack bar
    this.total_cells = this.rows * this.columns;
    this.visited_cells = 0;
  }

  init() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    current = this.grid[0][0];
    current.visited = true;
    this.visited_cells++;
  }

  drawMaze() {
    maze_canvas.width = this.size;
    maze_canvas.height = this.size;
    maze_canvas.style.background = "black";

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].drawAllWalls(this.size, this.rows, this.columns);
      }
    }

    // dfs starts
    let next = current.checkNeighbours(this.grid, this.rows, this.columns);

    // if neighbours of current cell is not visited yet and
    if (next) {
      next.visited = true;
      current.removeWalls(next);
      this.stack.push(current);
      current.highlightAsSquare(this.size, this.rows, this.columns, "purple");
      current = next;

      // displaying generation status in snack bar
      this.visited_cells++;
      snackbar.innerHTML =
        Math.floor((this.visited_cells / this.total_cells) * 100) +
        "% generation completed";
    }

    // if next is undefined and stack is not empty
    else if (this.stack.length > 0) {
      current = this.stack.pop();
      current.highlightAsSquare(this.size, this.rows, this.columns, "purple");
    }

    if (this.stack.length == 0) {
      snackbar.className = snackbar.className.replace("show", "hide");
      is_playground_ready = true;
      current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
      this.grid[goal[0]][goal[1]].highlightAsCircle(
        maze.size,
        maze.rows,
        maze.columns,
        "green"
      );
      maze_genertion_audio.pause();
      return;
    }

    // recursive call with Animation
    window.requestAnimationFrame(() => {
      this.drawMaze();
    });
  }
}

class Cell {
  constructor(row_num, col_num, parent_grid, parent_size) {
    this.row_num = row_num;
    this.col_num = col_num;
    this.visited = false;
    this.walls = {
      top_wall: true,
      right_wall: true,
      bottom_wall: true,
      left_wall: true,
    };
  }

  // find neighbours of current cell
  checkNeighbours(grid, rows, columns) {
    let neighbours = [];
    let r = this.row_num,
      c = this.col_num;

    // if curernt cell is on edge of the canvas it won't have neighbour
    let top = r - 1 >= 0 ? grid[r - 1][c] : undefined;
    let right = c + 1 < columns ? grid[r][c + 1] : undefined;
    let bottom = r + 1 < rows ? grid[r + 1][c] : undefined;
    let left = c - 1 >= 0 ? grid[r][c - 1] : undefined;

    // if any neighbours is undefined and has already been visited then it won't be added to array
    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    if (neighbours.length > 0) {
      // generate random number for neighbours
      let rand = Math.floor(Math.random() * neighbours.length);
      return neighbours[rand];
    }
    return undefined;
  }

  // remove walls from this and other cell
  removeWalls(other) {
    // difference between rows
    let dx = this.row_num - other.row_num;
    // difference between columns
    let dy = this.col_num - other.col_num;

    if (dx !== 0) {
      if (dx === 1) {
        this.walls.top_wall = false;
        other.walls.bottom_wall = false;
      }
      if (dx === -1) {
        this.walls.bottom_wall = false;
        other.walls.top_wall = false;
      }
    }
    if (dy !== 0) {
      if (dy === 1) {
        this.walls.left_wall = false;
        other.walls.right_wall = false;
      }
      if (dy === -1) {
        this.walls.right_wall = false;
        other.walls.left_wall = false;
      }
    }
  }

  drawTopWall(x, y, size, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y + size / rows);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // used when generating maze
  highlightAsSquare(size, rows, columns, color) {
    let x = (this.col_num * size) / columns;
    let y = (this.row_num * size) / rows;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size / columns - 2, size / rows - 2);
  }

  highlightAsCircle(size, rows, columns, color) {
    let x = (this.col_num * size) / columns;
    let y = (this.row_num * size) / rows;
    let width = size / columns,
      height = size / rows;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 2 - 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawAllWalls(size, rows, columns) {
    let x = (this.col_num * size) / columns;
    let y = (this.row_num * size) / rows;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;

    if (this.walls.top_wall) this.drawTopWall(x, y, size, rows, columns);
    if (this.walls.right_wall) this.drawRightWall(x, y, size, rows, columns);
    if (this.walls.bottom_wall) this.drawBottomWall(x, y, size, rows, columns);
    if (this.walls.left_wall) this.drawLeftWall(x, y, size, rows, columns);

    if (this.visited)
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
  }
}
