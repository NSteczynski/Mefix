const std = @import("std");
const mefix = @import("mefix");
const graphics = mefix.graphics;
const Texture = graphics.Texture;
const Sprite = graphics.Sprite;

pub fn main() void {
    mefix.init(800, 600, "example");
    defer mefix.deinit();

    const texture = Texture.init(@embedFile("test_image.bmp"));
    defer texture.deinit();
    const sprite: Sprite = .{ .texture = texture };

    const texture2 = Texture.init(@embedFile("test_image.png"));
    defer texture2.deinit();
    const sprite2: Sprite = .{ .texture = texture2 };

    while (mefix.loop()) {
        mefix.core.clearBackground(.sky_blue);
        sprite.draw();
        sprite2.draw();
    }
}
