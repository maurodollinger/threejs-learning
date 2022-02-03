varying float _opacity;
uniform sampler2D pointTexture;

void main(){
    vec3 color =  vec3(.8,.8,1.0);
    gl_FragColor = vec4(color,_opacity);
   gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}