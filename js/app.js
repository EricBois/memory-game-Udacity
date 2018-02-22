//base deck
deck = ["fa fa-diamond","fa fa-diamond",
		"fa fa-paper-plane-o","fa fa-paper-plane-o",
		"fa fa-anchor","fa fa-anchor",
		"fa fa-bolt","fa fa-bolt",
		"fa fa-cube","fa fa-cube",
		"fa fa-leaf","fa fa-leaf",
		"fa fa-bicycle","fa fa-bicycle",
		"fa fa-bomb","fa fa-bomb"
		];

var open = []; // temporary open cards
var moves = 0; // # of total move
var matched = 0; // matched pairs of cards
var starCount = 3; // start count
var modal = document.querySelector('.modal'); // location of modal
var timer = new Timer(); // Timer


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 function makeDeck() {
 	//select location 
 	const gridLocation = document.querySelector(".deck");
 	updateMoves();
 	//create empty deck
 	gridLocation.innerHTML='';
 	//shuffle deck
 	cardDeck = shuffle(deck);
 	//create deck from shuffled list
 	for (x=0; x < cardDeck.length; x++) {
		let li = document.createElement('li');
		li.className = 'card';

		for (y=0; y < 1; y++ ){
			let i = document.createElement('i');
			i.className= cardDeck[x];
			li.appendChild(i);
		}
		gridLocation.appendChild(li);	
	}
 }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//check state of class ( open or matched already )
function classLookup(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

document.querySelector('.deck').addEventListener('click', function (evt) {
    if (evt.target.nodeName === 'LI') {  // ← verifies target is desired element
    	if (isNotOpen(evt.target)){ //make sure card isn't open already
    		if (open.length === 0){ // make sure only 2 card can be open at a time
    			openCard(evt.target);
    		}else if(open.length ===1){
    			openCard(evt.target);
    			moves++;
    			updateMoves();
    			if (matchCheck()) { // check if cards match
    				setTimeout(match, 600);
    				matched++;
    				//win game function
    				if ( matched === 8 ){ // if all cards are matched, open modal 
    					timer.pause();
    					modal.style.display = "block";
    					document.querySelector('.timerFinish').textContent="You did it in "+timer.getTimeValues().toString()+"s";
    					document.querySelector('P').textContent="With "+moves+" Moves and "+starCount+" stars.";
    				}
    			}else{
    				setTimeout(resetOpenCard, 600);
    			}
    		}
    	}
    	
    }
});

//check if card is already open
function isNotOpen(card) {
    return !(classLookup(card,"open") || classLookup(card,"match"));
}

//open card
function openCard(card){
	card.className +=" open show";
	open.push(card);
}

//check for matching cards
function matchCheck() {
    if (open[0].firstChild.className === open[1].firstChild.className) {
    	return true;
    }
}

//close opened card
function resetOpenCard(){
	open.forEach(function(card){
		card.className ="card";
	});
	open =[];
}

//add match class to matching cards
function match(){
	open.forEach(function(card){
		card.className += " match"});
	open =[];
}

//update moves on page & check stars
function updateMoves(){
	document.querySelector('.moves').textContent=moves;
	starcheck();
}

//Restart the game 
function resetGame(){
	open =[];
	moves=0;
	matched=0;
	starCount=3;
	const stars = document.querySelectorAll('.fa-star-o'); // check for empty stars and reload them
	for (x=0; x<stars.length; x++){
		if (stars[x].className === "fa fa-star-o"){
			stars[x].className = "fa fa-star"
		}
	}
	updateMoves();
	makeDeck();
	timer.reset();
}

//event listener for restart button game page
document.querySelector('.restart').addEventListener('click', function () {
  	resetGame();
});

//event listener for restart button
document.querySelector('.restartBtn').addEventListener('click', function () {
	modal.style.display = "none";
  	resetGame();
});

//change stars state
function starcheck(){
	const stars = document.querySelectorAll('.fa-star');
	if (moves === 15){
		stars[2].className ="fa fa-star-o";
		starCount = 2;
	}else if (moves === 20){
		stars[1].className ="fa fa-star-o";
		starCount = 1;
	}else if (moves === 26){
		stars[0].className ="fa fa-star-o";
		starCount = 0;
	}
	
}

//timer updater
timer.addEventListener('secondsUpdated', function (e) {
    $('#time').html(timer.getTimeValues().toString());
});

//Jquery for checkmark in modal
$(document).ready(function () {
        setTimeout(function () {
            $(".check").attr("class", "check check-complete");
            $(".fill").attr("class", "fill fill-complete");
        }, 1000);

        setTimeout(function () {
            $(".check").attr("class", "check check-complete success");
            $(".fill").attr("class", "fill fill-complete success");
            $(".path").attr("class", "path path-complete");
        }, 2000);
    });

makeDeck();
timer.start();