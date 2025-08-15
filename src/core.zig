const std = @import("std");
const zgl = @import("zgl");
const glfw = @import("glfw");

pub var window: glfw.Window = undefined;

pub fn init(width: u32, height: u32, title: [*:0]const u8) void {
    if (!glfw.init(.{})) {
        std.log.err("Failed to initialize GLFW!", .{});
        return std.process.exit(0);
    }

    window = glfw.Window.create(width, height, title, null, null, .{
        .client_api = .opengl_api,
        .context_version_major = 4,
        .context_version_minor = 6,
        .opengl_profile = .opengl_core_profile,
        .opengl_forward_compat = true,
    }) orelse {
        std.log.err("Failed to create GLFW window!", .{});
        return std.process.exit(0);
    };

    glfw.makeContextCurrent(window);
    glfw.swapInterval(0);
}
