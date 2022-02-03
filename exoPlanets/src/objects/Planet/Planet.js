import { Group, SphereGeometry, TextureLoader, ShaderMaterial, UniformsUtils, UniformsLib, Mesh,
    CustomBlending, AddEquation, OneFactor, DstColorFactor, FrontSide, Color, Vector3} from "three";
import texture from './texture.jpg';
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import fragmentAtmosphere from '../../commons/shaders/fragmentAtmosphere.glsl';
import vertexAtmosphere from '../../commons/shaders/vertexAtmosphere.glsl';

export default class Planet extends Group{
    constructor(){
        super();

        // PLANET
        const geometry = new SphereGeometry(5,50,50);

        const globeTexture = new TextureLoader().load(texture);
        
        const material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms:
              UniformsUtils.merge([
                UniformsLib['lights'],
                {
                    lightIntensity: {type: 'f', value: 1.},
                    globeTexture: {type: 't', value: null}
                }
            ]),
            lights:true
        });
        material.uniforms.globeTexture.value = globeTexture;

        const planet = new Mesh(geometry,material);

        this.add(planet);

        this.planet = planet;

        // ATMOSPHERE

        const materialAtmosphere = new ShaderMaterial({
            vertexShader: vertexAtmosphere,
            fragmentShader: fragmentAtmosphere,
            blending:CustomBlending,
            blendEquation:AddEquation,
            blendSrc:OneFactor,
            //blendDst:THREE.OneMinusDstColorFactor,
            blendDst:DstColorFactor,
            side:FrontSide,
            transparent:true,
            uniforms:{
                "c":   { type: "f", value: 0.1 },
                "p":   { type: "f", value: 6.0 },
                glowColor: { type: "c", value: new Color(0x66334c) },
                viewVector: { type: "v3", value: new Vector3(0.,0.,0.) }
            }
        });

        const atmosphere = new Mesh(geometry,materialAtmosphere);
        atmosphere.position.set(planet.position.x,planet.position.y,planet.position.z);
        atmosphere.scale.set(1.1,1.1,1.1);

        this.add(atmosphere);

        this.atmosphere = atmosphere;
        this.materialAtmosphere = materialAtmosphere;
    }

    update(timeStamp,cameraPosition){
        this.planet.rotation.y = timeStamp / 10000;
        this.atmosphere.rotation.y = timeStamp / 10000;
        this.materialAtmosphere.uniforms.viewVector.value = new Vector3().subVectors( cameraPosition,this.atmosphere.position);
    }
}