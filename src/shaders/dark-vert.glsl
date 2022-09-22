
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position * 1.7, 1.0 );
}