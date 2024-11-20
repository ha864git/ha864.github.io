import { Slog } from "./Slog.js";

export class Board {

    data = [];
    data_org = [];
    error = false;
    slog = new Slog();

    constructor() {
        for (let i = 0; i < 9; i++) this.data.push(Array(9).fill(0));
        for (let i = 0; i < 9; i++) this.data_org.push(Array(9).fill(0));
        this.slog.clear();
        console.log("Board initialized");
    }

    clear() {
        this.setOriginal("000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        this.slog.clear();
        this.error = false;
    }

    getCell(row, column) {
        return this.data[row][column];
    }

    setCell(row, column, number) {
        this.data[row][column] = number;
        this.slog.add(row, column, number);
        return this.#checkError(row, column);
    }

    clearError(error) {
        if (error) {
            this.slog.clearError(error);
        }
    }

    getUndo() {
        let answer = this.slog.undo();
        if (answer.length > 0) {
            this.data[answer[0][0]][answer[0][1]] = 0;
        }
        return answer;
    }

    getRedo() {
        let answer = this.slog.redo();
        if (answer.length > 0) {
            this.data[answer[0][0]][answer[0][1]] = answer[0][2];
        }
        return answer;
    }

    memIn() {
        this.data.forEach((line, row) => {
            line.forEach((cell, column) => {
                this.data_org[row][column] = cell;
            })
        });
        this.slog.clear();

        let str = "";
        this.data.forEach(line => {
            str += line.join("");
        });
        console.log(str);
    }

    memOut() {
        this.data_org.forEach((line, row) => {
            line.forEach((cell, column) => {
                this.data[row][column] = cell;
            })
        });
        this.slog.clear();
    }

    #checkError(row, col) {
        const colBase = Math.floor(col / 3) * 3;
        const rowBase = Math.floor(row / 3) * 3;
        if (this.data[row][col] == 0) {
            return false;
        } else {
            for (let i = 0; i < 9; i++) {
                if (i != col) {
                    if (this.data[row][col] == this.data[row][i]) { return true; }
                }
            }
            for (let j = 0; j < 9; j++) {
                if (j != row) {
                    if (this.data[row][col] == this.data[j][col]) { return true; }
                }
            }
            for (let j = rowBase; j < rowBase + 3; j++) {
                for (let i = colBase; i < colBase + 3; i++) {
                    if (i != col && j != row) {
                        if (this.data[row][col] == this.data[j][i]) { return true; }
                    }
                }
            }
        }
        return false;
    }

    isOriginal(row, column) {
        return (this.data_org[row][column] != 0);
    }

    setOriginal(str) {
        const arr = [...str];
        this.data.forEach((line, row) => {
            line.forEach((cell, col) => {
                cell = parseInt(arr[row * 9 + col]);
                this.data[row][col] = cell;
                this.data_org[row][col] = cell;
            });
        });
    }

    listNumberOfTimes() {
        const work = this.data.flat();
        let answer = [];
        for (let i = 0; i < 9; i++) {
            answer.push(work.filter(n => n === (i + 1)).length);
        }
        return answer;
    }

}
