varying vec3 vertexNormal;
//varying vec2 vertexUV;
varying float intensity;
uniform vec3 glowColor;

void main(){
   // float intensity = pow(0.7 - dot(vertexNormal,vec3(0,0,1.0)),3.0);
    vec3 color = glowColor * intensity;
    //vec3 color =  vec3(abs(sin(cos(time+3.*vertexUV.y)*2.*vertexUV.x+time)),
    //                    abs(cos(sin(time+2.*vertexUV.x)*3.*vertexUV.y+time)),
    //                    5.) * intensity;
    gl_FragColor = vec4(color,1.0) ;
}