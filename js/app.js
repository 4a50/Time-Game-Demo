'use strict'
let ships = [];
let cardDeck = $("#card-deck");
let currentTime = new Date(); // milliseconds once updated
//TODO: Calculate all times in milliseconds.
function clockDisplay() {
  let clockElement = $("#time-display");
  let now = new Date();
  currentTime = Date.now();
  let time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  clockElement.text(time);
  setInterval(clockDisplay, 1000);
}

function Ship(shipName, timeReq = 10000) {
  this.shipName = shipName;
  this.timeRequired = timeReq; //in milliseconds
  this.timeRemaining = this.timeRequired;
  this.timeStamp = currentTime + timeReq;
  this.cardTimeRemElement = document.createElement('h6');
  this.card = this.createCard();
  this.startTime = 0;
  this.timer;
}
Ship.prototype.createCard = function () {
  let column = document.createElement("div");
  column.className = `col-sm-6`;
  let card = document.createElement("div");
  card.id = `${this.shipName}`;
  card.className = 'card';
  let cardBody = document.createElement("div");
  cardBody.className = 'card-body';
  card.append(cardBody);
  let cardTitle = document.createElement('h5');
  cardTitle.className = `card-title`;
  cardTitle.textContent = this.shipName;
  cardBody.append(cardTitle);

  this.cardTimeRemElement.textContent = 'Time Remaining';
  this.cardTimeRemElement.className = 'card-subtitle mb-2 text-muted';
  cardBody.append(this.cardTimeRemElement);
  let cardDescription = document.createElement('p');
  cardDescription.textContent = `This is the ${this.shipName}`;
  cardDescription.className = 'card-text';
  cardBody.append(cardDescription);
  let cardButton = document.createElement('button');
  cardButton.textContent = `Start Building(${this.timeRequired} sec required)`;
  cardButton.id = `btn-${this.shipName}`;
  cardButton.className = 'btn btn-primary';
  cardBody.append(cardButton);
  column.append(card)
  return column;
}
function buildShip(ship) {
  //debugger;
  ship.timeRemaining = (ship.timeStamp - Date.now()) / 1000;
  //debugger;

  if (ship.timeRemaining <= 0) {
    clearInterval(ship.timer);
    completedBuild(ship);
    console.log(`Clear ${ship.shipName} timer`);
    return;
  }
  else {

    ship.cardTimeRemElement.textContent = `Time Remaining: ${Math.round(ship.timeRemaining)} secs`;
  }
}
function completedBuild(ship) {
  debugger;
  ship.cardTimeRemElement.textContent = `Time Remaining: Completed`;
  let shipButton = $(`#btn-${ship.shipName}`)
  shipButton.text(`Build Complete`);
  shipButton.prop("disabled", true);
  ship.timeRemaining = 0;

}
function shipBuildStart(name) {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].shipName === name) {
      console.log(`Found ${ships[i].shipName}`);
      ships[i].timeStamp = Date.now() + ships[i].timeRequired;
      console.log(`Time Stamp: ${ships[i].timeStamp} Current Time: ${currentTime} Difference: ${ships[i].timeStamp - currentTime}`);
      ships[i].timer = setInterval(buildShip, 1000, ships[i]);
      return
    }
    console.log("Ship Not Found");
  }
}
function init() {
  ships.push(new Ship('Hotspur', 20000));
  ships.push(new Ship('Enterprise', 5000));
  for (let i = 0; i < ships.length; i++) {
    cardDeck.append(ships[i].card);
  }
  clockDisplay();
}
//Event Listener

init();
$('.btn').click((e) => {
  let idTag = e.target.id
  let splitIdString = idTag.split("-");
  console.log(splitIdString[1]);
  shipBuildStart(splitIdString[1]);
  e.target.textContent = 'Build in Progress';
});

