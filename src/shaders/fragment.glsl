#version 460 core

in vec2 v_Texcoord;

out vec4 f_Color;

void main()
{
  f_Color = vec4(v_Texcoord,0.f,1.f);
}
