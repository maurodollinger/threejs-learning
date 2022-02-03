import { Group, SphereGeometry, ShaderMaterial, Mesh, Color, CustomBlending, AddEquation, OneFactor, DstColorFactor, FrontSide, Vector3} from "three";
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import fragmentAtmosphere from '../../commons/shaders/fragmentAtmosphere.glsl';
import vertexAtmosphere from '../../commons/shaders/vertexAtmosphere.glsl';

export default class Sun extends Group{
    constructor(lightPosition){
        super();

        // SUN
        const geometry = new SphereGeometry(5,50,50);

        const sunMaterial = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms:{
                time:{
                    type:'f',
                    value:0.0
                }
            }
        });
        const sun = new Mesh(geometry,sunMaterial);
        sun.position.set(lightPosition.x,lightPosition.y,lightPosition.z);
        sun.scale.set(70,70,70);

        this.add(sun);
        this.sun = sun;

        //ATMOSPHERE
        const sunMaterialAtmosphere = new ShaderMaterial({
            vertexShader:vertexAtmosphere,
            fragmentShader:fragmentAtmosphere,
            blending:CustomBlending,
            blendEquation:AddEquation,
            blendSrc:OneFactor,
            blendDst:DstColorFactor,
            side:FrontSide,
            uniforms:{
                "c":   { type: "f", value: .4 },
                "p":   { type: "f", value: 3. },
                glowColor: { type: "c", value: new Color(0xF57660) },
                viewVector: { type: "v3", value: new Vector3(0.,0.,0.) }
            }
        })
        const sunAtmosphere = new Mesh(geometry,sunMaterialAtmosphere);
        sunAtmosphere.scale.set(1.2,1.2,1.2);
        sunAtmosphere.position.set(sun.position.x,sun.position.y,sun.position.z);

        this.add(sunAtmosphere);
        this.sunAtmosphere = sunAtmosphere;
        this.sunMaterialAtmosphere = sunMaterialAtmosphere;
    }

    update(timeStamp,cameraPosition){
        this.sun.material.uniforms.time.value = timeStamp / 10000 ;
        this.sunMaterialAtmosphere.uniforms.viewVector.value = new Vector3().subVectors( cameraPosition,this.sunAtmosphere.position);
    }
}