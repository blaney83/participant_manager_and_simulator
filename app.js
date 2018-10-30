
const inquirer = require("inquirer");
var count = 1;
let playerArray = [];
let starterArray = [];
let subArray = [];
let teamPoints = 0;
let gameCount = 5;

function addPlayer() {
    inquirer
        .prompt([
            {
                type: "input",
                question: "Player name is: ",
                name: "name"
            },
            {
                type: "list",
                question: "What is this player's position?",
                choices: ["striker", "defender", "midfielder", "goalie"],
                name: "position"
            },
            {
                type: "list",
                question: "What is this player's defense level?",
                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                name: "defense"
            },
            {
                type: "list",
                question: "What is this player's offense level?",
                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                name: "offense"
            }
        ]).then(function (resp) {

            var playerNumber = "player" + count

            function Player(name, position, defense, offense) {
                this.name = name,
                    this.position = position,
                    this.defense = defense,
                    this.offense = offense
            };
            Player.prototype.defGoodGame = function () {
                var defGoodGame = Math.floor(Math.random() * 2 + 1)
                if (defGoodGame == 1) {
                    this.defGame = "Bad Game";
                    this.defense = parseInt(this.defense) - Math.floor(Math.random() * 3 + 1);
                } else {
                    this.defGame = "Good Game";
                    this.defense = parseInt(this.defense) + Math.floor(Math.random() * 3 + 1);
                }
            };
            Player.prototype.offGoodGame = function () {
                var defGoodGame = Math.floor(Math.random() * 2 + 1)
                if (defGoodGame == 1) {
                    this.offGame = "Bad Game";
                    this.offense = parseInt(this.offense) - Math.floor(Math.random() * 3 + 1);
                } else {
                    this.offGame = "Good Game";
                    this.offense = parseInt(this.offense) + Math.floor(Math.random() * 3 + 1);
                }
            };
            Player.prototype.printPlayer = function () {
                console.log("\nPlayer: " + this.name + "\nPosition: " + this.position + "\nStarter: " + this.starter + "\nDefense: " + this.defense + "\nOffense: " + this.offense + "\nDefensive Game: " + this.defGame + "\nOffensive Game: " + this.offGame)
            };
            playerNumber = new Player(resp.name, resp.position, resp.defense, resp.offense);

            playerNumber.defGoodGame();
            playerNumber.offGoodGame();

            if (count < 4) {
                playerNumber.starter = true
            } else {
                playerNumber.starter = false
            }

            count = count + 1;

            playerArray.push(playerNumber)

            if (count < 6) {
                addPlayer();
            } else {
                playerArray.forEach(function (arr) {
                    if (arr.starter) {
                        starterArray.push(arr);
                    } else {
                        subArray.push(arr)
                    }
                    arr.printPlayer();
                })
                startGame();
            }
        })
}

function startGame() {
    if (gameCount > 0) {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    question: "Ready to play a game?",
                    name: "start"
                },
                {
                    type: "confirm",
                    question: "Would you like to make a substitution?",
                    name: "sub"
                }
            ]).then(function (resp) {
                if (resp.start && resp.sub === false) {
                    runGame();
                } else if (resp.sub) {
                    subStarters();
                } else {
                    startGame()
                }
            })
    } else {
        if (teamPoints > 0) {
            console.log("Great Game! Your team won!")
            playAgain();
        } else if (teamPoints < 0) {
            console.log("Your team was defeated! Better luck next time.")
            playAgain();
        } else {
            console.log("Tie game!")
            playAgain();
        }
    }
}

function subStarters() {
    inquirer
        .prompt([
            {
                type: "list",
                question: "Choose one starter to sit on the bench:",
                choices: starterArray,
                name: "starterPull"
            },
            {
                type: "list",
                question: "Choose one sub to play in the game:",
                choices: subArray,
                name: "subStart"
            },
        ]).then(function (resp) {
            let playerPull = resp.starterPull
            let playerStart = resp.subStart
            playerPull.starter = false;
            playerStart.starter = true;
            runGame()
        })
}

function runGame() {
    let offRand = Math.floor(Math.random() * 20 + 1);
    let defRand = Math.floor(Math.random() * 20 + 1);
    starterArray.forEach(function (arr) {
        if (offRand > arr.offense) {
            teamPoints = teamPoints - 1;
        } else if (offRand < arr.offense) {
            teamPoints = teamPoints + 1;
        };
        if (defRand > arr.defense) {
            teamPoints = teamPoints - 1;
        } else if (defRand < arr.defense) {
            teamPoints = teamPoints + 1;
        }
        if (teamPoints > 0) {
            console.log(arr.name + " match win! \nTeam score: " + teamPoints)
        } else {
            console.log(arr.name + " match loss! \nTeam score: " + teamPoints)
        }
    })
    gameCount = gameCount - 1;
    startGame();
}

function playAgain() {
    inquirer
        .prompt([
            {
                type: "confirm",
                question: "Would you like to play again?",
                name: "rematch"
            },
            {
                type: "confirm",
                question: "Would you like a new team?",
                name: "newTeam"
            }
        ]).then(function (resp) {
            teamPoints = 0;
            gameCount = 5;
            if (resp.rematch && newTeam === false) {
                startGame();
            } else if (resp.rematch && newTeam) {
                count = 1;
                playerArray = [];
                starterArray = [];
                subArray = [];
                addPlayer();
            }else{
                console.log("Play again soon!")
            }
        })
}

addPlayer();