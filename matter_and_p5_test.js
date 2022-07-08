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


function matter_and_p5_test(){
  const catDefault = 1, //needs to be encoded like bits, only powers of 2 like in binary, bit field
  cat1 = 2,
  cat2 = 4,
  cat3 = 8;


  // create an engine
  var engine;
  var world;
  var myObjects = [];

  var ground;

  var connectedBoxes = [];
  var boxConst;

  var mConstraint;

  this.mySetup = function() {
    console.log(catDefault, cat1, cat2, cat3);

    var canvas = createCanvas(400, 400);
    engine = Engine.create();
    world = engine.world;
    Matter.Runner.run(engine);
    ground = new MyRect(200, 390, 400, 20, { isStatic: true });

    var tempBox1 = new MyRect(200, 200, 20, 20, { isStatic: true });
    var tempBox2 = new MyRect(50, 30, 30, 30);

    connectedBoxes.push(tempBox1);
    connectedBoxes.push(tempBox2);

    var box1 = new MyRect(100, 250, 40, 40, {collisionFilter: {category: cat1} });
    var box2 = new MyRect(150, 250, 30, 30, {collisionFilter: {category: cat2} });
    //var box3 = new MyRect(200, 250, 20, 20, {collisionFilter: {category: cat3} });

    var circle1 = new MyCircle(250, 250, 20, {collisionFilter: {mask: catDefault | cat1} });

    myObjects.push(box1);
    myObjects.push(box2);
    //myObjects.push(box3);
    myObjects.push(circle1);

    boxConst = new MyConsraint(tempBox1, tempBox2, 100, 0.4);


    var canvasMouse = Mouse.create(canvas.elt);
    mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse});
    World.add(engine.world, mConstraint);

  }

/*
  function mouseDragged(){
    myObjects.push(new MyRect(mouseX, mouseY, 15, 15, { collisionFilter: {category: cat1, mask: catDefault | cat1} }))
  }

  function mouseClicked(){
    myObjects.push(new MyCircle(mouseX, mouseY, 10, { collisionFilter: {category: cat2, mask: catDefault | cat2} }))
  }
*/
  this.myDraw = function() {
    //translate(20, -20); //messes up mouse pos


    background(51);

    ground.show();
    boxConst.show();

    for (let i = 0; i< myObjects.length; i++){
      myObjects[i].show() //for each element in list render it
    }

    for (let i = 0; i< connectedBoxes.length; i++){
      connectedBoxes[i].show() //for each element in list render it
    }
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
catagory uses bit field eww

ok final usage


myObjects.push(new MyRect(mouseX, mouseY, 15, 15, { collisionFilter: {category: cat1, mask: catDefault | cat1} })) //colides with itself and default, and not with the other block

myObjects.push(new MyRect(mouseX, mouseY, 20, 20, { collisionFilter: {category: cat2, mask: catDefault | cat2} }))


*/

/*
collisionFilter.catagory:
bit field

{ collisionFilter: {category: redCategory} }
to mask { collisionFilter: {mask: defaultCategory | greenCategory | blueCategory} }
also dont misspell catEgory as catAgory as it wont come up as a runtime error
*/