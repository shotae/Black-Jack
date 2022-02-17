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
    cardDeal(dealersHand);
  };
};

// プレイヤーが2枚ドロー
let playerPoints = 0;
const playersHand = [];

function dealPlayer() {
  for (let i = 0; i < 2; i++) {
    cardDeal(playersHand);
  };

  $('button').removeClass('cant-use');
};

// 点数チェック
let totalPoints = 0;
function pointCheck(array) {
  totalPoints = 0;
  for (let i = 0; i < array.length; i++) {
    let point = 0;
    point = array[i].num;
    if (point >= 11) point = 10;
    totalPoints += point;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].num === 1 && totalPoints <= 11) totalPoints += 10;
  }
  return totalPoints;
}

// split
let splitFlag = 0;
const splitPlayersHand1 = [];
const splitPlayersHand2 = [];
$('#split-button').on('click', function() {
  $('#split-button').addClass('cant-use');
  if ((playersHand[0].num === playersHand[1].num) ||
      (playersHand[0].num >= 10 && playersHand[1].num >= 10)) {
    splitPlayersHand1[0] = playersHand[0];
    splitPlayersHand2[0] = playersHand[1];
    playersHand.length = 0;
    splitFlag = 1;

    $('.first-player-deal').remove();
    let cardNum = splitPlayersHand1[0].num;
    let cardMark = splitPlayersHand1[0].mark;
    $('#player-cards1').append(`<div class='card-animation ${cardMark}${cardNum}'></div>`);
    tmpPoints = pointCheck(splitPlayersHand1);
    $('#player-points1').text(`Points: ${tmpPoints}`)

    cardNum = splitPlayersHand2[0].num;
    cardMark = splitPlayersHand2[0].mark;
    $('#player-cards2').append(`<div class='card-animation ${cardMark}${cardNum}'></div>`);
    tmpPoints = pointCheck(splitPlayersHand2);
    $('#player-points2').text(`Points: ${tmpPoints}`)

    $('.cards-wrap1, .cards-wrap2').removeClass('split-hidden');
    $('.cards-wrap').addClass('split-hidden');
  };
});
  
//  プレイヤーがヒット（1枚引く）
let splitPlayersPoints1 = 0;
let splitPlayersPoints2 = 0;
$('#hit-button').on('click', function() {
  if (splitFlag === 0) {
    cardDeal(playersHand);
    playerPoints = tmpPoints;
  } else if (splitFlag === 1) {
    cardDeal(splitPlayersHand1);
    splitPlayersPoints1 = tmpPoints;
  } else if (splitFlag === 2) {
    cardDeal(splitPlayersHand2);
    splitPlayersPoints2 = tmpPoints;
  }
});

// カードを配る
let lastCard = 0;
let tmpPoints = 0;
let $cardsHolder = '';
let $pointsHolder = '';
function cardDeal(arry) {
  arry.push(cards[dealCounter]);


  if (arry === playersHand) {
    lastCard = dealCounter++ - dealersHand.length;
    $cardsHolder = $('#player-cards');
    $pointsHolder = $('#player-points');

  } else if (arry === splitPlayersHand1) {
    lastCard = dealCounter++ - dealersHand.length - splitPlayersHand2.length;
    $cardsHolder = $('#player-cards1');
    $pointsHolder = $('#player-points1');

  } else if (arry === splitPlayersHand2) {
    lastCard = dealCounter++ - dealersHand.length - splitPlayersHand1.length;
    $cardsHolder = $('#player-cards2');
    $pointsHolder = $('#player-points2');

  } else if (arry === dealersHand) {
    lastCard = dealCounter++ - playersHand.length - splitPlayersHand1.length - splitPlayersHand2.length;
    $cardsHolder = $('#dealer-cards');
    $pointsHolder = $('#dealer-points');
  }

  const cardNum = arry[lastCard].num;
  const cardMark = arry[lastCard].mark;

  if (dealCounter === 1) {
    $cardsHolder.append(`<div class='card-animation reverse ${cardMark}${cardNum}'></div>`);
  } else if (dealCounter === 3 || dealCounter === 4) {
    $cardsHolder.append(`<div class='card-animation first-player-deal ${cardMark}${cardNum}'></div>`);
  } else {
    $cardsHolder.append(`<div class='card-animation ${cardMark}${cardNum}'></div>`);
  }

  tmpPoints = pointCheck(arry);
  displayPoint(arry);
}

// 得点を表示
function displayPoint(arry) {
  tmpPoints = pointCheck(arry);
  if (arry === dealersHand) {
    $pointsHolder.text(`Points: ??`);
  } else {
    $pointsHolder.text(`Points: ${tmpPoints}`);
  }

  if (tmpPoints > 21) burstHand(arry);
}

// プレイヤーがスタンド
$('#stand-button').on('click', function() {
  if (splitFlag === 1) {
    splitFlag = 2;
    return;
  };
  $('#hit-button').addClass('cant-use');
  dealerHit();
});

// ＆ ディーラーが可能な限りヒット
function dealerHit() {
  dealerPoints = pointCheck(dealersHand);
  while (dealerPoints <= 17) {
    cardDeal(dealersHand);
    dealerPoints = tmpPoints;
  };
  if (dealerBurstFlag === 0) decideWinner();
};

// 勝敗を決める
function decideWinner() {
  dealerCardOpen();
  playerPoints = pointCheck(playersHand);
  splitPlayersPoints1 = pointCheck(splitPlayersHand1);
  splitPlayersPoints2 = pointCheck(splitPlayersHand2);
  dealerPoints = pointCheck(dealersHand);

  if (splitFlag === 0) {
    if (playerPoints > dealerPoints || dealerBurstFlag === 1) {
      $('#result').append('<div>勝利</div>');
    } else {
      $('#result').append('<div>敗北</div>');;
    }
  } else if (splitFlag !== 0) {
    if (splitPlayersPoints1 > dealerPoints) {
      $('#result').append('<div>手札1:勝利</div>');
    } else {
      $('#result').append('<div>手札1:敗北</div>');
    };
    if (splitPlayersPoints2 > dealerPoints && splitPlayersPoints2 <= 21) {
      $('#result').append('<div>手札2:勝利</div>');
    } else {
      $('#result').append('<div>手札2:敗北</div>');
    };
  }
  $('#stand-button').addClass('cant-use');
}

// バーストの処理
let splitBurstFlag  = 0;
let dealerBurstFlag  = 0;
function burstHand (burster) {
  if (burster === playersHand) {
    $('#result').append('<div>プレイヤーの手札がバースト<br>敗北</div>');
    $('#stand-button').addClass('cant-use');
    $('#hit-button').addClass('cant-use');

  } else if (burster === splitPlayersHand1){
    $('#result').append('<div>プレイヤーの手札がバースト1</div>');
    splitFlag = 2;
    splitBurstFlag = 1;
    return;

  } else if (burster === splitPlayersHand2){
    $('#result').append('<div>プレイヤーの手札がバースト2</div>');
    if (splitBurstFlag === 0) {
      dealerHit();
    } else {
      $('#result').append('<div>手札2つバーストにつき敗北</div>');;
    };

  } else if (burster === dealersHand) {
    $('#result').append('<div>ディーラーの手札がバースト<br>勝利</div>');
    dealerBurstFlag = 1;
  }

  $('#stand-button').addClass('cant-use');
  $('#hit-button').addClass('cant-use');
  dealerCardOpen();
}

// ディーラーのカードオープン
function dealerCardOpen() {
  $('.reverse').removeClass('reverse');
  dealerPoints = pointCheck(dealersHand);
  $('#dealer-points').text(`Points: ${dealerPoints}`);
}

// start
$('#start-game').on('click', function() {
  $(this).addClass('new-game');
  $(this).text('New Game')
  $('button').addClass('cant-use');
  $('.hidden').removeClass('hidden');
  $('.cards-wrap1, .cards-wrap').addClass('split-hidden');
  $('.cards-wrap').removeClass('split-hidden');
  dealCounter = 0;
  cards.length = 0;
  dealersHand.length = 0;
  playersHand.length = 0;
  splitPlayersHand1.length = 0;
  splitPlayersHand2.length = 0;
  splitFlag = 0;
  dealerBurstFlag = 0;
  $('.html-reset').empty();
  prepareCards();
  cardShuffle();
  dealDealer();
  dealPlayer();
});
