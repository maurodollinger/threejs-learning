import { Group } from 'three';
import Stars from './Stars/Stars.js';
import Planet from './Planet/Planet.js';
//import Sun from './Sun/Sun.js';
import Lights from './Lights.js';
import AsteroidField from './Asteroids/AsteroidField.js';

var stars, planet,asteroidField, sun, lights;
export default class UniverseScene extends Group {
  constructor() {
    super();

    stars = new Stars(2000);
    planet = new Planet();
    asteroidField = new AsteroidField();
    lights = new Lights();
   // sun = new Sun(lights.getLightPosition());
    
    this.add(stars);
   this.add(planet);
    this.add(asteroidField);
   // this.add(sun);
    this.add(lights);

    console.log(this);
  }

  update(timeStamp,camera) {
    stars.update();
    planet.update(timeStamp,camera.position);
    asteroidField.update();
   // sun.update(timeStamp,camera.position);
    this.rotation.y = timeStamp / 10000;
  }
}