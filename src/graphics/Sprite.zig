const renderer = @import("renderer.zig");
const Texture = @import("Texture.zig");

const Sprite = @This();

texture: Texture,

pub fn init(data: []const u8) Sprite {
    return .{
        .texture = Texture.init(data) orelse
            Texture.init(@embedFile("default.bmp")) orelse unreachable,
    };
}

pub fn draw(sprite: *Sprite) void {
    sprite.texture.bind();
    renderer.draw();
}

pub fn deinit(sprite: *Sprite) void {
    sprite.texture.deinit();
}
