export class Slog {

    slog = [];
    undoCounter = 0;

    constructor() {
        this.slog = [];
        this.undoCounter = 0;
        console.log("Slog initialized");
    }

    clear() {
        this.slog = [];
        this.undoCounter = 0;
    }

    add(row, column, number) {
        while (this.undoCounter > 0) {
            this.slog.pop();
            this.undoCounter -= 1;
        }
        this.slog.push([row, column, number]);
    }

    clearError(error) {
        if (error) {
            while (this.undoCounter > 0) {
                this.slog.pop();
                this.undoCounter -= 1;
            }    
        }
    }

    undo() {
        let answer = [];
        if (this.slog.length > 0) {
            if (this.undoCounter < this.slog.length) {
                this.undoCounter += 1;
                let p = this.slog.length - this.undoCounter;
                answer.push(this.slog[p]);
                p -= 1;
                if (p >= 0) {
                    answer.push(this.slog[p]);
                }
            }
        }
        return answer;
    }

    redo() {
        let answer = [];
        if (this.slog.length > 0) {
            if (this.undoCounter > 0) {
                const p = this.slog.length - this.undoCounter;
                answer.push(this.slog[p]);
                this.undoCounter -= 1;
            }
        }
        return answer;
    }

}
