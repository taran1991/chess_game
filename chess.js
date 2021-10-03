
/*1. Создать функцию, генерирующую шахматную доску. При этом можно использовать любые html-теги по своему желанию.
Доска должна быть разлинована соответствующим образом, т.е. чередовать черные и белые ячейки.
Строки должны нумероваться числами от 1 до 8, столбцы – латинскими буквами A, B, C, D, E, F, G, H.
2. Заполнить созданную таблицу буквами, отвечающими за шахматную фигуру, например К – король, Ф – ферзь и т.п.,
причем все фигуры должны стоять на своих местах и быть соответственно черными и белыми.
3. *Заменить буквы, обозначающие фигуры, картинками.*/

var ROW_NUMS = ['', '1', '2', '3', '4', '5', '6', '7', '8', ''];
var ROW_LITERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var BLACK_PAWN = '&#9823;', BLACK_ROOK = '&#9820;', BLACK_KNIGHT = '&#9822;', BLACK_BISHOP = '&#9821;';
var BLACK_KING = '&#9818;', BLACK_QUEEN = '&#9819;';
var WHITE_PAWN = '&#9817;', WHITE_ROOK = '&#9814;', WHITE_KNIGHT = '&#9816;', WHITE_BISHOP = '&#9815;';
var WHITE_KING = '&#9812;', WHITE_QUEEN = '&#9813;'
var BLACK_FIGURES = ['', BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_KING, BLACK_QUEEN,
                     BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK, ''];
var WHITE_FIGURES = ['', WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_KING, WHITE_QUEEN,
                     WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, ''];
var BORDER = 'rgb(101, 59, 43)';
var chosenCell = null, gamer = 'white', is_move = false;


function create_board() {
    var table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    for (var i = 0; i < 10; i++){
        row = document.createElement('tr');
        row.style.height = '50px';
        for (var j = 0; j < 10; j++) {
            var cell = document.createElement('td');
            cell.id = 9 - i + '_' + j;
            cell.onclick = make_a_figure_move
            if (i == 2) {
                cell.innerHTML = BLACK_PAWN
                cell.className = 'black'
            } else if(i == 7) {
                cell.innerHTML = WHITE_PAWN
                cell.className = 'white'
            } else if (i == 1) {
                cell.innerHTML = BLACK_FIGURES[j]
                cell.className = 'black'
            } else if (i == 8) {
                cell.innerHTML = WHITE_FIGURES[j]
                cell.className = 'white'
            }
            if (j == 0 || j == 9){
                cell.innerHTML = ROW_NUMS[9 - i]
                cell.style.backgroundColor = BORDER
                cell.className = ''
                if (j == 9){
                    cell.style.transform = "rotate(180deg)"
                }
            } else if (i == 0 || i == 9) {
                cell.innerHTML = ROW_LITERS[j-1]
                cell.style.backgroundColor = BORDER
                cell.className = ''
                if (i == 0){
                    cell.style.transform = "rotate(180deg)"
                }
            } else if ((j + i) % 2 == 0){
                cell.style.backgroundColor = 'white'
            } else {
                cell.style.backgroundColor = '#795548'
            }
            row.append(cell)
        }
        table.append(row)
    }
    document.getElementById('chessBoard').append(table)
}


function focus() {
    var fig_type = type_of_figure(event.target);
    console.log(2)
    if (fig_type){
        event.target.style.cursor = 'pointer'
    }
}


function move_figure(new_figure_position){
    console.log(is_possible_to_move(chosenCell, new_figure_position))
    if (!is_possible_to_move(chosenCell, new_figure_position)){
        alert('move is not valid')
        chosenCell.style.outline = 'none';
        chosenCell = null;
        return
    }
    new_figure_position.innerHTML = chosenCell.innerHTML;
    new_figure_position.className = chosenCell.className;
    chosenCell.innerHTML = '';
    chosenCell.className = '';
    chosenCell.style.outline = 'none';
    chosenCell = null;
    is_move = true;
}


function make_a_figure_move(event){
    console.log(gamer)
    if (event.target.className == gamer){
        if (chosenCell == null) {
            chosenCell = event.target;
        }
        if (chosenCell.className == event.target.className) {
            chosenCell.style.outline = 'none';
            chosenCell = event.target;
            chosenCell.style.outline = '2px solid red';
        } else if (chosenCell.className != event.target.className) {
            move_figure(event.target);
        }
    } else if(chosenCell){
        move_figure(event.target);
    }
    if (is_move){
        if(gamer == 'white'){
            console.log(1)
            gamer = 'black'
            document.querySelector('#move-header').innerHTML = "Black's move"
        } else{
            console.log(2)
            gamer = 'white'
            document.querySelector('#move-header').innerHTML = "White's move"
        }
        is_move = false
    }
}


function is_possible_to_move(old_position, new_position){
    // y - rows, x - columns
    var coordinates = old_position.id.split('_')
    var old_y = parseInt(coordinates[0]), old_x = parseInt(coordinates[1])
    var coordinates = new_position.id.split('_')
    var new_y = parseInt(coordinates[0]), new_x = parseInt(coordinates[1])
    if (new_y > 8 || new_y < 1 || new_x > 8 || new_x < 1){
        return false
    }
    var char = '&#' + old_position.innerHTML.charCodeAt() + ';' //string representation of chess symbol
        switch(char){
        case BLACK_PAWN:
        case WHITE_PAWN:
            return check_pawn_movement(old_position, new_position, old_y, old_x, new_y, new_x)
        case BLACK_BISHOP:
        case WHITE_BISHOP:
            return check_bishop_movement(old_position, new_position, old_y, old_x, new_y, new_x)
        case BLACK_KNIGHT:
        case WHITE_KNIGHT:
            return check_knight_movement(old_y, old_x, new_y, new_x)
        case BLACK_ROOK:
        case WHITE_ROOK:
            return check_rook_movement(old_position, new_position, old_y, old_x, new_y, new_x)
        case BLACK_KING:
        case WHITE_KING:
            return check_king_movement(old_y, old_x, new_y, new_x)
        case BLACK_QUEEN:
        case WHITE_QUEEN:
            return check_queen_movement(old_position, new_position, old_y, old_x, new_y, new_x);
        default:
            return null;
    }
}

function is_pawn_first_movement(y, position){
    if (y == 7 && position.className == 'black' || y == 2 && position.className == 'white'){
        return true
    }
    return false
}


function check_pawn_movement(old_position, new_position, old_y, old_x, new_y, new_x){
    // direction of pawn movement, if -1 movement from 8 to 1, 1 from 1 to 8
    direction = old_position.className == 'black' ? -1 : 1
    if (new_x == old_x) {
        if (new_position.innerHTML != ''){
            return false
        }
        if (is_pawn_first_movement(old_y, old_position) && (new_y - old_y) * direction < 3){
            return true
        } else if ((new_y - old_y) * direction == 1){
            return true
        }
    } else if((new_y - old_y) * direction == 1 && Math.abs(new_x - old_x) == 1 && old_position.className != new_position.className
              && new_position.className != ''){
        return true
    }
    return false
}

function check_rook_movement(old_position, new_position, old_y, old_x, new_y, new_x){
    if(new_x - old_x == 0){
        direction = new_y > old_y ? 1 : -1
        for (var i = old_y + 1  * direction; i * direction <= (new_y - 1  * direction) * direction; i += 1 * direction){
            var cell = document.getElementById(i + '_' + old_x)
            if(cell.innerHTML != ''){
                return false
            }
        }
        return true
    } else if(new_y - old_y == 0){
        direction = new_x > old_x ? 1 : -1
        for (var i = old_x + 1 * direction; i * direction <= (new_x - 1  * direction) * direction; i += 1 * direction){
            var cell = document.getElementById(old_y + '_' + i)
            if(cell.innerHTML != ''){
                return false
            }
        }
        return true
    return false
    }
}


function check_bishop_movement(old_position, new_position, old_y, old_x, new_y, new_x){
    if(Math.abs(new_x - old_x) == Math.abs(new_y - old_y)){
        yDirection = new_y > old_y ? 1 : -1
        xDirection = new_x > old_x ? 1 : -1
        for (var i = old_y + 1  * yDirection, j = old_x + 1  * xDirection;
             i * yDirection <= (new_y - 1  * yDirection) * yDirection; i += 1 * yDirection, j += 1 * xDirection){
            var cell = document.getElementById(i + '_' + j)
            if(cell.innerHTML != ''){
                return false
            }
        }
        return true
    }
    return false
}


function check_queen_movement(old_position, new_position, old_y, old_x, new_y, new_x){
    return (check_rook_movement(old_position, new_position, old_y, old_x, new_y, new_x) ||
            check_bishop_movement(old_position, new_position, old_y, old_x, new_y, new_x))
    }


function check_knight_movement(old_y, old_x, new_y, new_x){
    if(Math.abs(new_y - old_y) == 2 && Math.abs(new_x - old_x) == 1 ||
       Math.abs(new_y - old_y) == 1 && Math.abs(new_x - old_x) == 2){
        return true
       }
    return false
}


function check_king_movement(old_y, old_x, new_y, new_x){
    if(Math.abs(new_y - old_y) <= 1 && Math.abs(new_x - old_x) <= 1){
        return true
       }
    return false
}


create_board()
