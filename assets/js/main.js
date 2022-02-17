'use strict'

// カードを用意
const cards = [];
const marks = ['spade', 'heart', 'diamond', 'club'];
function prepareCards() {
  for (let num = 1; num <= 13; num++) {
    for (let i = 0; i < 4; i++){
      const card = {num: num, mark: marks[i]};
      cards.push(card);
    }
  }
};

// カードをシャッフル
function cardShuffle() {
  let random = 0;
  let tmp = [];
  for (let i = (cards.length -1); i > 0; i--) {
    random = Math.floor(Math.random() * (i + 1));
    tmp = cards[i];
    cards[i] = cards[random];
    cards[random] = tmp;
  }
  return cards;
}

// ディーラーが2枚ドロー（1枚は表示）
let dealCounter = 0;
let dealerPoints = 0;
const dealersHand = [];
function dealDealer() {
  for (let i = 0; i < 2; i++) {
    dealersHand.push(cards[dealCounter++]);
    const cardNum = dealersHand[i].num;
    const cardMark = dealersHand[i].mark;
    if (i === 0) {
      $('#dealer-cards').append(`<div class='card-animation reverse ${cardMark}${cardNum}'></div>`).fadeIn('slow');
    } else {
      $('#dealer-cards').append(`<div class='card-animation ${cardMark}${cardNum}'></div>`).fadeIn('slow');
    }
  };
  dealerPoints = pointCheck(dealersHand);
  $('#dealer-points').append(`<div>Points: ???</div>`);
};

// プレイヤーが2枚ドロー
let playerPoints = 0;
const playersHand = [];
function dealPlayer() {
  for (let i = 0; i < 2; i++) {
    playersHand.push(cards[dealCounter++]);
    const cardNum = playersHand[i].num;
    const cardMark = playersHand[i].mark;
    $('#player-cards').append(`<div class='card-animation ${cardMark}${cardNum}'></div>`);
  };
  playerPoints = pointCheck(playersHand);
  $('#player-points').append(`<div>Points: ${playerPoints}</div>`);

  $('button').removeClass('cant-use');
};

// 点数チェック
let totalPoints = 0;
function pointCheck(array) {
  totalPoints = 0;
  for (let i = 0; i < array.length; i++) {
    let point = 0;
    point = array[i].num;
    if (point >= 11) {
      point = 10;
    };
    totalPoints += point;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].num === 1 && totalPoints <= 11){
      totalPoints += 10;
    }
  }
  return totalPoints;
}

//  プレイヤーがヒット（1枚引く）

$('#hit-button').on('click', function() {
  playersHand.push(cards[dealCounter]);

  const playersLastestcard = dealCounter++ - dealersHand.length
  const cardNum = playersHand[playersLastestcard].num;
  const cardMark = playersHand[playersLastestcard].mark;
  $('#player-cards').append(`<div class='card-animation ${cardMark}${cardNum}'></div>`);

  playerPoints = pointCheck(playersHand);
  $('#player-points > div').text(`Points: ${playerPoints}`);

  if (playerPoints > 21) {
    burstHand('player');
  };
});

// プレイヤーがスタンド
$('#stand-button').on('click', function() {
  $('#hit-button').addClass('cant-use');
  dealerHit();
});

// ＆ ディーラーが可能な限りヒット
function dealerHit() {
  dealerPoints = pointCheck(dealersHand);
  while(dealerPoints <= 17) {
    dealersHand.push(cards[dealCounter]);

    const dealersLastestcard = dealCounter++ - playersHand.length;
    const cardNum = dealersHand[dealersLastestcard].num;
    const cardMark = dealersHand[dealersLastestcard].mark;
    $('#dealer-cards').append(`<div class='card-animation ${cardMark}${cardNum}'></div>`);

    dealerPoints = pointCheck(dealersHand);
    $('#dealer-points').text(`Points: ${dealerPoints}`);
  };

  if (dealerPoints > 21) {
    burstHand('dealer');
  } else {
    decideWinner();
  }
};

// 勝敗を決める
function decideWinner() {
  dealerCardOpen();
  if (playerPoints > dealerPoints) {
    $('#result').append('<div>プレイヤーの勝利</div>');
  } else {
    $('#result').append('<div>ディーラーの勝利</div>');
  };
  $('#stand-button').addClass('cant-use');
}

// バーストの処理
function burstHand (burster) {
  dealerCardOpen();
  if (burster === 'player') {
    $('#result').append('<div>プレイヤーの手札がバースト<br>ディーラーの勝利</div>');
  } else if (burster === 'dealer') {
    $('#result').append('<div>ディーラーの手札がバースト<br>プレイヤーの勝利</div>');
  }
  $('#stand-button').addClass('cant-use');
  $('#hit-button').addClass('cant-use')
}

function dealerCardOpen() {
  $('.reverse').removeClass('reverse');
  $('#dealer-points').text(`Points: ${dealerPoints}`);
}

$('#start-game').on('click', function() {
  $(this).addClass('new-game');
  $(this).text('New Game')
  $('button').addClass('cant-use');
  $('.hidden').removeClass('hidden');
  dealCounter = 0;
  cards.length = 0;
  dealersHand.length = 0;
  playersHand.length = 0;
  $('.restart').empty();
  prepareCards();
  cardShuffle();
  dealDealer();
  dealPlayer();
});
