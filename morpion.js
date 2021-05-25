class Morpion {
	humanPlayer = 'J1';
	iaPlayer = 'J2';
  turn = 0;
	gameOver = false;

	gridMap = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	];

	currentStrategy = null;

	constructor(firstPlayer = 'J1') {
		this.humanPlayer = firstPlayer;
		this.iaPlayer = (firstPlayer === 'J1') ? 'J2' : 'J1';
		if(localStorage.getItem('turn-1')) {
			this.initLocalStorage();
		} else {
			this.initGame();
		};
	}

	initGame = () => {
		this.gridMap.forEach((line, y) => {
			line.forEach((cell, x) => {
				this.getCell(x, y).onclick = () => {
					this.doPlayHuman(x, y);
				};
			});
		});

		this.undo();
		this.redo();
		this.currentStrategy = new HardDifficultyStrategy(this.humanPlayer, this.iaPlayer, this.turn, this.getBoardWinner);
		this.setIADifficulty();

		if (this.iaPlayer === 'J1') {
			this.doPlayIa();
		}
	}

	initLocalStorage = () => {
		for (let i = 1; i < 10; i++){
			let data = localStorage.getItem(`turn-${i}`);
    	if(data) {
				let turnInfos = JSON.parse(data);
				let cells = turnInfos.cell.split(',');
				let x = parseInt(cells[0]);
				let y = parseInt(cells[1]);
				this.gridMap[y][x] = turnInfos.player;
				this.turn = i;
				this.getCell(x, y).classList.add(`filled-${turnInfos.player}`);
			} else {
				break
			}
		}

		this.initGame();
	}

	getCell = (x, y) => {
		const column = x + 1;
		const lines = ['A', 'B', 'C'];
		const cellId = `${lines[y]}${column}`;
		return document.getElementById(cellId);
	}

    getBoardWinner = (board) => {
        const isWinningRow = ([a, b, c]) => (
            a !== null && a === b && b === c
        );

        let winner = null;

        board.forEach((line) => {
            if (isWinningRow(line)) {
                winner = line[0];
            }
        });

        [0, 1, 2].forEach((col) => {
            if (isWinningRow([board[0][col], board[1][col], board[2][col]])) {
                winner = board[0][col];
            }
        });

        if (winner) {
            return winner;
        }

        const diagonal1 = [board[0][0], board[1][1], board[2][2]];
        const diagonal2 = [board[0][2], board[1][1], board[2][0]];
        if (isWinningRow(diagonal1) || isWinningRow(diagonal2)) {
            return board[1][1];
        }

        const isFull = board.every((line) => (
			line.every((cell) => cell !== null)
		));
        return isFull ? 'tie' : null;
    }

	checkWinner = (lastPlayer) => {
        const winner = this.getBoardWinner(this.gridMap);
        if (!winner) {
            return;
        }

        this.gameOver = true;
        switch(winner) {
            case 'tie':
			    this.displayEndMessage("Vous êtes à égalité !");
                break;
            case this.iaPlayer:
                this.displayEndMessage("L'IA a gagné !");
                break;
            case this.humanPlayer:
                this.displayEndMessage("Tu as battu l'IA !");
                break;
        }
	}

	displayEndMessage = (message) => {
		const endMessageElement = document.getElementById('end-message');
		endMessageElement.textContent = message;
		endMessageElement.style.display = 'block';
		localStorage.clear();
	}

	drawHit = (x, y, player) => {
		if (this.gridMap[y][x] !== null) {
			return false;
		}

		this.gridMap[y][x] = player;
    this.turn += 1;
		this.getCell(x, y).classList.add(`filled-${player}`);
		let turnInfos = {
			"player": `${player}`,
			"cell": `${[x, y]}`
		};
		localStorage.setItem(`turn-${this.turn}`, JSON.stringify(turnInfos));
		this.checkWinner(player);
		return true;
	}

	doPlayHuman = (x, y) => {
		if (this.gameOver) {
			return;
		}

		if (this.drawHit(x, y, this.humanPlayer)) {
			this.doPlayIa();
		}
	}

	doPlayIa = () => {
		if (this.gameOver) {
			return;
		}

		const { x, y } = this.currentStrategy.nextMove(this.gridMap, 0, -Infinity, Infinity, true)
    this.drawHit(x, y, this.iaPlayer);
	}

	undo = () => {
		const undoButton = document.querySelector('.undo-button');
		undoButton.addEventListener("click", (event) => {
			event.preventDefault();
			let turn = this.turn + 1;
			if(turn <= 1) {
				console.warn('Vous ne pouvez pas revenir plus en arrière');
			} else {
				for(let i = turn - 1; i >= turn - 2; i--) {
					let turnInfos = JSON.parse(localStorage.getItem(`turn-${i}`));
					let cells = turnInfos.cell.split(',');
					let x = parseInt(cells[0]);
					let y = parseInt(cells[1]);
					this.gridMap[y][x] = null;
					this.getCell(x, y).classList.remove(`filled-${turnInfos.player}`);
					this.turn -= 1;
				}
			}
		})
	};

	redo = () => {
		const redoButton = document.querySelector('.redo-button');
		redoButton.addEventListener("click", (event) => {
			event.preventDefault();
			let turn = this.turn;
			if(!localStorage.getItem(`turn-${turn + 2}`)) {
				console.warn('Aucun coup à refaire.');
			} else {
				for(let i = turn + 1; i <= turn + 2; i++) {
					let turnInfos = JSON.parse(localStorage.getItem(`turn-${i}`));
					let cells = turnInfos.cell.split(',');
					let x = parseInt(cells[0]);
					let y = parseInt(cells[1]);
					this.gridMap[y][x] = turnInfos.player;
					this.getCell(x, y).classList.add(`filled-${turnInfos.player}`);
					this.turn += 1;
				}
			}
		})
	};

	setIADifficulty = () => {
		let difficultyButtons = document.querySelectorAll('.difficulty-button');
		difficultyButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				switch (button.id) {
					case 'easy-difficulty':
						this.currentStrategy = new EasyDifficultyStrategy(this.humanPlayer, this.iaPlayer, this.turn, this.getBoardWinner)
						break;
					case 'medium-difficulty':
						this.currentStrategy = new MediumDifficultyStrategy(this.humanPlayer, this.iaPlayer, this.turn, this.getBoardWinner)
						break;
					case 'hard-difficulty':
						this.currentStrategy = new HardDifficultyStrategy(this.humanPlayer, this.iaPlayer, this.turn, this.getBoardWinner)
						break;
				}
			});
		});
	};
}
