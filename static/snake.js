

class snake{

  
  
  constructor(id, x, y, size, length, name){
	
	this.id = id;
	this.body = [];
  	this.size = size;
	this.length = length;
	this.alive = true;
	this.body[0] = createVector(x, y);
	this.eaten = 0;
	this.name = name;
	this.colourSeeds = [random(0, 255), random(0, 255), random(0, 255)];
	for(var k = 1; k < this.length; k++){
		this.body[k] = createVector(x, y);
	}
  }
  
  eat(x, y, size){

	var pos = createVector(x,y);
    var d = p5.Vector.dist(this.body[0], pos);
    
    //print(floor(d), this.size / 2 + 10);
    
    if(floor(d) <= this.size / 2 + size / 2){
		this.eaten += size;
		if(this.eaten / 10 > 4){
			this.grow();
			this.size += 0.9;
			this.eaten = this.eaten / 10;
		}
		//print("eaten");
		return(true);
	}
    else{
		return(false);
    }
  }
  
  grow(){
    this.length ++;
    this.body.push(createVector(this.body[this.length-2].x, this.body[this.length-2].y));    
  }
  
  
  
  show(colours){
    
	
	//text(this.name + " " + this.body[0].x + ":" + this.body[0].y, this.body[0].x - 30, this.body[0].y + 30);
	text(this.name, this.body[0].x - 30, this.body[0].y + 30);
    for(var j = this.length - 1; j >= 0 ; j--){
		//console.log(this.size, this.length, this.body.length);

		push();
		noStroke();
		if( j % 2 === 0){
			fill(this.colourSeeds[0], this.colourSeeds[1], this.colourSeeds[2]);
		}
		else {
			fill(this.colourSeeds[0], 0, 0);
		}
		blendMode(DIFFERENCE);
		ellipse(this.body[j].x, this.body[j].y, this.size);
		pop();
    }
  }
  
  update(speedup){
  
    for (var i = this.length - 1 ; i > 0; i--){
      this.body[i].x = this.body[i-1].x;
      this.body[i].y = this.body[i-1].y;    
    }
    
    var vel = createVector(mouseX - width / 2, mouseY - height / 2);

    //vel.sub(this.pos);
	if(speedup){
		vel.setMag(8);
	}
	else{
		vel.setMag(4);
	}
    this.body[0].add(vel);    
  }  
  
  die(x ,y, size){
	  
	var pos = createVector(x,y);
    var p = this.body[0].dist(pos);
	console.log(x, y);
	if(floor(p) <= (this.size / 2 + size / 2)){
		console.log("hit");
		return(true);		
	}
	else{
		return(false);
	}
	  
  }
  
  hitWall(){
	  
	var radius = this.size / 2;  
	if(this.body[0].x < (-800 + radius) || this.body[0].x > (800 * 3 - radius) || this.body[0].y < (-800 + radius) || this.body[0].y > (800 * 3 - radius)){
		return(true);
	}
	else{
		return(false);
	}
	  
  }
  
}



