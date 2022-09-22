varying vec4 vNor;
varying vec4 vCam;

void main()
{
    
    vec4 pos = vec4(position * 1.78, 1.0);
    vNor = vec4(normalMatrix * vec3(normal), 0); 
    vCam = vec4(cameraPosition, 1) - pos;

    gl_Position = projectionMatrix * modelViewMatrix * pos;
}