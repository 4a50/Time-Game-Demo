'use strict'
let ships = [];
let cardDeck = document.querySelector('#shipyard-card-deck');
let eventArray = [];
let currentTime = new Date(); // milliseconds once updated
let armadaArray = [];
const ShipColor = {
  RED: 'RedShip.png',
  BLUE: 'BlueShip.png',
  GREEN: 'GreenShip.png'
};

function Ship(shipName, className = 'Generic', shipColor = ShipColor.RED, timeReq = 10000) {
  this.shipName = shipName;
  this.className = className
  this.shipColor = shipColor;
  this.timeRequired = timeReq; //in milliseconds
  this.cardTimeRemElement = document.createElement('h6');
  this.button = document.createElement('button');
  this.card = this.createCard();
  //STOP HERE
  this.timeRemaining = this.timeRequired;
  this.timeStamp = currentTime + timeReq;
  this.startTime = 0;
  this.intervalSet = null;
  ships.push(this);
  //eventArray.push(this.button);
}
Ship.prototype.createCard = function () {
  let columnCardContainer = document.createElement("div");
  columnCardContainer.className = `col-sm-4`;

  let card = document.createElement("div");
  card.id = `${this.shipName}`;
  card.className = 'card';

  let cardBody = document.createElement("div");
  cardBody.className = 'card-body';
  card.append(cardBody);


  let cardTitle = document.createElement('h4');
  cardTitle.className = `card-title`;
  cardTitle.textContent = this.shipName;
  cardBody.append(cardTitle);

  let cardClass = document.createElement('h5');
  cardClass.className = 'card-subTitle';
  cardClass.textContent = `Class: ${this.className}`;
  cardBody.append(cardClass);

  this.cardTimeRemElement.textContent = 'Time Remaining';
  this.cardTimeRemElement.className = 'card-subtitle mb-2';
  cardBody.append(this.cardTimeRemElement);

  let cardDescription = document.createElement('p');
  cardDescription.textContent = `This is the ${this.shipName}`;
  cardDescription.className = 'card-text';
  cardBody.append(cardDescription);

  let cardButton = this.button;
  cardButton.textContent = `Start Building (${this.timeRequired / 1000}s required)`;
  cardButton.id = `btn-${this.shipName}`;
  cardButton.className = 'btn btn-primary';
  cardBody.append(cardButton);
  columnCardContainer.append(card)
  return columnCardContainer;
  //Come back to me later.  Final styling.
  // let cardImageCap = document.createElement('img');
  // cardImageCap.className = 'card-img-top mx-auto d-block';
  // cardImageCap.src = `/assets/${this.shipColor}`;
  // cardBody.append(cardImageCap);
}
Ship.prototype.shipBuildComplete = function () {
  this.cardTimeRemElement.textContent = `Time Remaining: Completed`;
  //let shipButton = $(`#btn-${this.shipName}`)
  let shipButton = document.querySelector(`#btn-${this.shipName}`);
  shipButton.textContent = `Build Complete`;
  shipButton.disabled = true;
  this.timeRemaining = 0;

  document.querySelector('#armada-card-deck').append(this.card);

}
//unsure why the prototype function will scope to Window instead of the object.
let shipBuild = function (ship) {
  ship.timeRemaining = (ship.timeStamp - Date.now()) / 1000;
  if (ship.timeRemaining <= 0) {
    clearInterval(ship.intervalSet);
    ship.shipBuildComplete();
    console.log(`Cleared ${ship.shipName} timer`);
  }
  else {
    ship.cardTimeRemElement.textContent = `Time Remaining: ${Math.round(ship.timeRemaining)} secs`;
  }
}
function findShipToBuild(name) {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].shipName === name) {
      console.log(`Found ${ships[i].shipName}`);
      ships[i].timeStamp = Date.now() + ships[i].timeRequired;
      ships[i].intervalSet = setInterval(shipBuild, 1000, ships[i]);
      console.log(`Time Stamp: ${ships[i].timeStamp} Current Time: ${currentTime} Difference: ${ships[i].timeStamp - currentTime}`);
      return
    }
  }
  console.log("Ship Not Found");
}
//"Wed Jun 09 2021 11:56:37 GMT-0700 (Pacific Daylight Time)"

function clockDisplay() {
  let clockElement = document.querySelector("#time-display");
  let now = new Date()
  currentTime = Date.now();
  let timeString = now.toString().substring(24, 16);
  clockElement.textContent = timeString;
}
function init() {
  new Ship('Hotspur', 'Destroyer', ShipColor.RED, 4000);
  new Ship('Enterprise', 'Constitution', ShipColor.BLUE, 5000);
  new Ship('FoxTail', 'Arwing', ShipColor.GREEN, 2000);
  render();
  setInterval(clockDisplay, 1000);
}
function render() {
  for (let i = 0; i < ships.length; i++) {
    cardDeck.append(ships[i].card);
    ships[i].button.addEventListener('click', buildEvent);
  }
}
//Event Listener

init();
function buildEvent(e) {
  let idTag = e.target.id
  let splitIdString = idTag.split("-");
  console.log(splitIdString[1]);
  findShipToBuild(splitIdString[1]);
  e.target.textContent = 'Build in Progress';
}

