const std = @import("std");
const mefix = @import("mefix");

pub fn main() void {
    mefix.init(800, 600, "example");
    defer mefix.deinit();

    var sprite = mefix.graphics.Sprite.init(@embedFile("test_image.bmp"));
    defer sprite.deinit();

    while (mefix.loop()) {
        mefix.core.clearBackground(.sky_blue);
        sprite.draw();
    }
}
