/* window.js
 *
 * Copyright 2025 pj
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

export const TestWindow = GObject.registerClass({
    GTypeName: 'TestWindow',
}, class TestWindow extends Adw.ApplicationWindow {
    constructor(properties) {
        super(properties);

        const builder = new Gtk.Builder();
        builder.add_from_resource('/org/gnome/Example/js/window.ui');

        const content = builder.get_object('content_box');
        this.set_content(content);

        this._game_grid = builder.get_object('game_grid');
        this._status_label = builder.get_object('status_label');
        this._new_game_button = builder.get_object('new_game_button');
        this._reset_button = builder.get_object('reset_button');

        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.playerScore = 0;
        this.computerScore = 0;
        this.cellButtons = [];

        this.createGameGrid();
        this.initializeGame();

        this._new_game_button.connect('clicked', this.on_new_game_clicked.bind(this));
        this._reset_button.connect('clicked', this.on_reset_clicked.bind(this));
    }

    createGameGrid() {
        // Create 3x3 grid of buttons
        for (let i = 0; i < 3; i++) {
            this.cellButtons[i] = [];
            for (let j = 0; j < 3; j++) {
                const button = new Gtk.Button({
                    width_request: 80,
                    height_request: 80,
                    visible: true,
                    can_focus: true,
                });

                button.connect('clicked', () => {
                    this.on_cell_clicked(button, i, j);
                });

                this._game_grid.attach(button, j, i, 1, 1);
                this.cellButtons[i][j] = button;
            }
        }
    }

    initializeGame() {
        // Initialize the board array
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear all buttons
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const button = this.cellButtons[i][j];
                button.label = '';
                button.sensitive = true;
            }
        }
        
        this.updateStatus();
    }

    getCellButton(row, col) {
        return this.cellButtons[row][col];
    }

    on_cell_clicked(button, row, col) {
        if (!this.gameActive) return;
        
        const index = row * 3 + col;
        
        // Check if cell is empty
        if (this.board[index] !== '') return;
        
        // Player's move
        this.makeMove(index, 'X');
        
        // Check for game end
        if (this.checkGameEnd()) return;
        
        // Computer's move
        this.makeComputerMove();
        
        // Check for game end again
        this.checkGameEnd();
    }

    makeMove(index, player) {
        this.board[index] = player;
        const row = Math.floor(index / 3);
        const col = index % 3;
        const button = this.getCellButton(row, col);
        button.label = player;
        button.sensitive = false;
    }

    makeComputerMove() {
        // Simple AI: find best move using minimax algorithm
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove, 'O');
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                const score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinner(board);
        
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        if (this.isBoardFull(board)) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkWinner(board = this.board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        for (const line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        return null;
    }

    isBoardFull(board = this.board) {
        return board.every(cell => cell !== '');
    }

    checkGameEnd() {
        const winner = this.checkWinner();
        
        if (winner) {
            this.gameActive = false;
            if (winner === 'X') {
                this.playerScore++;
                this._status_label.label = 'You win! 🎉';
            } else {
                this.computerScore++;
                this._status_label.label = 'Computer wins! 😔';
            }
            return true;
        }
        
        if (this.isBoardFull()) {
            this.gameActive = false;
            this._status_label.label = 'It\'s a draw! 🤝';
            return true;
        }
        
        return false;
    }

    updateStatus() {
        if (this.gameActive) {
            this._status_label.label = `Your turn (X) - Score: You ${this.playerScore} - Computer ${this.computerScore}`;
        }
    }

    on_new_game_clicked() {
        this.initializeGame();
    }

    on_reset_clicked() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.initializeGame();
    }
});
