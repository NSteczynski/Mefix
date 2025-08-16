const renderer = @import("renderer.zig");
const Texture = @import("Texture.zig");

const Sprite = @This();

texture: Texture,

// pub const default: Sprite = .{
//     .texture = .init(@embedFile("default.bmp")),
// };
pub fn default() Sprite {
    return .{
        .texture = .init(@embedFile("default.bmp")),
    };
}

pub fn draw(sprite: *const Sprite) void {
    sprite.texture.bind();
    renderer.draw();
}
