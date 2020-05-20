var snakes = [];
var blobs = [];
var food = [];
var coords = { x: 0, y: 0};
var express = require('express');
var app = express();
var server = app.listen(5000);
numberBlobs = 3000;

app.use(express.static('static'));

var socket = require('socket.io');
var io = socket(server);



setInterval(heartbeat, 33);
function heartbeat() {
	io.sockets.emit('heartbeat', snakes);

}

setInterval(blobemit, 333);
function blobemit() {
	io.sockets.emit('blobemit', blobs);

}


// Add the WebSocket handlers
io.sockets.on('connection', function(socket) {

	socket.on('snakedata', function(data){
		snakes.push(new snake(socket.id, 0, 0, data[0].snakesize, data[0].snakelength, data[0].snakename));
		for(var i = 0; i < data.length; i++){
			snakes[snakes.length - 1].body[i].x = data[i].snakebodyx;
			snakes[snakes.length - 1].body[i].y = data[i].snakebodyy;
			snakes[snakes.length - 1].size = data[i].snakesize;
			snakes[snakes.length - 1].length = data.length;			
		}
		if(blobs.length === 0){
			for(var j = 0; j < numberBlobs; j++){
				let x = Math.floor(Math.random() * (800*2 - (-800 * 2)) + (-800));
				let y = Math.floor(Math.random() * (800*2 - (-800 * 2)) + (-800));
				let size = Math.floor(Math.random() * (30 - 10) + 10);
				let colour = Math.floor(Math.random() * (6 - 0) + 0);
				blobs.push(new foodBlob(x, y, size, colour));
			}
			console.log(blobs);
		}
	});
	
	socket.on('blobdata', function(data) {
		
		blobs.splice(data,1);
		
	});

	
	socket.on('updateServer', function(data){
		for(var i = 0; i < snakes.length; i++){
			if(snakes[i].id === socket.id){
				snakes[i].updateSnake(data);
			}
		}
	});
	
	socket.on('disconnect', function(data) {
      console.log('Client has disconnected - ', socket.id, data);
	  for(die = 0; die < snakes.length; die++){
		  if(snakes[die].id === socket.id){
			  for(convert = 0; convert < snakes[die].length; convert++){
				  let size = Math.floor(Math.random() * (30 - 10) + 10);
				  let colour = Math.floor(Math.random() * (6 - 0) + 0);
				  if(snakes[die].body[convert]){
					blobs.push(new foodBlob(snakes[die].body[convert].x, snakes[die].body[convert].y, size, colour));				  
				  }
			  }			  
			  io.sockets.emit('deadSnake', socket.id);
			  snakes.splice(die, 1);
			  console.log("Socket Id ", socket.id, " Spliced");
		  }
	  }
    });
	
});

class snake{
	
	constructor(id, xpos, ypos, size, length, name){
	
		this.id = id;
		this.body = [];
		this.size = size;
		this.length = length;
		this.name = name;
		for(var k = 0; k < this.length; k++){
			this.body.push({x: xpos, y: ypos});		
		}
			console.log(this.id, this.name);
		}
	
	updateSnake(data){
		for(var l = 0; l < this.length; l++){
			if(data[l].snakelength > this.length){
				this.body.push({x: data[l].snakebodyx, y: data[l].snakebodyy});	
				this.length ++;
				this.size = data[l].snakesize;
			}
			else if(this.body[l] != null){		
				this.size = data[l].snakesize;
				this.length = data[l].snakelength;
				this.body[l].x = data[l].snakebodyx;
				this.body[l].y = data[l].snakebodyy;
			}
		}
	}

	
}

class foodBlob{
	
	constructor(xpos, ypos, size, colour){
		
		this.x = xpos;
		this.y = ypos;
		this.size = size;
		this.colour = colour;
		
	}
	
}
