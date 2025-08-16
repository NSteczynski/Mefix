const std = @import("std");
const mefix = @import("mefix");
const Camera = mefix.Camera;
const graphics = mefix.graphics;
const Texture = graphics.Texture;
const Object = @import("Object.zig");

pub fn main() void {
    mefix.init(800, 600, "example");
    defer mefix.deinit();

    const texture = Texture.init(@embedFile("test_image.bmp"));
    defer texture.deinit();
    var object: Object = .{
        .sprite = .{ .texture = texture },
    };

    const camera: Camera = .{};

    while (mefix.loop()) {
        object.update();

        mefix.core.clearBackground(.sky_blue);
        camera.render();
        object.render();
    }
}
