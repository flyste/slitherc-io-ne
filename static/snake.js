

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
	for(var k = 1; k < this.length; k++){
		this.body[k] = createVector(x, y);
	}
  }
  
  eat(x, y, size){

	var pos = createVector(x,y);
    var d = p5.Vector.dist(this.body[0], pos);
    
    //print(floor(d), this.size / 2 + 10);
    
    if(floor(d) <= this.size / 2 + size){
		this.eaten += size;
		if(this.eaten / 10 > 4){
			this.grow();
			this.size += 0.1;
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
  
  
  
  show(){
    
	
	text(this.name, this.body[0].x - 30, this.body[0].y + 30);
    for(var j = this.length - 1; j >= 0 ; j--){
		//console.log(this.size, this.length, this.body.length);

		push();
		noStroke();
		if( j % 2 === 0){
			fill(255, 0, 255);
		}
		else {
			fill(255, 0, 0);
		}
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
	
	if(floor(p) <= (this.size / 2 + size)){
		console.log("hit");
		return(true);		
	}
	else{
		return(false);
	}
	  
  }
  
}



