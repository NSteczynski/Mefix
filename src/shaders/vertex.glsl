#version 460 core

in vec2 a_Position;
in vec2 a_Texcoord;

out vec2 v_Texcoord;

void main()
{
  v_Texcoord = vec2(a_Texcoord.x, a_Texcoord.y);

  gl_Position = vec4(a_Position, 0.f, 1.f);
}
