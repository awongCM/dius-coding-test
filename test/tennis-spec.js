//tennis-spec.js

'use strict';

var expect = require('chai').expect;

var Tennis = require('../app/tennis.js');

var Player = Tennis.Player;
var Match = Tennis.Match;

describe('Tennis game', function() {
	var match, roger, nadal;
	beforeEach(function () {
		roger = new Player("Roger");
		nadal = new Player("Nadal");
		match = new Match(roger, nadal);
	});

	describe('setup tennis players for the match', function() {	
		
		it('match can only begin with two players on the field', function() {
			expect(roger).to.be.not.undefined;
			expect(nadal).to.be.not.undefined;
			expect(match).to.exist;
		});

		it('players have zero won games to start with' , function() {
			expect(roger.totalGamesWon()).to.equal(0);
			expect(nadal.totalGamesWon()).to.equal(0);
		});
	});

	describe('begin the match...', function() {
		it('should return 15-0 point set', function() {
			match.pointWonBy(roger);
			expect(match.showScoreBoard()).to.equal("0-0, 15-0");
		});

		it('should return 15-15 point set ', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			expect(match.showScoreBoard()).to.equal("0-0, 15-15");

		});

		it('should return 40-15 point set', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(roger);
			
			expect(match.showScoreBoard()).to.equal("0-0, 40-15");
			
		});

		it('roger wins a game after winning 4 points and 2 points more than nadal ', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			
			expect(match.showScoreBoard()).to.equal("1-0");
		});

		it('both roger and nadal be in deuce if both have equal scores', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			
			expect(match.showScoreBoard()).to.equal("0-0, Deuce");
		});

		it('advantage goes to roger ', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.showScoreBoard();
			match.pointWonBy(roger);
			expect(match.showScoreBoard()).to.equal("0-0, Advantage Roger");
		});

		it('advantage goes to nadal ', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.showScoreBoard();
			match.pointWonBy(nadal);
			expect(match.showScoreBoard()).to.equal("0-0, Advantage Nadal");
		});

		it('advantage was to roger, but now back to deuce ', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			expect(match.showScoreBoard()).to.equal("0-0, Deuce");
		});

		it('advantage was to roger, and roger won the game ', function() {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(roger);
			expect(match.showScoreBoard()).to.equal("1-0");
		});

		it('rogers wins 2 games and nadal one game', function () {
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(nadal);
			match.pointWonBy(roger);
			match.pointWonBy(roger);

			match.pointWonBy(nadal);
			match.pointWonBy(nadal);
			match.pointWonBy(nadal);
			match.pointWonBy(nadal);

			match.pointWonBy(roger);
			match.pointWonBy(roger);
			match.pointWonBy(roger);
			match.pointWonBy(roger);

			expect(match.showScoreBoard()).to.equal("2-1");
		});
	});
	
	describe('winning a set ', function() {
		it('roger wins the set if he has 6 game wins and 2 games more than nadal', function() {
			//HACK to populate games won by players
			for (var i = 0; i < 6; i++) {
				roger.addGameWon();
			};
			for (var j = 0; j < 4; j++) {
				nadal.addGameWon();
			};

			expect(match.showScoreBoard()).to.equal("6-4");
			expect(match.playerGamesWonDifference()).to.be.at.least(2);
			expect(match.checkPlayerWonSet()).to.equal("Roger");
		});

		it('another game is play if roger has 6 game wins and nadal has 5 game', function() {
			//HACK to populate games won by players
			for (var i = 0; i < 6; i++) {
				roger.addGameWon();
			};
			for (var j = 0; j < 5; j++) {
				nadal.addGameWon();
			};

			expect(match.showScoreBoard()).to.equal("6-5");
			expect(match.checkPlayerWonSet()).to.equal("Another game to play");
		});

		it('roger wins the set if roger has 7 game wins and nadal has 5 game wins', function() {
			//HACK to populate games won by players
			for (var i = 0; i < 6; i++) {
				roger.addGameWon();
			};
			for (var j = 0; j < 5; j++) {
				nadal.addGameWon();
			};

			expect(match.showScoreBoard()).to.equal("6-5");
			expect(match.checkPlayerWonSet()).to.equal("Another game to play");

			match.pointWonBy(roger);
			match.pointWonBy(roger);
			match.pointWonBy(roger);
			match.pointWonBy(roger);

			expect(match.showScoreBoard()).to.equal("7-5");
			expect(match.checkPlayerWonSet()).to.equal("Roger");
		});

		it('tie-break game begins if both roger and nadal have 6 game wins each ', function () {
			//HACK to populate games won by players
			for (var i = 0; i < 6; i++) {
				roger.addGameWon();
			};
			for (var j = 0; j < 6; j++) {
				nadal.addGameWon();
			};

			expect(match.showScoreBoard()).to.equal("6-6");
			expect(match.checkPlayerWonSet()).to.equal("Tie break game to play");

		});

		it('roger wins the tie break game and the set going for 7-6', function () {
			//HACK to populate games won by players
			for (var i = 0; i < 6; i++) {
				roger.addGameWon();
			};
			for (var j = 0; j < 6; j++) {
				nadal.addGameWon();
			};			

			expect(match.showScoreBoard()).to.equal("6-6");
			expect(match.checkPlayerWonSet()).to.equal("Tie break game to play");
	
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);

			expect(match.showScoreBoard()).to.equal("7-6");
			expect(match.checkPlayerWonSet()).to.equal("Roger");

		});

		it('nadal wins the tie break game and the set going for 6-7', function () {
			//HACK
			for (var i = 0; i < 6; i++) {
				roger.addGameWon();
			};
			for (var j = 0; j < 6; j++) {
				nadal.addGameWon();
			};			

			expect(match.showScoreBoard()).to.equal("6-6");
			expect(match.checkPlayerWonSet()).to.equal("Tie break game to play");
	
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(nadal);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(roger);
			match.tieBreakPointWonBy(nadal);

			expect(match.showScoreBoard()).to.equal("6-7");
			expect(match.checkPlayerWonSet()).to.equal("Nadal");

		});
	});
	
});


