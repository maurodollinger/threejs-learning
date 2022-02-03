varying vec2 vertexUV;
varying vec3 vertexNormal;
varying float noise;

void main(){   
    float intensity = 1.05 - dot(vertexNormal,vec3(0.0,0.0,1.0));
    vec4 atmosphere = vec4(vec3(0.6,0.3,0.1) * pow(intensity,-.5),1.0);
    vec4 color = vec4(0.9,0.5,0.2,1.) ;
    gl_FragColor = vec4(mix(color,atmosphere,vec4(1.0))) * ( 1. - 2. * noise );
}