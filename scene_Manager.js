var scene1 = true;
var scene2 = false;
var scene3 = false;

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

if (scene1 == true){ //put source here? the other scripts may still be running and I dont like that.
    creature_Creator();
}
else if (scene2 == true){
    matter_and_p5_test();
}

function mouseClicked(){
    scene1 = false;
    scene2 = true;
    console.log(scene1, scene2);
}

function setup() {
  mySetup();
}

function draw(){
  myDraw();
}