attribute float opacity;
varying float _opacity;
void main(){
    _opacity = opacity;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = 10. * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}