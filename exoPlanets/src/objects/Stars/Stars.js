import { Group, Points, ShaderMaterial, BufferGeometry, Float32BufferAttribute, BufferAttribute, AdditiveBlending,TextureLoader} from 'three';
import spark from './spark1.png';
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';

export default class Stars extends Group {
  constructor(amount) {
    
    super();

    this.name = 'stars';

    const starGeometry = new BufferGeometry();
    const starVertices = [];
    const amountStars = amount;

    for (let i = 0; i < amountStars; i++) {
        const x = (Math.random() - 0.5) * 2000; 
        const y = (Math.random() - 0.5) * 2000;
        const z = - (Math.random() - 0.5) * 1000;
        starVertices.push(x,y,z);
    }

    const starOpacities = new Float32Array(amountStars);

    starGeometry.setAttribute('position',new Float32BufferAttribute(starVertices,3));
    starGeometry.setAttribute('opacity',new BufferAttribute(starOpacities,1.));

    const starMaterial = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: AdditiveBlending,
        depthWrite:false,
        uniforms:{
            pointTexture: { value: new TextureLoader().load( spark) }
        }
    });
    const stars = new Points(starGeometry,starMaterial);

    this.add(stars);
    this.starsAttributes = stars.geometry.attributes;
  }

  update(){    
    for (let i = 0; i < this.starsAttributes.opacity.array.length; i++) {
      this.starsAttributes.opacity.array[ i ] = Math.random() * 0.5 + 0.5;
    }
    this.starsAttributes.opacity.needsUpdate = true;
  }
}
