

// module aliases
var Engine = Matter.Engine, //this is to cut down on typing
    World = Matter.World,
    //Render = Matter.Render, //using p5's renderer and runner
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

  var defaultCategory = 0x0001,
      redCategory = 0x0002,
      greenCategory = 0x0004,
      blueCategory = 0x0008;


// create an engine
var engine;
var world;
var boxes = [];

var ground;

var connectedBoxes = [];
var boxConst;

var mConstraint;

function setup() {
  var canvas = createCanvas(400, 400);
  engine = Engine.create();
  world = engine.world;
  Matter.Runner.run(engine);
  ground = new MyRect(200, 390, 400, 20, { isStatic: true, collisionFilter: {group: 0, mask: -1} });

  var tempBox1 = new MyRect(200, 200, 20, 20, { isStatic: true, collisionFilter: {group: 0, mask: -1} });
  var tempBox2 = new MyRect(50, 30, 30, 30, {collisionFilter: {group: 0, mask: -1} });

  connectedBoxes.push(tempBox1);
  connectedBoxes.push(tempBox2);

  var box1 = new MyRect(100, 250, 40, 40, {collisionFilter: {category: redCategory} });
  console.log(box1);
  var box2 = new MyRect(150, 250, 30, 30, {collisionFilter: {category: blueCategory} });
  var box3 = new MyRect(200, 250, 20, 20, {collisionFilter: {category: greenCategory} });

  var circle1 = new MyCircle(250, 250, 20, {collisionFilter: {mask: defaultCategory | greenCategory | blueCategory} });

  boxes.push(box1);
  boxes.push(box2);
  boxes.push(box3);
  boxes.push(circle1);

  boxConst = new MyConsraint(tempBox1, tempBox2, 100, 0.4);

  var canvasMouse = Mouse.create(canvas.elt);
  mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse});
  World.add(engine.world, mConstraint);
}

/*
function mouseDragged(){
  boxes.push(new MyRect(mouseX, mouseY, 15, 15, { collisionFilter: {group: 1, mask: 1} }))
}

function mouseClicked(){
  boxes.push(new MyRect(mouseX, mouseY, 20, 20, { collisionFilter: {group: 2, mask: 2} }))
}
*/
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