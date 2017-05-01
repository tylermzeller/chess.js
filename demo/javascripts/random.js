var board,
  game = new Chess();
var summons = [game.ELEPHANT, game.HAWK];

var cursorX;
var cursorY;

var summon_castle = false;

document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if (summon_castle) return false;
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }


};

var makeRandomMove = function() {
  var possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;

  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());
};

var get_promotion_choice = function(callback) {
  var num_buttons = 6;

  var popup = $("<div>", {id: "summon-control", "class": "controls"});
  var queen_button = $("<div>", {id: "promote-queen-button", "class": "control-button queen-button"});
  var rook_button = $("<div>", {id: "promote-rook-button", "class": "control-button rook-button"});
  var bishop_button = $("<div>", {id: "promote-bishop-button", "class": "control-button bishop-button"});
  var knight_button = $("<div>", {id: "promote-knight-button", "class": "control-button knight-button"});
  var elephant_button = $("<div>", {id: "promote-elephant-button", "class": "control-button elephant-button"});
  var hawk_button = $("<div>", {id: "promote-hawk-button", "class": "control-button hawk-button"});

  popup.css({
    left: cursorX + 'px',
    top: cursorY + 'px',
    width: (num_buttons * 100) + 'px',
  });

  queen_button.append('<img src="../img/chesspieces/wikipedia/wQ.png" alt="Queen Chess Piece">');
  // set on click listener
  queen_button.on('click', function(e){
    callback(game.QUEEN);
    popup.remove();
  });

  hawk_button.append('<img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Chess_alt45.svg" alt="Hawk Chess Piece">');
  // set on click listener
  hawk_button.on('click', function(e){
    callback(game.HAWK);
    popup.remove();
  });

  elephant_button.append('<img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Chess_clt45.svg" alt="Elephant Chess Piece">');
  // Set on click listener
  elephant_button.on('click', function(e){
    callback(game.ELEPHANT);
    popup.remove();
  });

  rook_button.append('<img src="../img/chesspieces/wikipedia/wR.png" alt="Rook Chess Piece">');
  // set on click listener
  rook_button.on('click', function(e){
    callback(game.ROOK);
    popup.remove();
  });

  bishop_button.append('<img src="../img/chesspieces/wikipedia/wB.png" alt="Bishop Chess Piece">');
  // set on click listener
  bishop_button.on('click', function(e){
    callback(game.BISHOP);
    popup.remove();
  });

  knight_button.append('<img src="../img/chesspieces/wikipedia/wN.png" alt="Knight Chess Piece">');
  // set on click listener
  knight_button.on('click', function(e){
    callback(game.KNIGHT);
    popup.remove();
  });

  popup.append(queen_button, elephant_button, hawk_button, rook_button,
    bishop_button, knight_button);

  $('body').append(popup);
};

var get_summon_choice = function(callback) {
  // present popup to user to click
  var popup = $("<div>", {id: "summon-control", "class": "controls"});
  var hawk_button;
  var elephant_button;

  // Always have a defer button
  var num_buttons = 1;

  // Checking if we have a hawk in hand
  if (summons.indexOf(game.HAWK) > -1){
    hawk_button = $("<div>", {id: "summon-hawk-button", "class": "control-button hawk-button"});
    num_buttons++;
  }

  // Checking if we have an elephant in hand
  if (summons.indexOf(game.ELEPHANT) > -1){
    elephant_button = $("<div>", {id: "summon-elephant-button", "class": "control-button elephant-button"});
    num_buttons++;
  }

  // always have a defer button
  var defer_button = $("<div>", {id: "summon-defer-button", "class": "control-button defer-button"});

  // No pieces to summon, so don't need a popup at all
  if (num_buttons === 1){
    callback('defer');
    return;
  }

  popup.css({
    left: cursorX + 'px',
    top: cursorY + 'px',
    width: (num_buttons * 100) + 'px',
  });

  if (hawk_button) {
    hawk_button.append('<img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Chess_alt45.svg" alt="Hawk Chess Piece">');
    // set on click listener
    hawk_button.on('click', function(e){
      callback(game.HAWK);
      popup.remove();
    });

    // Add to control
    popup.append(hawk_button);
  }

  // If there is an elephant button, set it up.
  if (elephant_button){
    elephant_button.append('<img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Chess_clt45.svg" alt="Elephant Chess Piece">');
    // Set on click listener
    elephant_button.on('click', function(e){
      callback(game.ELEPHANT);
      popup.remove();
    });

    // Add to control
    popup.append(elephant_button);
  }

  defer_button.append('<img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Grey_close_x.svg" alt="Gray close button">');

  // Set on click listener
  defer_button.on('click', function(e){
    callback('defer');
    popup.remove();
  });

  popup.append(defer_button);

  $('body').append(popup);
};

var get_summon_to = function(color, kside, callback) {
  // Set opacity for all squares to start
  $('.white-1e1d7').css({ opacity: 0.1, });
  $('.black-3c85d').css({ opacity: 0.1, });

  var sq1, sq2, sq1_to, sq2_to;

  if (color === game.WHITE){
    sq1 = $('.square-e1');
    sq1_to = 'e1';
    if (kside){
      sq2 = $('.square-h1');
      sq2_to = 'h1';
    } else {
      sq2 = $('.square-a1');
      sq2_to = 'a1';
    }
  } else {
    sq1 = $('.square-e8');
    sq1_to = 'e8';
    if (kside){
      sq2 = $('.square-h8');
      sq2_to = 'h8';
    } else {
      sq2 = $('.square-a8');
      sq2_to = 'a8';
    }
  }

  // Make the two summon squares the only selectable squares
  sq1.css({ opacity: 1, });
  sq2.css({ opacity: 1, });

  summon_castle = true;

  sq1.children('img').on('click', function(e){
    callback(sq1_to);
    summon_castle = false;
    $('.white-1e1d7').css({ opacity: 1, });
    $('.black-3c85d').css({ opacity: 1, });
    sq1.children('img').off('click');
  });

  sq2.children('img').on('click', function(e){
    callback(sq2_to);
    summon_castle = false;
    $('.white-1e1d7').css({ opacity: 1, });
    $('.black-3c85d').css({ opacity: 1, });
    sq2.children('img').off('click');
  });
};

var show_checkmate = function() {
  var popup = $('<div>', {id: "checkmate-control", "class": "checkmate"});

  popup.css({
    width: '250px',
    height: '250px',
    position: 'absolute',
    top: '40%',
    left: '40%',
    border: '1px solid black',
    background: '#f22652',
    'text-align': 'center',
    'font-family': 'sans-serif',
    'font-size': '20pt',
    'font-weight': 'bold',
  });

  var p = $('<p> Checkmate! </p>');
  var restart = $('<div>', {id: "restart-button", "class": "restart-button"});
  restart.html('Restart');
  restart.on('click', function(e){
    game.reset(); // Do this before updating the board. Or else onChange will detect checkmate twice.
    board.position('start');
    summons = [game.ELEPHANT, game.HAWK];
    popup.remove();
  });
  popup.append(p, restart);

  $('body').append(popup);
};

var onDrop = function(source, target) {
  var make_move = function(candidate) {
    move = game.move(candidate);
    // illegal move
    if (move === null) return 'snapback';

    board.position(game.fen(), false);

    // make random legal move for black
    window.setTimeout(makeRandomMove, 250);
  };

  var make_summon_move = function(candidate) {
    var move = game.move(candidate)

    if (move == null) return 'snapback';

    if (move.summon) {
      var idx = summons.indexOf(move.summon);
      summons.remove(idx);
    }

    board.position(game.fen(), false);

    // make random legal move for black
    window.setTimeout(makeRandomMove, 250);
  };
  // see if the move is legal
  var piece = game.get(source);
  var candidate = {
    from: source,
    to: target,
    promotion: 'q', // add this incase we are trying to move a pawn to the last
                    // rank. Otherwise, the move will come back null and appear
                    // to be illegal.
  };
  var kside_castle = false;
  var qside_castle = false;
  var promotion = false;

  // Move just to check if legal
  var move = game.move(candidate);

  // illegal move
  if (move === null) return 'snapback';

  kside_castle = move.flags.search(/k/) !== -1;
  qside_castle = move.flags.search(/q/) !== -1;
  promotion    = move.flags.search(/p/) !== -1;

  // Move is legal, undo it and check if a summon move
  game.undo();

  // Check if piece is not pawn, elephant, or hawk and hasn't moved from start pos
  if (piece != null && piece.type != game.PAWN && piece.type != game.ELEPHANT &&
     piece.type != game.HAWK && !game.moved_from_start(piece, source)) {
     get_summon_choice(function(choice) {
       // What to do if summon
       if (choice == game.HAWK || choice == game.ELEPHANT) {
         candidate.summon = choice;
       }

       if ((choice == game.HAWK || choice == game.ELEPHANT) && (kside_castle || qside_castle)) {
         get_summon_to(move.color, kside_castle, function(to){
           if (to){
             candidate.summon_to = to;

             make_summon_move(candidate);
           }
         });
       } else {
         make_summon_move(candidate);
       }
     });
  } else if (promotion) {
    get_promotion_choice(function(choice) {
      candidate.promotion = choice;

      make_move(candidate);
    });
  } else {
    // We know this move isn't a summon move, so just move like normal
    make_move(candidate);
  }
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen(), false);
};

var onChange = function() {
  if (game.in_checkmate()){
    show_checkmate();
  }
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onChange: onChange,
};
board = ChessBoard('board', cfg);
