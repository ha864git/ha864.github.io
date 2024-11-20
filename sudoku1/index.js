"use strict";

import { Board } from "./src/Board.js";
import { Smode } from "./src/Smode.js";

const board = new Board();
const smode = new Smode();

let error = false;

window.onload = function () {
    for (let i = 0; i < 9; i++) {
        document.getElementById("td" + i).innerHTML = makeCells(i);
    }
    for (let i = 0; i < 3; i++) {
        document.getElementById("inp" + i).innerHTML = makeKeys(i);
    }
    updateAll();
}

window.selectbutton = selectbutton;
function selectbutton(obj) {
    if (error) return;
    let str_id = obj.id;
    let temp = str_id.split("_");
    let row = Number(temp[1]);
    let col = Number(temp[2]);
    const n = board.getCell(row, col);
    if (n == 0) {
        smode.setSelected(row, col);
    } else {
        smode.setMarkedNumber(n);
    }
    updateAll();
}

window.setbutton = setbutton;
function setbutton(obj) {
    if (error) return;
    const n = Number(obj.id.split("_")[1]) + 1;
    if (smode.isSelected()) {
        const [selected_row, selected_col] = smode.getSelected();
        if (board.getCell(selected_row, selected_col) == 0) {
            error = board.setCell(selected_row, selected_col, n);
        } else {
            smode.setMarkedNumber(n);
        }
    } else {
        smode.setMarkedNumber(n);
    }
    updateAll();
}

window.undo = undo;
function undo() {
    smode.clear();
    const lst = board.getUndo();
    if (lst.length > 1) {
        const row = lst[1][0];
        const col = lst[1][1];
        smode.setSelected(row, col);
    }
    board.clearError(error);
    error = false;
    updateAll();
}

window.redo = redo;
function redo() {
    if (error) return;
    smode.clear();
    const lst = board.getRedo();
    if (lst.length > 0) {
        const row = lst[0][0];
        const col = lst[0][1];
        smode.setSelected(row, col);
    }
    updateAll();
}

window.memory_in = memory_in;
function memory_in() {
    if (error) return;
    board.memIn();
    smode.clear();
    updateAll();
}

window.memory_out = memory_out;
function memory_out() {
    if (error) return;
    board.memOut();
    smode.clear();
    updateAll();
}

window.dtclear = dtclear;
function dtclear() {
    error = false;
    board.clear();
    smode.clear();
    updateAll();
}

function makeCells(n) {
    const col_base = (n % 3) * 3;
    const row_base = Math.floor(n / 3) * 3;
    let ht = "<table><tbody>";
    for (let row = row_base; row < row_base + 3; row++) {
        ht += "<tr>";
        for (let col = col_base; col < col_base + 3; col++) {
            ht += "<td><button id=\"button_" + row + "_" + col + "\" class=\"tbutton\" type=\"button\"  onclick=\"selectbutton(this)\">　</button></td>";
        }
        ht += "</tr>";
    }
    ht += "</tbody></table>"
    return ht;
}

function makeKeys(n) {
    const x = n * 3;
    let ht = "<table><tbody>";
    ht += "<tr>";
    for (let j = x; j < x + 3; j++) {
        ht += "<td><button id=\"num_" + j + "\" class=\"kbutton\" type=\"button\"  onclick=\"setbutton(this)\">" + (j + 1) + "</button></td>";
    }
    ht += "</tr><tr>";
    for (let j = x; j < x + 3; j++) {
        ht += "<td><p id=\"na_" + j + "\" class=\"cellnum\">9</p></td>";
    }
    ht += "</tr>";
    ht += "</tbody></table>"
    return ht;
}

function updateAll() {
    clearCellColor();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const n = board.getCell(row, col);
            if (n == 0) {
                document.getElementById('button_' + row + '_' + col).textContent = "　";
                if (smode.isSelected()) {
                    const [selected_row, selected_col] = smode.getSelected();
                    if (selected_row == row && selected_col == col) {
                        document.getElementById('button_' + row + '_' + col).classList.add('button_pink');
                    }
                }
            } else {
                document.getElementById('button_' + row + '_' + col).textContent = n;
                if (smode.isMarked()) {
                    if (smode.getMarkedNumber() == n) {
                        document.getElementById('button_' + row + '_' + col).classList.add('button_cyan');
                    }
                } else if (smode.isSelected()) {
                    const [selected_row, selected_col] = smode.getSelected();
                    if (selected_row == row && selected_col == col) {
                        if (error) {
                            document.getElementById('button_' + row + '_' + col).classList.add('button_red');
                        } else {
                            document.getElementById('button_' + row + '_' + col).classList.add('button_blue');
                        }
                    } else if (error && n == board.getCell(selected_row, selected_col)) {
                        document.getElementById('button_' + row + '_' + col).classList.add('button_orange');
                    }
                }
                if (board.isOriginal(row, col)) {
                    document.getElementById('button_' + row + '_' + col).classList.add('button_bold');
                }
            }
        }
        const lst = board.listNumberOfTimes();
        lst.forEach((value, index) => {
            document.getElementById('na_' + index).innerHTML = 9 - value;
        });
    }
}

function clearCellColor() {
    const color = ["button_blue", "button_pink", "button_cyan", "button_orange", "button_red", "button_bold"];
    color.forEach(cl => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                document.getElementById('button_' + row + '_' + col).classList.remove(cl);
            }
        }
    });
}
