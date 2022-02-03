import { Group,Mesh } from "three";

export default class SingleAsteroid extends Group{
    constructor(geometry,material){
        super();

        const asteroid = new Mesh(geometry,material);

        const scale = Math.random() *0.5 + 0.1;
        asteroid.scale.x = scale;
        asteroid.scale.y = scale;
        asteroid.scale.z = scale;
        asteroid.rotation.x = Math.random() * (Math.PI *2);
        asteroid.rotation.y = Math.random() * (Math.PI *2);
        asteroid.rotation.z = Math.random() * (Math.PI *2);

        this.add(asteroid);
    }
}