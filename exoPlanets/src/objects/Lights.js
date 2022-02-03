import { Group, PointLight } from 'three';

export default class Lights extends Group {
  constructor() {
    super();

    const light = new PointLight({color:0xfdfbd3,intensity:10});
    light.position.set(-100,0,1500);

    this.add(light);
    this.light = light;
  }

  getLightPosition(){
    return this.light.position;
  }
}
