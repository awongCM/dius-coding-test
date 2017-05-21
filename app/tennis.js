//tennis.js

var Match = function(player1, player2) {
	this.player1 = player1;
	this.player2 = player2;
	this.scoreBoard = [0,0];// assumes first element is player1's score and second element is player2's score
	this.scoreBoardMessage = "";
	this.isTieBreakGame = false;

	this.showScoreBoard = function() {
		var displayScoreBoard = getScoreBoardRepresentation(this.scoreBoard, this.scoreBoardMessage);

		return getPlayerGamesWonCount(this.player1, this.player2) + displayScoreBoard;
	},
	this.pointWonBy = function(player) {
		var deuceGameWon;

		if(this.scoreBoardMessage !== "") {
			deuceGameWon = this.breakDeuceAdvantage(player);
			if (deuceGameWon) {
				this.resetScoreBoard();
				player.addGameWon();
			}
			return;//don't do any tally beyond this point
		}

		if (this.player1.name === player.name) {
			if (this.scoreBoard[0] === 40 ) {
				this.checkIfPlayerWonGame(player);
			} else {
				this.scoreBoard[0] = updateScore(this.scoreBoard[0]);	
			}
		}
		else {
			if (this.scoreBoard[1] === 40) {
				this.checkIfPlayerWonGame(player);
			} else {
				this.scoreBoard[1] = updateScore(this.scoreBoard[1]);	
			}	
		}

		//check to see if both players are in deuce mode
		if (this.scoreBoard[0] === 40 && this.scoreBoard[1] === 40) {
			this.scoreBoardMessage = "Deuce";
		}
	},
	this.breakDeuceAdvantage = function(player) {
		if(this.scoreBoardMessage.indexOf("Deuce") !== -1) {
			this.scoreBoardMessage = ["Advantage", player.name].join(" ");
			return false;	
		}
		else if (this.scoreBoardMessage.indexOf("Advantage") !== -1) {
			if (this.scoreBoardMessage.indexOf(player.name) !== -1) {
				this.scoreBoardMessage = "";
				return true; //the player won the deuce match
			}
			else {
				this.scoreBoardMessage = "Deuce";
				return false;
			}
		}

	},
	//checks if player won game by points	
	this.checkIfPlayerWonGame = function(player) {
		if (!this.isTieBreakGame) {
			if (this.player1.name === player.name) {
				if(this.scoreBoard[0] > this.scoreBoard[1]){
					player1.addGameWon();
				}
			}
			else {
				if(this.scoreBoard[1] > this.scoreBoard[0]){
					player2.addGameWon();
				}
			}
		} else {//game score rules is different in tie break games
			if (this.scoreBoard[0] - this.scoreboard[1] >=2 && this.scoreBoard[0] === 7) {
				player1.addGameWon();
			}
			else if(this.scoreBoard[1] - this.scoreboard[0] >=2 && this.scoreBoard[1] === 7) {
				player2.addGameWon();
			}
		}
		this.resetScoreBoard();
	},
	this.playerGamesWonDifference = function() {
		if (this.player1.totalGamesWon() > this.player2.totalGamesWon()) {
			return this.player1.totalGamesWon() - this.player2.totalGamesWon();
		}else{
			return this.player2.totalGamesWon() - this.player1.totalGamesWon();
		}
	},

	this.tieBreakPointWonBy = function(player) {
		if (this.scoreBoard[0] !== 7 && this.scoreBoard[1] !== 7) {
			if (this.player1.name === player.name) {
				this.scoreBoard[0]++;	 
			} else {
				this.scoreBoard[1]++;
			}

			//check the scores again to be sure who won the match
			if (this.scoreBoard[0] === 7 || this.scoreBoard[1] === 7) {
				this.checkIfPlayerWonGame(player);
			}
		}
		
	},
	this.currentScore = function() {
		return this.scoreBoard[0] + "-" + this.scoreBoard[1];
	}
	this.checkPlayerWonSet = function(){
		if(this.playerGamesWonDifference() >= 2) {
			if(this.player1.totalGamesWon() === 6  || this.player1.totalGamesWon() === 7){
				this.player1.winSet();
				return player1.name;
			}
			else if(this.player2.totalGamesWon() === 6 || this.player1.totalGamesWon() === 7) {
				this.player2.winSet();
				return player2.name;
			}	
		}
		else if(this.playerGamesWonDifference() === 0) {
			isTieBreakGame = true;
			this.resetScoreBoard();
			return "Tie break game to play";
		}
		else if(this.playerGamesWonDifference() === 1) {
			if(this.player1.totalGamesWon() === 7){
				this.player1.winSet();
				return player1.name;
			}
			else if(this.player2.totalGamesWon()  === 7) {
				this.player2.winSet();
				return player2.name;
			}
			else {
				this.resetScoreBoard();
				return "Another game to play";
			}
		}
		else {
			this.resetScoreBoard();
			return "Another game to play";

		}
	},
	this.resetScoreBoard = function() {
		this.scoreBoard = [0,0];
	}
};

var Player = function(name){
	this.name = name;
	this.gamesWon = [];
	this.setWon = false;
	this.totalGamesWon = function() {
		return this.gamesWon.length;
	},
	this.addGameWon = function(){
		this.gamesWon.push(true);
	},
	this.winSet = function(){
		this.setWon = true;
	}
};

//Helper methods

function getPlayerGamesWonCount(player1, player2) {
	return [player1.gamesWon.length, "-", player2.gamesWon.length].join("");
}
function getScoreBoardRepresentation(scoreBoard, scoreBoardMessage){
	if (scoreBoard[0] !== 0 || scoreBoard[1] !== 0) {
		if (scoreBoardMessage !== "") {
			return [", ", scoreBoardMessage].join("");
		}
		else {
			return [", ", scoreBoard[0] , "-" , scoreBoard[1]].join("");	
		}
	}
	else {
		return "";
	}
}

function updateScore(currentScore) {
	if(currentScore === 0 ) {
		return 15;
	}
	else if(currentScore === 15){
		return 30;
	}
	else if(currentScore === 30) {
		return 40;	
	}
}

function updateTieBreakScore(currentScore) {
	return currentScore;
}

module.exports = {
	Match: Match,
	Player: Player
}