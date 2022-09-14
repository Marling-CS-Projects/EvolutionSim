
'use strict';

function MyRect(x, y, w, h, options, composite = engine.world) { //we need to add options to this
  this.body = Bodies.rectangle(x, y, w, h, options, composite); //{ collisionFilter: { group: group } }

  /*
  collisionFilter: {
      group: Body.nextGroup(true)
  },

  { collisionFilter: { group: -1 } }
  */

  this.w = w;
  this.h = h;

  Composite.add(composite, [this.body]); //

  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

function MyCircle(x, y, r, options, composite = engine.world) {
  this.body = Bodies.circle(x, y, r, options);

  this.r = r;

  Composite.add(composite, [this.body]);

  this.show = function () {
    var pos = this.body.position;
    //var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    //rotate(angle);
    rectMode(CENTER);
    circle(0, 0, r * 2);
    pop();
  }
}

function MyConsraint(body1, body2, length, stiffness, thickness = 1, composite = engine.world) { //have to pass box.body into this now

  var constr = Constraint.create({
    bodyA: body1,
    bodyB: body2,
    length: length,
    stiffness: stiffness
  })

  Composite.add(composite, constr);

  this.show = function () {
    strokeWeight(thickness);
    line(body1.position.x,
      body1.position.y,
      body2.position.x,
      body2.position.y);
    strokeWeight(1);
  }
}

function mouseInCanvas(x, y, canvasX, canvasY) {
  if (x > canvasX || x < 0 || y > canvasY || y < 0) {
    return false;
  }
  else {
    return true;
  }
}

function getDistance(x1, y1, x2, y2) {
  let y = x2 - x1;
  let x = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

function normaliseInput(value, min, max, destMin = 0, destMax = 1,) {
  return destMin + ((value - min) / (max - min)) * (destMax - destMin);
}

function MyCreature(McreatureID, compositeIn, McreatureColisionLayer, brain) { //this acts as one big class constructor, but with a lot less "this."
  let McreatureComposite = new Composite.create();
  let McreatureRenderer = [];

  let averageX = 0;

  this.averageX = averageX;
  this.McreatureID = McreatureID;
  this.McreatureComposite = McreatureComposite;
  this.McreatureColisionLayer = McreatureColisionLayer;
  this.McreatureRenderer = McreatureRenderer;

  if (brain) { //if brain != null
    this.brain = brain.copy();
  } else {
    this.brain = brain;
    this.brain = new NeuralNetwork(compositeIn.constraints.length, (compositeIn.constraints.length * 5), (compositeIn.constraints.length)); //changed to have same outpul length as constraints amount
  }

  this.copy = function (newBrain) { //needs work to work :)
    //this.brain.dispose()
    //this.brain = newBrain;
    console.log(this.brain);
    this.brain = newBrain;
    console.log(this.brain);
    //this.brain = brain.copy();
  }

  this.dispose = function () { //memory cleanup
    this.brain.dispose()
  }

  this.mutate = function () {
    this.brain.mutate(0.1);
  }

  this.think = function () {
    let inputs = [];

    for (let i = 0; i < McreatureComposite.constraints.length; i++) {
      let minVal = 35;
      if (compositeIn.constraints[i].length - 200 > 35) {
        minVal = compositeIn.constraints[i].length - 200;
      }
      //change below to https://stackoverflow.com/questions/51593409/how-to-get-range-from-0-1-based-on-two-number-range
      inputs[i] = normaliseInput(McreatureComposite.constraints[i].length, compositeIn.constraints[i].length + 200, minVal);
    }

    let outputs = this.brain.predict(inputs);

    // 0 - increase constraint [0] 1 - decrease constraint [0] 2 - increase constraint [1] 3 - decrease constraint [1]


    for(let i = 0; i < outputs.length; i++){ //for each constraint, so that multiple can move at once
      if(outputs[i] < 0.45 && McreatureComposite.constraints[i].length > 35 && McreatureComposite.constraints[i].length >= compositeIn.constraints[i].length - 200) {//0.45 <= x >= 0.55 = no movement, below is shrinking, above is growing
        McreatureComposite.constraints[i].length -= 5 * (0.5 - outputs[i]);
      }
      else if (outputs [i] > 0.55 && McreatureComposite.constraints[i].length <= compositeIn.constraints[i].length + 200) {
        McreatureComposite.constraints[i].length += 5 * (0.5 - (outputs[i] - 0.5));
      }
    }

    //enfrorce a max length of constraints
    for(let i = 0; i < McreatureComposite.constraints.length; i++) {
      if(McreatureComposite.constraints[i].length > compositeIn.constraints[i].length + 200){
        McreatureComposite.constraints[i].length = compositeIn.constraints[i].length + 200;
      }
    }
    /*
    const maxVal = output.indexOf(Math.max(...output));

    if (maxVal % 2 == 0) {//even
      if (McreatureComposite.constraints[maxVal / 2].length <= compositeIn.constraints[maxVal / 2].length + 200) {
        McreatureComposite.constraints[maxVal / 2].length += 5;
      }
      //increaseConstraint((maxVal / 2)); //need to make this function
    }
    else {//odd
      if (McreatureComposite.constraints[(maxVal - 1) / 2].length > 35 &&
        McreatureComposite.constraints[(maxVal - 1) / 2].length >= compositeIn.constraints[(maxVal - 1) / 2].length - 200) {
        McreatureComposite.constraints[(maxVal - 1) / 2].length -= 5;
      }
      //decreaseConstraint(((maxVal - 1) / 2));//and this, oe merge the imaginary functions
      
    }
    */
  }

  this.creatureSetup = function () {
    Composite.add(world, McreatureComposite);
    for (let i = 0; i < compositeIn.bodies.length; i++) {
      McreatureRenderer.push(new MyCircle(compositeIn.bodies[i].position.x, compositeIn.bodies[i].position.y, compositeIn.bodies[i].circleRadius,
        { collisionFilter: { category: McreatureColisionLayer, mask: 1 | McreatureColisionLayer } }, McreatureComposite));
    }
    for (let i = 0; i < compositeIn.constraints.length; i++) {
      //console.log(compositeIn.constraints[i].bodyA.id, compositeIn.constraints[i].bodyB.id)
      let j = 0;
      while (compositeIn.constraints[i].bodyA.id != compositeIn.bodies[j].id) {
        j++;
      }
      let tempBodyA = McreatureComposite.bodies[j];
      j = 0;
      while (compositeIn.constraints[i].bodyB.id != compositeIn.bodies[j].id) {
        j++;
      }
      let tempBodyB = McreatureComposite.bodies[j];

      McreatureRenderer.push(new MyConsraint(tempBodyA, tempBodyB, compositeIn.constraints[i].length, compositeIn.constraints[0].stiffness, 10, McreatureComposite))
    }

    this.creatureReset = function () {//remove all the bodies to make sure 0 references exist to it
      for (let i = 0; i < compositeIn.constraints.length; i++) {
        //Composite.remove(McreatureComposite, McreatureComposite.constraints[0].constr);
        Composite.remove(McreatureComposite, McreatureComposite.constraints[0]);
      }
      for (let i = 0; i < compositeIn.bodies.length; i++) {
        //Composite.remove(McreatureComposite, McreatureComposite.bodies[0].body);
        Composite.remove(McreatureComposite, McreatureComposite.bodies[0]);
      }
      McreatureRenderer.splice(0, McreatureRenderer.length);
      Composite.remove(world, McreatureComposite);
    }
  }

  this.show = function () {
    for (let i = 0; i < McreatureRenderer.length; i++) {
      McreatureRenderer[i].show() //for each element in list render it
    }
    //calculate average x
    let tempX = 0;
    for (let i = 0; i < McreatureComposite.bodies.length; i++) {
      tempX += McreatureComposite.bodies[i].position.x;
    }
    averageX = tempX / McreatureComposite.bodies.length;
    this.averageX = averageX;
    //console.log(averageX)
  }
}

//https://www.youtube.com/watch?v=cdUNkwXx-I4&list=PLRqwX-V7Uu6Yd3975YwxrR0x40XGJ_KGO&index=9
class NeuralNetwork {
  constructor(a, b, c, d) {
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.input_nodes = b;
      this.hidden_nodes = c;
      this.output_nodes = d;
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.model = this.createModel();
    }
  }

  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(
        modelCopy,
        this.input_nodes,
        this.hidden_nodes,
        this.output_nodes
      );
    });
  }

  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  dispose() {
    this.model.dispose();
  }

  predict(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      // console.log(outputs);
      console.log(inputs)
      console.log(outputs)
      return outputs;
    });
  }

  createModel() {
    const model = tf.sequential();
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: 'sigmoid'
    });
    model.add(hidden);
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: 'sigmoid' //was 'softmax'
    });
    model.add(output);
    return model;
  }
}