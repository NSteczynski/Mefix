const std = @import("std");
const glfw = @import("glfw");

pub const graphics = @import("graphics.zig");
pub const core = @import("core.zig");

pub const Camera = @import("Camera.zig");
pub const Transform = @import("Transform.zig");

var timer: std.time.Timer = undefined;
pub var dt: f32 = 0;

pub fn init(width: u32, height: u32, title: [:0]const u8) void {
    core.init(width, height, title);
    graphics.init();

    timer = std.time.Timer.start() catch return std.process.exit(0);
}

pub fn loop() bool {
    const lap: f64 = @floatFromInt(timer.lap());
    dt = @floatCast(lap * 1e-6);
    glfw.pollEvents();

    core.window.swapBuffers();
    return !core.window.shouldClose();
}

pub fn deinit() void {
    graphics.deinit();
    core.deinit();
}
