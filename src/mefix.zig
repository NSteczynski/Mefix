const std = @import("std");
const glfw = @import("glfw");

pub const graphics = @import("graphics.zig");
pub const core = @import("core.zig");

pub const Camera = @import("Camera.zig");
pub const Transform = @import("Transform.zig");

pub fn init(width: u32, height: u32, title: [:0]const u8) void {
    core.init(width, height, title);
    graphics.init();
}

pub fn loop() bool {
    glfw.pollEvents();

    core.window.swapBuffers();
    return !core.window.shouldClose();
}

pub fn deinit() void {
    graphics.deinit();
    core.deinit();
}
