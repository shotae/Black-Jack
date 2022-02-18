'use strict'

const dealersHand = [];
const playersHand = [];
const splitHand1 = [];
const splitHand2 = [];

let dealerScores = 0;
let playerScores = 0;
let splitScores1 = 0;
let splitScores2 = 0;
let dealCounter = 0;
let splitFlag = 0;
let playerBurstFlag = 0;
let splitBurstFlag  = 0;
let dealerBurstFlag  = 0;

class playerInfo {
  constructor(handCards, $cardsArea, scoresContainer, $ScoresArea) {
    this.handCards = handCards;
    this.$cardsArea = $cardsArea;
    this.scoresContainer = scoresContainer;
    this.$ScoresArea = $ScoresArea;

    this.handCards.length = 0;
    this.$ScoresHolder = 0;
  }

  // カードを1枚配る
  cardDeal(){
    this.handCards.push(cards[dealCounter++]);
    console.log(`dealCounter: ${dealCounter}`);
    this.cardsDisplay();
  }

  // カードを表示
  cardsDisplay() {
    let lastCard = 0;
    if (this.handCards === playersHand) {
      lastCard = dealCounter -1 - dealersHand.length;

    } else if (this.handCards === splitHand1) {
      lastCard = dealCounter -1 - dealersHand.length - splitHand2.length;

    } else if (this.handCards === splitHand2) {
      lastCard = dealCounter -1 - dealersHand.length - splitHand1.length;

    } else if (this.handCards === dealersHand) {
      lastCard = dealCounter -1 - playersHand.length - splitHand1.length - splitHand2.length;
    }

    const cardNum = this.handCards[lastCard].num;
    const cardMark = this.handCards[lastCard].mark;

    if (dealCounter === 1) {
      this.$cardsArea.append(`<div class='reverse ${cardMark}${cardNum}'></div>`);
      $('.reverse').addClass('reverse-slidein');
    } else if (dealCounter === 3 || dealCounter === 4) {
      this.$cardsArea.append(`<div class='card first-player-deal  ${cardMark}${cardNum}'></div>`);
      $('.card').addClass('card-slidein');

    } else {
      this.$cardsArea.append(`<div class='card  ${cardMark}${cardNum}'></div>`);
      $('.card').addClass('card-slidein');

    }
    // $('.card').removeClass('animation-anchor');
    // $('.card').removeClass('card');


    this.scoresDisplay();
  }

  // 点数計算
  scoresCheck() {
    let totalScores = 0;
    for (let i = 0; i < this.handCards.length; i++) {
      let scores = 0;
      scores = this.handCards[i].num;
      if (scores >= 11) scores = 10;
      totalScores += scores;
    }
    for (let i = 0; i < this.handCards.length; i++) {
      if (this.handCards[i].num === 1 && totalScores <= 11) totalScores += 10;
    }
    return totalScores;
  }

  点数表示
  scoresDisplay() {
    this.scoresContainer = this.scoresCheck();

    if (this.handCards === dealersHand && dealCounter <= 2) {
      this.$ScoresArea.text(`Scores: ??`);
    } else {
      this.$ScoresArea.text(`Scores: ${this.scoresContainer}`);
    }

    if (this.scoresContainer > 21 && dealerBurstFlag !== 1) this.burstHand();
  }

  burstHand() {
    if (this.handCards === playersHand) {
      $('#result').append('<div>プレイヤーの手札がバースト<br>敗北</div>');
      playerBurstFlag = 1;
      $('#stand-button').addClass('cant-use');
      $('#hit-button').addClass('cant-use');

    } else if (this.handCards === splitHand1){
      $('#result').append('<div>プレイヤーの手札1がバースト</div>');
      splitFlag = 2;
      splitBurstFlag = 1;
      $('#split-hand1').removeClass('selecting-hand');
      $('#split-hand2').addClass('selecting-hand');
      return;

    } else if (this.handCards === splitHand2){
      $('#split-hand2').removeClass('selecting-hand');
      $('#result').append('<div>プレイヤーの手札2がバースト</div>');
      if (splitBurstFlag === 0) {
        splitBurstFlag = 2;
        dealerHit();
        return;
      } else {
        $('#result').append('<div>手札2つバーストにつき敗北</div>');
      };

    } else if (this.handCards === dealersHand) {
      $('#result').append('<div>ディーラーの手札がバースト</div>');
      dealerBurstFlag = 1;
    }

    $('#stand-button').addClass('cant-use');
    $('#hit-button').addClass('cant-use');
    decideWinner();
  }
}

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

// プレイヤー設定
// constructor(handCards, $cardsArea, scoresContainer, $ScoresArea) {

const dealer = new playerInfo(dealersHand, $('#dealer-cards-area'), dealerScores, $('#dealer-scores-area'));
const player = new playerInfo(playersHand, $('#player-cards-area'), playerScores, $('#player-scores-area'));
const split1 = new playerInfo(splitHand1, $('#split-cards-area1'), splitScores1, $('#split-scores-area1'));
const split2 = new playerInfo(splitHand2, $('#split-cards-area2'), splitScores2, $('#split-scores-area2'));


// ディーラーが2枚ドロー
function dealDealer() {
  for(let i = 0; i < 1000;) {
    setTimeout(function() {
      dealer.cardDeal();
    },i += 500);
  };
};

// プレイヤーが2枚ドロー
function dealPlayer() {
  for(let i = 0; i < 1000;) {
    setTimeout(function() {
      player.cardDeal();
    },(i += 500) + 1000);
  };

  setTimeout(function() {
    $('#start-game, #hit-button, #stand-button').removeClass('cant-use');
    if ((playersHand[0].num === playersHand[1].num) ||
        (playersHand[0].num >= 10 && playersHand[1].num >= 10)) {
      $('#split-button').removeClass('cant-use');
    }
  }, 2000)


};

// split
$('#split-button').on('click', function() {
  $('#split-button').addClass('cant-use');

  splitHand1[0] = playersHand[0];
  splitHand2[0] = playersHand[1];
  playersHand.length = 0;
  splitFlag = 1;

  $('.first-player-deal').remove();

  split1.cardsDisplay();
  split2.cardsDisplay();

  $('#split-hand1, #split-hand2').removeClass('split-hidden');
  $('#players-hand').addClass('split-hidden');
  $('#split-hand1').addClass('selecting-hand');
});


//  プレイヤーがヒット（1枚引く）
$('#hit-button').on('click', function() {
  $('#split-button').addClass('cant-use');
  if (splitFlag === 0) {
    player.cardDeal();
  } else if (splitFlag === 1) {
    console.log('hit flag1')
    split1.cardDeal();
  } else if (splitFlag === 2) {
    console.log('hit flag2')
    split2.cardDeal();
  }
});

// プレイヤーがスタンド
$('#stand-button').on('click', function() {
  if (splitFlag === 1) {
    splitFlag = 2;
    $('#split-hand1').removeClass('selecting-hand');
    $('#split-hand2').addClass('selecting-hand');
    return;
  };
  $('#hit-button').addClass('cant-use');
  $('#split-button').addClass('cant-use');
  $('#split-hand2').removeClass('selecting-hand');
  dealerHit();
});

// ＆ ディーラーが可能な限りヒット
function dealerHit() {
  dealerScores = dealer.scoresCheck();
  while (dealerScores <= 17) {
    dealer.cardDeal();
    dealerScores = dealer.scoresCheck();
  };
  if (dealerBurstFlag === 0) decideWinner();
};

// 勝敗を決める
function decideWinner() {
  dealerCardOpen();
  playerScores = player.scoresCheck();
  splitScores1 = split1.scoresCheck();
  splitScores2 = split2.scoresCheck();
  dealerScores = dealer.scoresCheck();

  if (splitFlag === 0 && playerBurstFlag === 0) {
    if (playerScores > dealerScores || dealerBurstFlag === 1) {
      $('#result').append('<div>勝利</div>');
    } else {
      $('#result').append('<div>敗北</div>');;
    }
  } else if (splitFlag !== 0) {
    if (splitScores1 > dealerScores && splitBurstFlag !== 1) {
      $('#result').append('<div>手札1:勝利</div>');
    } else if (splitBurstFlag !== 1 && dealerBurstFlag === 1) {
      $('#result').append('<div>手札1:勝利</div>');
    } else {
      $('#result').append('<div>手札1:敗北</div>');
    };
    if (splitScores2 > dealerScores && splitBurstFlag !== 2) {
      $('#result').append('<div>手札2:勝利</div>');
    }else if (splitBurstFlag !== 2 && dealerBurstFlag === 1) {
      $('#result').append('<div>手札2:勝利</div>');
    } else {
      $('#result').append('<div>手札2:敗北</div>');
    };
  }
  $('#stand-button').addClass('cant-use');
}

// ディーラーのカードオープン
function dealerCardOpen() {
  $('.reverse').addClass('dealer-card-open');
  $('.reverse').removeClass('reverse');
  dealer.scoresDisplay();
}

// start
$('#start-game').on('click', function() {
  $(this).addClass('new-game');
  $(this).text('New Game')
  $('button').addClass('cant-use');
  $('.hidden').removeClass('hidden');
  $('#split-hand1, #split-hand2').addClass('split-hidden');
  $('#players-hand').removeClass('split-hidden');
  $('#split-hand1, #split-hand2').removeClass('selecting-hand');
  dealCounter = 0;
  cards.length = 0;
  dealersHand.length = 0;
  playersHand.length = 0;
  splitHand1.length = 0;
  splitHand2.length = 0;
  splitFlag = 0;
  dealerBurstFlag = 0;
  splitBurstFlag = 0;
  playerBurstFlag = 0;
  $('.html-reset').empty();
  prepareCards();
  cardShuffle();
  dealDealer();
  dealPlayer();
});
