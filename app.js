
//inquirer package is used for player input
const inquirer = require("inquirer");
//chalk package for coloring console output
const chalk = require("chalk")
//counts the number of players entechalk.red into the system. Set to max 5
let count = 1;
//holds all of the constructed Player objects
let playerArray = [];
//used to verify there aren't duplicate names, which would mess up the substitution code
let playerNames = [];
//holds the Player Objects that will be used during gameplay
let starterArray = [];
//holds players who are sitting on the bench
let subArray = [];
//keeps track of score
let teamPoints = 0;
//tracks how many games we will play per match. Set to 5
let gameCount = 5;

//creates players through user input
function addPlayer() {
    inquirer
        .prompt([
            {
                type: "input",
                question: "Player name is: ",
                name: "name",
                validate: validateName
            },
            {
                type: "list",
                question: "What is this player's position?",
                choices: ["striker", "defender", "midfielder", "goalie"],
                name: "position"
            },
            {
                type: "input",
                question: "What is this player's defense level?",
                name: "defense",
                validate: validateScore
            },
            {
                type: "input",
                question: "What is this player's offense level?",
                name: "offense",
                validate: validateScore
            }
        ]).then(function (resp) {

            console.log("\n")
            //add player name to check for duplicates
            playerNames.push(resp.name)
            //temporary variable for setting equal to new Player object. *May not be needed*
            let playerNumber = "player" + count
            //Player object constructor function
            function Player(name, position, defense, offense) {
                this.name = name,
                    this.position = position,
                    this.defense = defense,
                    this.offense = offense
            };
            //prototype function for determining if players are on their defensive game
            Player.prototype.defGoodGame = function () {
                var defGoodGame = Math.floor(Math.random() * 2 + 1)
                if (defGoodGame == 1) {
                    this.defGame = chalk.red("Bad Game");
                    this.defense = parseInt(this.defense) - Math.floor(Math.random() * 3 + 1);
                } else {
                    this.defGame = chalk.green("Good Game");
                    this.defense = parseInt(this.defense) + Math.floor(Math.random() * 3 + 1);
                }
            };
            //prototype function for determining if players are on their offensive game
            Player.prototype.offGoodGame = function () {
                var defGoodGame = Math.floor(Math.random() * 2 + 1)
                if (defGoodGame == 1) {
                    this.offGame = chalk.red("Bad Game");
                    this.offense = parseInt(this.offense) - Math.floor(Math.random() * 3 + 1);
                } else {
                    this.offGame = chalk.green("Good Game");
                    this.offense = parseInt(this.offense) + Math.floor(Math.random() * 3 + 1);
                }
            };
            //prototype for displaying player info at the end of player creation
            Player.prototype.printPlayer = function () {
                console.log(chalk.blue("\nPlayer: ") + this.name + chalk.blue("\nPosition: ") + this.position + chalk.blue("\nStarter: ") + this.starter + chalk.blue("\nDefense: ") + this.defense + chalk.blue("\nOffense: ") + this.offense + chalk.blue("\nDefensive Game: ") + this.defGame + chalk.blue("\nOffensive Game: ") + this.offGame)
            };
            //calls the creation of new Player object using player constructor at the end of each inquirer
            playerNumber = new Player(resp.name, resp.position, resp.defense, resp.offense);
            //adjusts the offense and defense of each player randomly using xyzGoodGame prototype fns
            playerNumber.defGoodGame();
            playerNumber.offGoodGame();
            //sets the initial starting lineup (first 3 created are starters)
            if (count < 4) {
                playerNumber.starter = true
            } else {
                playerNumber.starter = false
            }
            //increases player count for recursive functionality
            count = count + 1;
            //add player objects to the playerArray
            playerArray.push(playerNumber)
            //logic for progression after 5 players created
            if (count < 6) {
                addPlayer();
            } else {
                //runs after 5 players created
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


//used to ensure that the values entechalk.red for the defense and offense are within the range of 1-10
function validateScore(score) {
    if (score > 0 && score < 11) {
        return true;
    } else { return "Pick a number between 1 and 10" }
}

//used to ensure that the name entechalk.red for each player has not been used already.
function validateName(name) {
    if (playerNames.includes(name) === false) {
        return true;
    } else { return "This player already exists. Choose a new name." }
}

//runs at the end of the player creation
function startGame() {
    //switch statement for checking to see if you have additional matches left in this game. runs 5 times.
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
                //checks to make sure you are ready to play and that you're satisfied with you starting lineup
                if (resp.start && resp.sub === false) {
                    runGame();
                } else if (resp.sub) {
                    subStarters();
                } else {
                    startGame()
                }
            })
    } else {
        //once you have played 5 matches executes this code
        if (teamPoints > 0) {
            console.log(chalk.green("Great Game! Your team won!"))
            playAgain();
        } else if (teamPoints < 0) {
            console.log(chalk.red("Your team was defeated! Better luck next time."))
            playAgain();
        } else {
            console.log(chalk.blue("Tie game!"))
            playAgain();
        }
    }
}

//function for changing starting lineup
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
            //changes Player object starter value of players being switched
            playerArray.forEach(function (arr) {
                if (arr.name === playerPull) {
                    arr.starter = false;
                }
                if (arr.name === playerStart) {
                    arr.starter = true;
                }
            })
            //clears out the start/sub arrays to be rebuilt
            starterArray = [];
            subArray = [];
            //resorts players now that you have adjusted the value of your starters/subs
            playerArray.forEach(function (arr) {
                if (arr.starter) {
                    starterArray.push(arr);
                } else {
                    subArray.push(arr)
                }
                arr.printPlayer();
            })
            //runs next game
            runGame()
        })
}

//runs after you confirm you are ready to play and after you make substitutions. Runs 5 times per game.
function runGame() {
    console.log("\n")
    //checks opponents offense and desfense against each player in your starting array
    starterArray.forEach(function (arr) {
        //creates random values for the opposing teams offense and defense
        let offRand = Math.floor(Math.random() * 20 + 1);
        let defRand = Math.floor(Math.random() * 20 + 1);
        //if opp off is higher than player off, a point is given to opponent
        if (offRand > arr.offense) {
            teamPoints = teamPoints - 1;
            console.log(chalk.red(arr.name + "'s offense lost a point!"))
        } else if (offRand < arr.offense) {
            teamPoints = teamPoints + 1;
            console.log(chalk.green(arr.name + "'s offense scochalk.red a point!"))
        };
        //if opp def is higher than player def, a point is given to opponent
        if (defRand > arr.defense) {
            teamPoints = teamPoints - 1;
            console.log(chalk.red(arr.name + "'s defense lost a point!"))
        } else if (defRand < arr.defense) {
            teamPoints = teamPoints + 1;
            console.log(chalk.green(arr.name + "'s defense scochalk.red a point!"))
        } else {
            console.log(chalk.blue("\nGame is Tied!\n"))
        }
    })
    //displays if you won the round or lost the round as well as the updated team score
    if (teamPoints > 0) {
        console.log(chalk.green.bold.underline("\nYou're Winning!y\nTeam score: " + teamPoints))
    } else {
        console.log(chalk.red.bold.underline("\nYou're Losing!\nTeam score: " + teamPoints))
    }
    //adjust game count to play total of 5 games
    gameCount = gameCount - 1;
    //run game again and allow for substitution
    startGame();
}

//allows you to play again and decide on creating a new team, or keeping your current team.
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
            if (resp.rematch && resp.newTeam === false) {
                //if you want to keep the same team
                startGame();
            } else if (resp.rematch && resp.newTeam) {
                //if you want to create a new team
                count = 1;
                playerArray = [];
                starterArray = [];
                subArray = [];
                addPlayer();
            } else {
                //if you don't want to play again at all
                console.log("\nPlay again soon!")
            }
        })
}

//starts the game
addPlayer();