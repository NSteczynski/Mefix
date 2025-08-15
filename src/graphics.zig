const renderer = @import("graphics/renderer.zig");

pub const Texture = @import("graphics/Texture.zig");
pub const Sprite = @import("graphics/Sprite.zig");

pub fn init() void {
    renderer.init();
}

pub fn deinit() void {
    renderer.deinit();
}
