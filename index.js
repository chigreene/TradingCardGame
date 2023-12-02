class Pokemon {
  constructor(name, attack, defense, health) {
    this.name = name;
    this.attack = attack;
    this.defense = defense;
    this.health = health;
  }
}

function generatePokemon() {
  const pokemonList = [];

  for (let i = 0; i < 50; i++) {
    const name = `Pokemon ${i + 1}`;
    const attack = Math.floor(Math.random() * 100) + 1;
    const defense = Math.floor(Math.random() * 100) + 1;
    const health = Math.floor(Math.random() * 100) + 1;

    const pokemon = new Pokemon(name, attack, defense, health);
    pokemonList.push(pokemon);
  }

  return pokemonList;
}

const pokemonList = generatePokemon();
console.log(pokemonList);

// shuffle generated pokemon so they can be randomly distributed to players
function shuffleArray(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap elements
    const temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// distribute pokemon to players
function distributePokemon(pokemonList, player1, player2) {
  const shuffledPokemon = shuffleArray(pokemonList);
  player1.deck = shuffledPokemon.slice(0, 7);
  player2.deck = shuffledPokemon.slice(7, 14);
}

class Player {
  constructor(name) {
    this.name = name;
    this.deck = [];
    this.hand = [];
    this.bench = [];
    this.activePokemon = null;
    this.discardPile = [];
    this.opponent = null;
  }

  logDeck() {
    console.log(
      `${this.name}'s deck:`,
      this.deck.map((pokemon) => pokemon.name)
    );
  }

  logHand() {
    console.log(
      `${this.name}'s hand:`,
      this.hand.map((pokemon) => pokemon.name)
    );
  }

  logBench() {
    console.log(`${this.name}'s bench:`);
    this.bench.forEach((pokemon) => console.log(pokemon.name));
  }

  shuffleDeck() {
    // Shuffle the deck
    const deck = this.deck;
    let currentIndex = deck.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap current card with a random card
      const temporaryCard = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryCard;
    }
  }

  drawInitialHand() {
    const handSize = 1; // Number of cards to draw for initial hand
    const deck = this.deck;
    const hand = this.hand;

    for (let i = 0; i < handSize; i++) {
      if (deck.length === 0) {
        break; // Stop drawing if deck is empty
      }

      const card = deck.pop(); // Draw the top card from the deck
      hand.push(card); // Add the card to the hand

      console.log(`${this.name} drew ${card.name}`);
    }
  }

  drawCard() {
    // Draw a card from the deck
    const deck = this.deck;
    const hand = this.hand;

    if (deck.length === 0) {
      // Handle empty deck scenario
      console.log("Deck is empty. Cannot draw a card.");
      return;
    }

    const card = deck.pop(); // Draw the top card from the deck
    hand.push(card); // Add the card to the hand

    console.log(`Drew ${card.name} from the deck.`);
  }

  playCard(card) {
    const hand = this.hand;
    const bench = this.bench;
    let activePokemon = this.activePokemon;

    if (hand.includes(card)) {
      if (bench.length < 5) {
        bench.push(card); // Add the card to the bench
        hand.splice(hand.indexOf(card), 1); // Remove the card from the hand
        console.log(`Played ${card.name} to the bench.`);
      } else {
        console.log(
          "Cannot play the card. Bench is full and there is already an active Pokemon."
        );
      }
    } else {
      console.log("Cannot play the card. It is not in the hand.");
    }

    if (activePokemon === null && card) {
      activePokemon = card;
      if (card.name) {
        console.log(`${card.name} is now active.`);
      } else {
        console.log(`${player.name} has no cards left to play.`);
      }
    }
  }

  attack(target) {
    // Attack the target Pokemon
    const activePokemon = this.activePokemon;

    if (activePokemon) {
      console.log(`${activePokemon.name} attacks ${target.name}!`);
      // Perform the attack logic here
      const damage = Math.max(activePokemon.attack - target.defense, 10);
      if (damage > 0) {
        target.health -= damage;
        console.log(`${target.name} takes ${damage} damage.`);
        if (target.health <= 0) {
          console.log(`${target.name} fainted.`);
          // Handle fainted Pokemon logic here
          this.opponent.activePokemon = null;
          const benchIndex = this.opponent.bench.indexOf(target);
          if (benchIndex !== -1) {
            this.opponent.bench.splice(benchIndex, 1); // Remove the defeated Pokemon from the bench
            this.opponent.discardPile.push(target); // Add the defeated Pokemon to the discard pile
            console.log(`${target.name} is discarded.`);
          }

          // If the defeated Pokemon was the active Pokemon, remove it from the active position
          if (this.activePokemon === target) {
            this.activePokemon = null;
          }
        }
      } else {
        const halfDamage = Math.floor(damage / 2);
        target.health -= halfDamage;
        console.log(
          `${target.name} has strong defenses. ${target.name} takes ${halfDamage} damage.`
        );
        if (target.health <= 0) {
          console.log(`${target.name} fainted.`);
          // Handle fainted Pokemon logic here
          const benchIndex = this.bench.indexOf(target);
          if (benchIndex !== -1) {
            this.bench.splice(benchIndex, 1); // Remove the defeated Pokemon from the bench
            this.discardPile.push(target); // Add the defeated Pokemon to the discard pile
            console.log(`${target.name} is discarded.`);
          }

          // If the defeated Pokemon was the active Pokemon, remove it from the active position
          if (this.activePokemon === target) {
            this.activePokemon = null;
          }
        }
      }
    } else {
      console.log("No active Pokemon to attack with.");
    }
  }

  endTurn() {
    // End the player's turn
    this.turnCount++;
    console.log(`Turn ${this.turnCount} ended.`);

    // Check if there is no active Pokemon
    if (this.activePokemon === null) {
      // Loop through the player's Pokemon list
      for (let i = 0; i < this.bench.length; i++) {
        // If the Pokemon is not fainted, set it as the active Pokemon
        if (this.bench[i].health > 0) {
          this.activePokemon = this.bench[i];
          console.log(`${this.activePokemon.name} is now active.`);
          break;
        }
      }
    }
  }
}

class Game {
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
  }

  startGame() {
    this.players.forEach((player) => {
      player.shuffleDeck();
      player.drawInitialHand();
    });
    this.determineStartingPlayer();
    this.mainGameLoop();
  }

  determineStartingPlayer() {
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
  }

  mainGameLoop() {
    while (!this.isGameOver()) {
      const currentPlayer = this.players[this.currentPlayerIndex];
      this.executeTurn(currentPlayer);
      this.switchPlayer();
    }
  }

  executeTurn(player) {
    const randomIndex = Math.floor(Math.random() * player.hand.length);
    const randomPokemon = player.hand[randomIndex];
    player.drawCard();
    player.playCard(randomPokemon);

    // Define otherPlayer
    const otherPlayer =
      this.players[(this.currentPlayerIndex + 1) % this.players.length];

    if (player.activePokemon && otherPlayer.activePokemon) {
      player.attack(otherPlayer.activePokemon); // Pass the opponent's active Pokemon as the target
    }
    player.endTurn();
  }

  switchPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    this.turnCount++;
  }

  isGameOver() {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const otherPlayer =
      this.players[(this.currentPlayerIndex + 1) % this.players.length];

    // Check if any player has no more cards to play
    if (
      currentPlayer.deck.length === 0 &&
      currentPlayer.hand.length === 0 &&
      currentPlayer.bench.length === 0
    ) {
      console.log(
        `${currentPlayer.name} has no more cards to play. ${otherPlayer.name} wins!`
      );
      return true;
    } else if (
      otherPlayer.deck.length === 0 &&
      otherPlayer.hand.length === 0 &&
      otherPlayer.bench.length === 0
    ) {
      console.log(
        `${otherPlayer.name} has no more cards to play. ${currentPlayer.name} wins!`
      );
      return true;
    }

    // Check if the turn limit has been reached
    if (this.turnCount >= 1000) {
      // Calculate remaining Pokemon for each player
      const currentPlayerRemainingPokemon =
        currentPlayer.deck.length +
        currentPlayer.hand.length +
        currentPlayer.bench.length;
      const otherPlayerRemainingPokemon =
        otherPlayer.deck.length +
        otherPlayer.hand.length +
        otherPlayer.bench.length;

      // Declare the winner based on the player with the most remaining Pokemon
      if (currentPlayerRemainingPokemon > otherPlayerRemainingPokemon) {
        console.log(`${currentPlayer.name} wins!`);
      } else if (currentPlayerRemainingPokemon < otherPlayerRemainingPokemon) {
        console.log(`${otherPlayer.name} wins!`);
      } else {
        console.log(`The game is a draw.`);
      }
      return true;
    }

    // Add more win conditions if needed

    return false;
  }
}

// Usage example:
const player1 = new Player("Player 1");
const player2 = new Player("Player 2");
player1.opponent = player2;
player2.opponent = player1;
const game = new Game(player1, player2);

distributePokemon(pokemonList, player1, player2);
player1.logDeck();
player1.logHand();
player2.logDeck();
player2.logHand();
game.startGame();
player1.logDeck();
player1.logBench();
player1.logHand();
player2.logDeck();
player2.logBench();
player2.logHand();
