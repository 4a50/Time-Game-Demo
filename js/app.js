'use strict'
let ships = [];
let cardDeck = $("#card-deck");
let currentTime = new Date(); // milliseconds once updated
//TODO: Calculate all times in milliseconds.


function Ship(shipName, timeReq = 10000) {
  this.shipName = shipName;
  this.timeRequired = timeReq; //in milliseconds
  this.timeRemaining = this.timeRequired;
  this.timeStamp = currentTime + timeReq;
  this.cardTimeRemElement = document.createElement('h6');
  this.card = this.createCard();
  this.startTime = 0;
  this.intervalSet = null;
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
  cardButton.textContent = `Start Building (${this.timeRequired / 1000}s required)`;
  cardButton.id = `btn-${this.shipName}`;
  cardButton.className = 'btn btn-primary';
  cardBody.append(cardButton);
  column.append(card)
  return column;
}
Ship.prototype.shipBuildComplete = function () {
  this.cardTimeRemElement.textContent = `Time Remaining: Completed`;
  let shipButton = $(`#btn-${this.shipName}`)
  shipButton.text(`Build Complete`);
  shipButton.prop("disabled", true);
  this.timeRemaining = 0;

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
function clockDisplay() {
  let clockElement = $("#time-display");
  let now = new Date()
  currentTime = Date.now();
  let timeString = now.toString().substring(24, 16);
  console.log(timeString);
  let time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  clockElement.text(timeString);
}
function init() {
  ships.push(new Ship('Hotspur', 20000));
  ships.push(new Ship('Enterprise', 5000));
  ships.push(new Ship('Arwing', 45000));
  for (let i = 0; i < ships.length; i++) {
    cardDeck.append(ships[i].card);
  }
  let clockControl = setInterval(clockDisplay, 1000);

}
//Event Listener

init();
$('.btn').click((e) => {
  let idTag = e.target.id
  let splitIdString = idTag.split("-");
  console.log(splitIdString[1]);
  findShipToBuild(splitIdString[1]);
  e.target.textContent = 'Build in Progress';
});

