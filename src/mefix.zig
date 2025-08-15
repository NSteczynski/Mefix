const std = @import("std");
const glfw = @import("glfw");
const renderer = @import("renderer.zig");

pub const core = @import("core.zig");

pub fn init(width: u32, height: u32, title: [:0]const u8) void {
    core.init(width, height, title);
    renderer.init();
}

pub fn loop() bool {
    glfw.pollEvents();

    renderer.draw();

    core.window.swapBuffers();
    return !core.window.shouldClose();
}

pub fn deinit() void {
    renderer.deinit();
    core.deinit();
}
