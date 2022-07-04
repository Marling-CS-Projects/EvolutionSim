function MyRect(x, y, w, h){ //we need to add options to this
    this.body = Bodies.rectangle(x, y, w, h);

    this.w = w;
    this.h = h;

    World.add(engine.world, [boxA]);

    this.show = function(){
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rect(0, 0, this.w, this.h);
        pop();
    }
}