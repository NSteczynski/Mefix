const renderer = @import("renderer.zig");
const Texture = @import("Texture.zig");

const Sprite = @This();

texture: Texture,

pub fn draw(sprite: *const Sprite) void {
    sprite.texture.bind();
    renderer.draw();
}
