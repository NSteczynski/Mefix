#version 460 core

in vec2 a_Position;
in vec2 a_Texcoord;

out vec2 v_Texcoord;

uniform mat4 u_View;

void main()
{
  v_Texcoord = vec2(a_Texcoord.x, a_Texcoord.y * -1.f);

  gl_Position = u_View * vec4(a_Position, -1.f, 1.f);
}
