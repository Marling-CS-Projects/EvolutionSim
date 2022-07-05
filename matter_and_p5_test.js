//const Matter = require("matter-js");

// module aliases
var Engine = Matter.Engine, //this is to cut down on typing
    World = Matter.World,
    //Render = Matter.Render, //using p5's renderer and runner
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite; 

// create an engine
var engine;
var world;
var boxes = [];

var ground;

var connectedBoxes = [];
var boxConst;

function setup() {
  createCanvas(400, 400);
  engine = Engine.create();
  world = engine.world;
  Matter.Runner.run(engine);
  ground = new MyRect(200, 390, 400, 20, { isStatic: true });
  var tempBox1 = new MyRect(50, 10, 10, 10, null);
  var tempBox2 = new MyRect(50, 30, 10, 10, null);

  connectedBoxes.push(tempBox1);
  connectedBoxes.push(tempBox2);

  boxConst = new MyConsraint(tempBox1, tempBox2, 50, 0.4);
/*
  var constr = Constraint.create({
    bodyA: tempBox1.body,
    bodyB: tempBox2.body,
    length: 50,
    stiffness: 0.4
  })
  World.add(engine.world, constr);
  */

  //boxA = new MyRect(100, 100, 20, 50);
}
/*
function draw() {
  background(220);
  boxA.show();
}
*/
function mouseDragged(){
  boxes.push(new MyCircle(mouseX, mouseY, 10, null)) //create a new box on click, pass null for no custom options :)
}

function draw(){
  background(51);

  ground.show();
  boxConst.show();

  for (let i = 0; i< boxes.length; i++){
    boxes[i].show() //for each element in list render it
  }

  for (let i = 0; i< connectedBoxes.length; i++){
    connectedBoxes[i].show() //for each element in list render it
  }

  /*
  line(connectedBoxes[0].body.position.x, 
      connectedBoxes[0].body.position.y, 
      connectedBoxes[1].body.position.x, 
      connectedBoxes[1].body.position.y);
      */
}