varying vec2 vertexUV;
varying vec3 vertexNormal;
varying vec3 vecPos;
varying float noise;

uniform float lightIntensity;
uniform sampler2D globeTexture;

struct PointLight{
    vec3 color;
    vec3 position;
    float distance;
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];
void main(){
    vec4 addedLights = vec4(0.0,0.0,0.0,1.0);
    for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
        vec3 lightDirection = normalize(vecPos - pointLights[l].position);
        addedLights.rgb += clamp(dot(-lightDirection,vertexNormal), 0.0, 1.0) * pointLights[l].color * lightIntensity;
    }
    //texture2D(globeTexture,vertexUV);
    float intensity = 1.05 - dot(vertexNormal,vec3(0.0,0.0,1.0));
    vec4 atmosphere = vec4(vec3(0.4,0.2,.3) * pow(intensity,2.5),1.0);
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vertexUV) * addedLights) * ( 1. - 2. * noise );
}