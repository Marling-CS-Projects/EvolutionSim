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
var boxA;

function setup() {
  createCanvas(400, 400);
  engine = Engine.create();
  world = engine.world;
  Matter.Runner.run(engine);
  boxA = new myRect(100, 100, 20, 50);
}

function draw() {
  background(220);
  boxA.show();
}