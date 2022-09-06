function evolution_Scene(creatureCompositeIn){

  //collision catagories and masks, all powers of 2, like bits

  //https://www.youtube.com/watch?v=lu5ul7z4icQ&list=PLRqwX-V7Uu6Yd3975YwxrR0x40XGJ_KGO
  //^^for next time

  var ground;

  let creatureContainer = [];
  const creatureNum = 32;
  let bestCreaturesFromLast = [];
  let firstBestID;
  let secondBestID;
  let timerStarted = false;
  let startingPos;
  let currentGen = 0;

  var world;

  this.mySetup = function() {
    var canvas = createCanvas(800, 800);
    var engine = Engine.create();
    world = engine.world;
    Matter.Runner.run(engine);

    engine.gravity.scale = 0.001;
    engine.gravity.y = 1;

    ground = new MyRect(400, 1100, 9999999, 500, { isStatic: true }, world);
    //console.log(ground);

    tf.setBackend("cpu"); //idk

    for(let i = 0; i < creatureNum; i++){ //32 differnt collision layers is max due to bitmask, so thats 32 different creature limit
      creatureContainer.push(new MyCreature(i, creatureCompositeIn, 2**i))
      creatureContainer[i].creatureSetup();
      Composite.add(world, creatureContainer[i].McreatureComposite);
    }

    console.log(engine)
    console.log(creatureContainer)
  }

  this.myDraw = function(){
    background(51);
    
    //const zoom = map(mouseX, 0, width, 0.5, 2)
    let bestX = 0;
    for(let i = 0; i < creatureContainer.length; i++){
      let temp = creatureContainer[i].averageX
      if(temp > bestX && firstBestID != creatureContainer[i].McreatureID){
        bestX = temp;
        firstBestID = creatureContainer[i].McreatureID;
        //console.log("new 1st place, ", firstBestID, " at ", bestX)
      }
    }

    if(startingPos == null){
      startingPos = bestX;
    }

    const zoom = 0.6;
    const shiftX = -bestX * zoom + width / 2; //replace with leading creature
    //const shiftY = -creatureContainer[0].McreatureComposite.bodies[0].position.y * zoom + height / 2;
    push()
    translate(shiftX, 0)
    scale(zoom)
    background(51);
    ground.show();
    for (let i = 0; i< creatureContainer.length; i++){
      creatureContainer[i].show() //for each element in list render it
      creatureContainer[i].think(); //nn things
    }
    pop()

    stroke(0);
    fill(150); 
    textSize(32);
    text('Generation: ' + currentGen, 0, 42);
    text(("Current Best Creature: " + (firstBestID + 1) + " at " + parseInt((bestX - startingPos))), 0, 72)
    fill(255); 

    if(!timerStarted){
      setTimeout(nextGen, 10000); //10 secs
      timerStarted = true;
      startingPos = null;
    }
  }

  this.myMouseClicked = function(){
    console.log(creatureContainer)
  }

  function nextGen(){
    //console.log('next generation');
    currentGen += 1;

    //find first, second and third best
    findBest()

    for (let i = 0; i < creatureNum; i++) { //half are from num 1
      if(i < creatureNum / 2){ //half use 1st
        creatureContainer[i] = mutateCreature(0, i);
      }
      else{ //half use 2nd
        creatureContainer[i] = mutateCreature(1, i);
      }
      //console.log(creatureContainer, "help")
    }
    Composite.clear(world, true)
    for (let i = 0; i < creatureNum; i++){
      creatureContainer[i].creatureSetup();
      Composite.add(world, creatureContainer[i].McreatureComposite);
    }
    console.log(world)
    timerStarted = false;
  }
  
  function mutateCreature(ID, index) {
    let child = new MyCreature(index, creatureCompositeIn, 2**index, bestCreaturesFromLast[ID].brain);
    child.mutate();
    return child;
  }

  function findBest() {
    let bestX = 0;
    let tempArray = [];
    for(let i = 0; i < creatureContainer.length; i++){
      tempArray.push(creatureContainer[i].averageX);
    }
    //console.log(tempArray)

    for(let i = 0; i < tempArray.length; i++){
      let temp = tempArray[i]
      if(temp > bestX){
        bestX = temp;
        firstBestID = i;
      }
    }
    //console.log(firstBestID)
    bestCreaturesFromLast.push(creatureContainer[firstBestID])

    tempArray.splice(firstBestID, 1, 0);
    //console.log(tempArray)
    bestX = 0;
    for(let i = 0; i < tempArray.length; i++){
      let temp = tempArray[i]
      //console.log(temp);
      if(temp > bestX){
        bestX = temp;
        secondBestID = i;
      }
    }
    //console.log(secondBestID)
    bestCreaturesFromLast.push(creatureContainer[secondBestID])
    //console.log(bestCreaturesFromLast);
  }
}
