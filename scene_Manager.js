var sceneIndex = 0; //put on cookie to maintain through refresh? TODO learn what a cookie is

/*
scene index list:
(bit temp rn bc script names are stupid rn)
0: creature_Creator
1: matter_and_p5_test
*/

/*
scene index list: //a mock up
0: title page / main menu
1: creatmure creator
2: sim
3: results
*/

//p5 DOM library for buttons (seperate library to ref in the html) <----------------------------------------

var Engine = Matter.Engine, //need to make sure all needed matter.js stuff for all scripts is here
    World = Matter.World,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

if (sceneIndex == 0){
    creature_Creator();
}
else if (sceneIndex == 1){
    matter_and_p5_test();
}

/*
function mouseClicked(){
  sceneIndex -= 1;
  console.log(sceneIndex)
  if (sceneIndex == 0){
      creature_Creator();
      mySetup();
  }
  else if (sceneIndex == 1){
      matter_and_p5_test();
      mySetup();
  }
}
*/


function setup() {
  mySetup();//setup is called once, need a different inbuilt function for this
}

function draw(){
  myDraw();
}

function mouseClicked(){
  myMouseClicked(); //preferably, this would be function anyInputPressed(), but this is a start for now, this is also currently only scene switching, will change when buttons are a thing
}

function changeScene(newSceneIndex){
  sceneIndex = newSceneIndex;
  if (sceneIndex == 0){
    creature_Creator();
    mySetup();
  }
  else if (sceneIndex == 1){
    matter_and_p5_test();
    mySetup();
  }
}