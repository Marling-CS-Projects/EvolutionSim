//const Matter = require("matter-js");

// module aliases
var Engine = Matter.Engine, //this is to cut down on typing
    World = Matter.World,
    //Render = Matter.Render, //using p5's renderer and runner
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine;
var world;
var boxes = [];
var ground;

function setup() {
  createCanvas(400, 400);
  engine = Engine.create();
  world = engine.world;
  Matter.Runner.run(engine);
  ground = new MyRect(200, 390, 400, 20, { isStatic: true });
  //boxA = new MyRect(100, 100, 20, 50);
}
/*
function draw() {
  background(220);
  boxA.show();
}
*/
function mouseDragged(){
  boxes.push(new MyRect(mouseX, mouseY, 20, 20, null)) //create a new box on click, pass null for no custom options :)
}

function draw(){
  background(51);

  ground.show();

  for (let i = 0; i< boxes.length; i++){
    boxes[i].show() //for each element in list render it
  }
}