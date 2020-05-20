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

function setup() {
  createCanvas(1500, 700);
  noLoop();
  input = createInput();
  input.position(20, 65);

  button = createButton('submit');
  button.position(input.x + input.width, 65);
  button.mousePressed(name);
  
 
  
  //socket = io.connect('http://localhost:5000');

  

}

function draw() {
	background(220);
	frameRate(10);
  
	if(snakey.alive){
		translate(width/2 - snakey.body[0].x, height /2 - snakey.body[0].y);
		snakey.show();
		
		snakey.update(speedup);
		for(var snk = 0; snk < snakes.length; snk++){
			//console.log(snakes[snk].id, snakes[snk].length);
			if(snakes[snk].id != socket.id){
				snakes[snk].show();
				//console.log(snakes[snk].id, snakes[snk].length, snakes[snk].body.length);
				//console.log(snakey.id, snakey.length, snakey.body.length);
				for(var asnk = 0; asnk < snakes[snk].length; asnk ++){
					if(snakey.die(snakes[snk].body[asnk].x, snakes[snk].body[asnk].y, snakes[snk].size) === true){
						socket.emit('disconnect', socket.id);
						socket.disconnect();
						snakey.alive = false;
					}
				}
			}
		}
		updateServer();
	}
	else{
		textSize(100);
		textAlign(CENTER);
		text('Game Over', 400, 400);
		snakes = null;
	}

  
  for(var k = 0; k < blobs.length; k++){

	noStroke();
	fill(colours[blobs[k].colour]);
    ellipse(blobs[k].x, blobs[k].y, blobs[k].size - random(0, 3));


  }
  
  deleteFood();
 
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
	
		//for(var b = 0; b < data.length; b++){
		//	blobs.push(new foodBlob(data[b].x, data[b].y, data[b].size));
		//}
		blobs = data;
			
}


setInterval(updateServer, 33);

function updateServer(){
	for (var x = 0; x < snakey.body.length; x++){
		//console.log(snakey.length);
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
