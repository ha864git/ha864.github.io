export class Smode {

    selected_row = -1;
    selected_col = -1;
    markNumber = 0;

    constructor() {
        this.clear();
        console.log("Smode initialized");
    }

    clear() {
        this.selected_row = -1;
        this.selected_col = -1;
        this.markNumber = 0;
    }

    setSelected(row, col) {
        this.selected_row = row;
        this.selected_col = col;
        this.markNumber = 0;
    }

    isSelected() {
        return this.selected_col >= 0;
    }

    getSelected() {
        return [this.selected_row, this.selected_col];
    }

    setMarkedNumber(number) {
        this.selected_row = -1;
        this.selected_col = -1;
        this.markNumber = number;
    }

    isMarked() {
        return this.markNumber > 0;
    }

    getMarkedNumber() {
        return this.markNumber;
    }

}
