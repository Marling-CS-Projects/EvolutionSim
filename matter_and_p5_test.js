//const Matter = require("matter-js");

//const { WEBGL } = require("phaser");

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
  ground = new MyRect(200, 390, 400, 20, { isStatic: true, collisionFilter: {group: 0, mask: -1} });

  var tempBox1 = new MyRect(200, 200, 20, 20, { isStatic: true, collisionFilter: {group: 0, mask: -1} });
  var tempBox2 = new MyRect(50, 30, 30, 30, {collisionFilter: {group: 0, mask: -1} });

  connectedBoxes.push(tempBox1);
  connectedBoxes.push(tempBox2);

  boxConst = new MyConsraint(tempBox1, tempBox2, 100, 0.4);
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
  boxes.push(new MyRect(mouseX, mouseY, 15, 15, { collisionFilter: {group: 1, mask: 1} }))
}

function mouseClicked(){
  boxes.push(new MyRect(mouseX, mouseY, 20, 20, { collisionFilter: {group: 1, mask: 2} }))
}

function draw(){
  //translate(20, -20); //messes up mouse pos


  background(51);

  ground.show();
  boxConst.show();

  for (let i = 0; i< boxes.length; i++){
    boxes[i].show() //for each element in list render it
  }

  for (let i = 0; i< connectedBoxes.length; i++){
    connectedBoxes[i].show() //for each element in list render it
  }
}

/*
Collision Logic:

collisionFilter.group will colide always if pos, never if neg
e.g. collisionFilter: {group: -4} will never collide and collisionFilter: {group: 4} will always colide (0 is the default)
this logic above is true when body A and B share a collisionFilter group and group != 0
if not masks come into this

https://blog.ourcade.co/posts/2020/phaser-3-matter-physics-collision-filter/

collisionFilter: {catagory: 1, mask: -1, group: 0} are the defaults
catagory uses bitmasks eww

*/