const std = @import("std");
const zgl = @import("zgl");
const glfw = @import("glfw");

pub var window: glfw.Window = undefined;

fn glGetProcAddress(_: glfw.GLProc, proc: [:0]const u8) ?zgl.binding.FunctionPointer {
    return glfw.getProcAddress(proc);
}

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

    const proc: glfw.GLProc = undefined;
    zgl.loadExtensions(proc, glGetProcAddress) catch |err| {
        std.log.err("Failed to load OpenGL functions: {}!\n", .{err});
        return std.process.exit(0);
    };

    window.setRefreshCallback(refresh);

    zgl.enable(.depth_test);
    zgl.depthFunc(.less);

    zgl.enable(.cull_face);
    zgl.cullFace(.back);
    zgl.frontFace(.ccw);

    zgl.enable(.blend);
    zgl.blendFunc(.src_alpha, .one_minus_src_alpha);

    zgl.polygonMode(.front_and_back, .fill);
}

pub const Color = struct {
    data: @Vector(4, f32),

    pub const sky_blue = new(135, 206, 235, 255);

    pub fn new(r: u8, g: u8, b: u8, a: u8) Color {
        return .{ .data = .{ r, g, b, a } };
    }

    pub fn normalize(color: Color) @Vector(4, f32) {
        return color.data / @as(@Vector(4, f32), @splat(255));
    }
};

pub fn clearBackground(color: Color) void {
    const normalized = color.normalize();
    zgl.clearColor(normalized[0], normalized[1], normalized[2], normalized[3]);
    zgl.clear(.{ .color = true, .depth = true });
}

fn refresh(w: glfw.Window) void {
    const size = w.getSize();
    zgl.viewport(0, 0, size.width, size.height);
}

pub fn deinit() void {
    window.destroy();
    glfw.terminate();
}
