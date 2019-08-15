# 15-PUZZLE (terminal edition)
_PLEASE READ TO VERY END_
## TASK
Your task is to implement single user game ​15 Puzzle​ (​https://en.wikipedia.org/wiki/15_puzzle​).
The 15-puzzle is a sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing.
Game is represented by 4x4 tiles board where 15 numbered tiles are initially placed in random order and where 16th tile is missing.
A tile can be moved to a neighbour empty place. To succeed in the game you need to order tiles from 1 to 15,
where tile number 1 is at the top left corner and empty one is at the bottom right corner.


## IMPLEMENTATION

This 15-puzzle game is implemented on Node.js v8.9.0. It consists with several parts:
* __Board__ - class that manage field and tile moves;
* __FieldFactory__ - class that generate field and check it solvability;
* __InputProvider__ - class that is listening user input;
* __LogProvider__ - class that manage logs (used pino logger under the hood);
* __SaveLoadProvider__ - class that manage saved games;
* __Presentation__ - class that render everything (used terminal-kit under the hood);
* __Master__ - class that connect all these pieces;

Also I added a small feature on my own initiative. It is 15-puzzle solver.
It implement __A* algorithm__. And it use several heuristics:
* Number of tiles that are not on theirs place;
* Manhattan distance;
* Number of linear conflicts;

Puzzle solver consists with:
* __Vertex__ - class that represent some state of board and calculate heuristics;
* __PriorityQueue__ - class that implement prioritized queue;
* __PuzzleSolver__ - class that connect previous two guys and implement A* algorithm;

You will definitely figure out how to run it withing the game process.
But I would recommend you to change size of field from 4 to 3 to see how it works.
Also you may run it as is but then it will take some time. The worst case that I have was 4 hours.
