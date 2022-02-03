
varying vec3 vertexNormal;
uniform vec3 viewVector;
//varying vec2 vertexUV;
varying float intensity;
uniform float c;
uniform float p;

void main(){   
    vertexNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize( normalMatrix * viewVector );
   // vertexUV = uv;
    intensity = pow( c - dot(vertexNormal, vNormel), p );
   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}