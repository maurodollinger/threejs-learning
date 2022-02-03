attribute float opacity;
varying vec2 vertexUV;
varying float _opacity;
void main(){
    vertexUV = uv;
    _opacity = opacity;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = 10. * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}