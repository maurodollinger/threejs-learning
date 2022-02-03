import { Group, MeshPhongMaterial, PolyhedronGeometry, SmoothShading } from "three"
import SingleAsteroid from "./SingleAsteroid";


export default class AsteroidField extends Group{
    constructor(){
        super();

        const asteroids = [];
        const sizeMin = 0.5;
        const sizeMax = 2;
        const detail = 1;
        const randomize = 2;
        const count = 40;

        const material = new MeshPhongMaterial({flatShading:SmoothShading,color:0x161616});
        material.shininess = 0.2;

        const geometries = [];

        for (let i = 0; i < count; i++) {
            const size = sizeMin + Math.random() * (sizeMax - sizeMin);

            // Create asteroid form geometry
            const vertices = [
                1, 0, 0, 	- 1, 0, 0,	0, 1, 0,
                0, - 1, 0, 	0, 0, 1,	0, 0, - 1
            ];
            const indices = [
                0, 2, 4,	0, 4, 3,	0, 3, 5,
                0, 5, 2,	1, 2, 5,	1, 5, 3,
                1, 3, 4,	1, 4, 2
            ];

            const geometry = new PolyhedronGeometry(vertices,indices,size,detail);

            for (let b = 0; b < geometry.vertices; b++) {
                let vertice = geometry.vertices[b];

                vertice.x = (Math.random()-0.5) * randomize + vertice.x;
                vertice.y = (Math.random()-0.5) * randomize + vertice.y;
                vertice.z = (Math.random()-0.5) * randomize + vertice.z;
            }
            geometries.push(geometry);
        }

        for (let i = 0; i < count; i++) {
            const asteroid = new SingleAsteroid(geometries[i],material);
            asteroids.push(asteroid);

            asteroid.speed = Math.random() * -0.1;

            let rotationSpeedFactor = 0.005;
            let baseYPosition = 0;

            asteroid.rotationXSpeed = Math.random() * rotationSpeedFactor + rotationSpeedFactor;
            asteroid.rotationYSpeed = Math.random() * rotationSpeedFactor + rotationSpeedFactor;
            asteroid.rotationZSpeed = Math.random() * rotationSpeedFactor + rotationSpeedFactor;

            asteroid.position.x = (Math.random() - 0.5) * 30;
            asteroid.position.y = (Math.random() - 0.5) * 10;
            let zDepth = (Math.random() - 0.5);
            if(zDepth<0.3 && zDepth >0) zDepth = 0.3;
            if(zDepth>-0.3 && zDepth <0) zDepth = -0.3;
            console.log(zDepth);
            asteroid.position.z = zDepth * 8 ;
            this.add(asteroid);
        }
        this.asteroids = asteroids;
    }

    update(){
        for (let i = 0; i < this.asteroids.length; i++) {
            const asteroid = this.asteroids[i];
            
           // asteroid.position.x -= asteroid.speed; 

            asteroid.rotation.x -= asteroid.rotationXSpeed;
            asteroid.rotation.y -= asteroid.rotationYSpeed;
            asteroid.rotation.z -= asteroid.rotationZSpeed;
        }

    }
}