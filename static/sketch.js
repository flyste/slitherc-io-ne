var snakey;
var snakes = [];
var numberFood = 5000;
var blobs = [];
var data = [];
var socket;
var colours = ['#DB7093','#FFA500', '#FF4500', '#FFA07A', '#FFD700', '#B22222', '#FF7F50' ];
var speedup = false;
var notSet = true;
let input, button;
var displayText = true;

function setup() {
	createCanvas(1500, 700);

	
	input = createInput();
	input.position(width / 2 - input.width/2, height / 2);


	button = createButton('submit');
	button.position(input.x + input.width, input.y);

  
	button.mousePressed(name);
	noLoop();

}

function draw() {
	background(100);
	if(displayText === true){
		push();
		stroke(255);
		textSize(20);
		text('Please enter your name', input.x, input.y - input.height);
		pop();
		displayText = false;
	}

	frameRate(10);
	

	
	
	if(snakey.alive === true){
		translate(width/2 - snakey.body[0].x, height /2 - snakey.body[0].y);
		snakey.show();
		
		snakey.update(speedup);
		
		for(var snk = 0; snk < snakes.length; snk++){
			if(snakes[snk].id != socket.id){
				snakes[snk].show(snakes[snk].colourSeeds);
				for(var asnk = 0; asnk < snakes[snk].length; asnk ++){
					if(snakey.die(snakes[snk].body[asnk].x, snakes[snk].body[asnk].y, snakes[snk].size) === true){
						snakey.alive = false;
					}
				}
			}
		}
		updateServer();
		

	}
	else if(snakey.alive === false){
		textSize(100);
		textAlign(CENTER);
		text('Game Over', 400, 400);
		socket.emit('disconnect', socket.id);
		socket.disconnect();
		snakes = null;
	}

  
  for(var k = 0; k < blobs.length; k++){

	push();
	noStroke();
	fill(colours[blobs[k].colour]);
    ellipse(blobs[k].x, blobs[k].y, blobs[k].size - random(0, 3));
	pop();

  }
  
  deleteFood();
  if (snakey.hitWall() === true){

	snakey.alive = false;
	}	
	
	push();
	stroke(0, 0, 255);
	strokeWeight(20 - random(0, 3));
	line(-800, -800, 800 * 3, -800);
	line(-800, -800, -800, 800 * 3);
	line(800 * 3, -800, 800 * 3, 800 * 3);
	line(-800, 800 * 3, 800 * 3, 800 * 3);
	pop();
	

 
}

function name(){
	
	
	socket = io.connect();
	

  
  socket.on('heartbeat', updateOtherSnakes);
  socket.on('blobemit', updateFood);
  socket.on('deadSnake', removeSnake);
	
	snakey = new snake(socket.id, random(0, width), random(0, height), 20, 20, input.value());
	snakey.alive = true;
	copySnakeToServer();
	input.remove();
	button.remove();
	
	loop();
	}


function mousePressed() {

	speedup = true;

}

function mouseReleased() {
	
	speedup = false;
	
}


function removeSnake(data){
	console.log("here");
	for(die = 0; die < snakes.length; die++){
		console.log("data - ", data);
		if(snakes[die].id === data){
			snakes.splice(die, 1);
		}
	}
	
}

function updateOtherSnakes(data){
	
	for(var exists = 0; exists < snakes.length; exists ++){
		if((data[exists]) && (snakes[exists].id === data[exists].id)){
			for(var c = 0; c < snakes[exists].body.length ; c++){
				if(!data[exists].body[c]){
					//exit
				}
				else{
					snakes[exists].body[c].x = data[exists].body[c].x;						
					snakes[exists].body[c].y = data[exists].body[c].y;
					snakes[exists].size = data[exists].size;
					snakes[exists].name = data[exists].name;					
				}
			}
			if(data[exists].body.length > snakes[exists].body.length){
				snakes[exists].grow();
			}
		}
	}
	if(snakes.length < data.length) {
		snakes.push(new snake(data[exists].id, 0, 0, 20, 20, data[exists].name)); 
	}
}

function updateFood(data){
	
		blobs = data;
			
}


setInterval(updateServer, 33);

function updateServer(){
	for (var x = 0; x < snakey.body.length; x++){
		data[x] = {snakebodyx: snakey.body[x].x, snakebodyy: snakey.body[x].y, snakesize: snakey.size, snakelength: snakey.body.length, snakename: snakey.name};
	} 
	socket.emit('updateServer', data);
  

	
}

function copySnakeToServer(){
	for (var x = 0; x < snakey.body.length; x++){
		data[x] = {snakebodyx: snakey.body[x].x, snakebodyy: snakey.body[x].y, snakesize: snakey.size, snakelength: snakey.body.length, snakename: snakey.name};
	} 
 socket.emit('snakedata', data);

	
}

  
function deleteFood(){
  
    for(var i = 0; i < blobs.length; i++){
      if(snakey.eat(blobs[i].x, blobs[i].y, blobs[i].size)){
        blobs.splice(i,1);
		socket.emit('blobdata', i);
    }
	
  } 
    
  
}

class foodBlob{
	
	constructor(xpos, ypos, size){
		
		this.x = xpos;
		this.y = ypos;
		this.size = size;
		
	}
	
}
