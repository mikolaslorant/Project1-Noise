varying vec2 vUv;
varying vec3 vPos;
uniform int time;
uniform float atmosphere;

// Taken from CIS 5600 modified for this assignment slides
float noise3D( vec3 p )
{
    return fract(sin((dot(p, vec3(127.1,
                                  311.7,
                                  191.999)))) *         
                 43758.5453);
}

float noise3D2( vec3 p )
{
    return fract(cos((dot(p, vec3(150.1,
                                  23.7,
                                  191.999)))) *         
                 600445.5453);
}

float noise3D3( vec3 p )
{
    return fract(sin(cos(dot(p, vec3(50.1,
                                  313.7,
                                  200.999)))) *         
                 43758.5453);
}

float cosine_interpolate(float a, float b, float t)
{
    // Result in range [0, 1]
    float cos_t = (1.0 - cos(t * 3.141592653589)) * 0.5;
    return mix(a, b, cos_t);
}

float interpNoise3D(float x, float y, float z)
{
    int intX = int(floor(x));
    float fractX = fract(x);
    int intY = int(floor(y));
    float fractY = fract(y);
    int intZ = int(floor(z));
    float fractZ = fract(z);
    // Perform trilnear interpolation
    float v1 = noise3D(vec3(intX, intY, intZ));
    float v2 = noise3D(vec3(intX + 1, intY, intZ));
    float v3 = noise3D(vec3(intX, intY + 1, intZ));
    float v4 = noise3D(vec3(intX + 1, intY + 1, intZ));
    // Added z+1 plane
    float v5 = noise3D(vec3(intX, intY, intZ + 1));
    float v6 = noise3D(vec3(intX + 1, intY, intZ + 1));
    float v7 = noise3D(vec3(intX, intY + 1, intZ + 1));
    float v8 = noise3D(vec3(intX + 1, intY + 1, intZ + 1));
    // Interpolate points
    // in X axis:
    float i1 = cosine_interpolate(v1, v2, fractX);
    float i2 = cosine_interpolate(v3, v4, fractX);
    float i3 = cosine_interpolate(v5, v6, fractX);
    float i4 = cosine_interpolate(v7, v8, fractX);
    // in Y axis
    float i5 = cosine_interpolate(i1, i2, fractY);
    float i6 = cosine_interpolate(i3, i4, fractY);
    // in Z axis
    float i7 = cosine_interpolate(i5, i6, fractZ);
    return i7;
}


float multiOctaveLatticeValueNoise(float x, float y, float z)
{
    float total = 0.0;
    float persistence = 0.7;
    float freq = 2.0;
    float amp = 0.5;
    // 8 octaves
    for(int i = 1; i <= 8; i++)
    {
        total += interpNoise3D(x * freq,
                               y * freq,
                               z * freq) * amp;

        freq *= 2.0;
        amp *= persistence;
    }
    return total;
}


//


void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 blue = vec4(0.4, 0.5, 1, 0.3);
  vec4 white = vec4(1, 1, 1, 0.4);
  float timef = float(time) * 0.1;
  float noise = multiOctaveLatticeValueNoise(vPos.x ,  vPos.y , vPos.z );
  
  vec4 color = mix(blue, white, noise);
  float len = length(vec3(color)) + atmosphere * 0.008;
  if (len < 1.9 && len > 1.88)
  {
    color = vec4(1.0, 1.0, 1.0, 1.0); 
  }
  else if (len < 1.88)
  {
    color = vec4(0);
  }
  gl_FragColor = vec4( color.rgba);

}