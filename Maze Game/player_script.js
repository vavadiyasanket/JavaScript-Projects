// ---------- canvas initialization ----------
let maze_canvas = document.querySelector("#mazeCanvas");
let ctx = maze_canvas.getContext("2d");

let snackbar = document.getElementById("snackbar");

// html div to display total move count
let display_move_count = document.querySelector("#display_move_count");

// after completing game there will be pop-up which will provide two options to replay and to close
let completed = document.querySelector(".completed");
let replay = document.querySelector(".replay");
let close = document.querySelector(".close");

// -------------------- loading Resources: Images and Audio --------------------
let img = new Image();
img.src = "Resources/Images/pressEnter.png";
img.classList.add("banner_press_enter");
document.querySelector("body").appendChild(img);

let maze_genertion_audio = new Audio("Resources/Sounds/MazeGeneration.wav");
let move_to_next_cell_audio = new Audio("Resources/Sounds/MoveToNextCell.wav");
let collid_to_wall_audio = new Audio("Resources/Sounds/CollidToWall.wav");
let goal_reached_audio = new  Audio("Resources/Sounds/GoalReached.wav")

// boolean to prevent keydown event if player  won
let is_player_won = false;

// to count total moves to reach goal
let counts = 0;

// after maze is fully generated this boolean variable will be true
let is_playground_ready = false;

// currently selected grid cell
let current;

let playground_area = 500,
  rows = 10,
  columns = 10;
let maze = new Maze(playground_area, rows, columns);

let goal = [rows - 1, columns - 1];

completed.style.display = "none";

window.addEventListener("keydown", moveSquare);

function moveSquare(e) {
  if (!is_playground_ready && e.keyCode === 13) {
    img.style.display = "none";
    maze_genertion_audio.addEventListener(
      "ended",
      function () {
        maze_genertion_audio.play();
      },
      false
    );
    maze_genertion_audio.play();
    main();
  }
  if (!is_playground_ready || is_player_won) return;
  let key = e.key;
  let r = current.row_num,
    c = current.col_num;

  // boolean variable to detect correct key was pressed or not
  let was_move_successful = false;

  switch (key) {
    case "ArrowUp":
      if (!current.walls.top_wall) {
        let next = maze.grid[r - 1][c];
        current = next;
        was_move_successful = true;
        maze.drawMaze();
        current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
        // uncomment autoMove to enable detect and move to next cell automatically  (has some bug)
        // autoMove(3);
      }
      else{
        collid_to_wall_audio.play();
        collid_to_wall_audio.currentTime = 0;
      }
      break;

    case "ArrowRight":
      if (!current.walls.right_wall) {
        let next = maze.grid[r][c + 1];
        current = next;
        was_move_successful = true;
        maze.drawMaze();
        current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
        // autoMove(4);
      }
      else{
        collid_to_wall_audio.play();
        collid_to_wall_audio.currentTime = 0;
      }
      break;

    case "ArrowDown":
      if (!current.walls.bottom_wall) {
        let next = maze.grid[r + 1][c];
        current = next;
        was_move_successful = true;
        maze.drawMaze();
        current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
        // autoMove(1);
      }
      else{
        collid_to_wall_audio.play();
        collid_to_wall_audio.currentTime = 0;
      }
      break;

    case "ArrowLeft":
      if (!current.walls.left_wall) {
        let next = maze.grid[r][c - 1];
        current = next;
        was_move_successful = true;
        maze.drawMaze();
        current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
        // autoMove(2);
      }
      else{
        collid_to_wall_audio.play();
        collid_to_wall_audio.currentTime = 0;
      }
      break;
  }

  if (was_move_successful) {
    move_to_next_cell_audio.play();
    move_to_next_cell_audio.currentTime = 0;
    counts++;

    display_move_count.innerHTML = "Moves: " + counts;
    isPlayerWon();
  }
}

function isPlayerWon() {
  if (current.row_num === goal[0] && current.col_num === goal[1]) {
    is_player_won = true;
    goal_reached_audio.play();
    completed.style.display = "block";
  }
}

// to replay
replay.addEventListener("click", () => {
  location.reload();
});

// to close pop-up menu
close.addEventListener("click", () => {
  completed.style.display = "none";
});

function autoMove(came_from) {
  let block_sides = [];
  block_sides.push(came_from);
  addOtherSides(block_sides, came_from);
  isPlayerWon();
  if (block_sides.length !== 3 || is_player_won) {
    console.log("recursion complete");
    return;
  }

  let missing = -1,
    sum = 0,
    total_sum = 1 + 2 + 3 + 4;

  console.log(block_sides);
  while (block_sides.length !== 0) sum += block_sides.pop();

  missing = total_sum - sum;

  console.log("misssing: " + missing);
  let next;
  let r = current.row_num,
    c = current.col_num;
  if (missing == 1) {
    next = maze.grid[r - 1][c];
    current = next;
    maze.drawMaze();
    current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
    window.requestAnimationFrame(() => {
      autoMove(3);
    });
    // setTimeout(() => {
    //   requestAnimationFrame(autoMove(3));
    // }, 1000/10);
  } else if (missing == 2) {
    next = maze.grid[r][c + 1];
    current = next;
    maze.drawMaze();
    current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
    window.requestAnimationFrame(() => {
      autoMove(4);
    });
    // setTimeout(() => {
    //   requestAnimationFrame(autoMove(4));
    // }, 1000/10);
  } else if (missing == 3) {
    next = maze.grid[r + 1][c];
    current = next;
    maze.drawMaze();
    current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
    window.requestAnimationFrame(() => {
      autoMove(1);
    });
    // setTimeout(() => {
    //   requestAnimationFrame(autoMove(1));
    // }, 1000/10);
  } else if (missing == 4) {
    next = maze.grid[r][c - 1];
    current = next;
    maze.drawMaze();
    current.highlightAsCircle(maze.size, maze.rows, maze.columns, "purple");
    window.requestAnimationFrame(() => {
      autoMove(2);
    });
    // setTimeout(() => {
    //   requestAnimationFrame(autoMove(2));
    // }, 1000/10);
  }
}

function addOtherSides(block_sides, came_from) {
  if (came_from !== 1 && current.walls.top_wall) block_sides.push(1);
  if (came_from !== 2 && current.walls.right_wall) block_sides.push(2);
  if (came_from !== 3 && current.walls.bottom_wall) block_sides.push(3);
  if (came_from !== 4 && current.walls.left_wall) block_sides.push(4);
}

function main() {
  snackbar.className = snackbar.className.replace("", "show");
  maze.init();
  maze.drawMaze();
  current = maze.grid[0][0];
}
