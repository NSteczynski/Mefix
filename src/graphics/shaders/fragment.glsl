#version 460 core

in vec2 v_Texcoord;

out vec4 f_Color;

uniform sampler2D texture0;

void main()
{
    f_Color = texture(texture0, v_Texcoord * vec2(1.f,-1.f));
}
