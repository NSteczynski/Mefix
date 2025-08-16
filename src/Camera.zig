const std = @import("std");
const renderer = @import("graphics/renderer.zig");
const core = @import("core.zig");
const vector = core.vector;

const Camera = @This();

position: vector.Vector = vector.zero,
near: f32 = 0.1,
far: f32 = 100.0,
scale: f32 = 10,

pub fn render(camera: *const Camera) void {
    renderer.set(.matrix4fv, "u_View", camera.orthographic());
}

fn orthographic(camera: *const Camera) [4][4]f32 {
    const left = camera.position[0] - camera.scale / 2.0;
    const right = camera.position[0] + camera.scale / 2.0;
    const top = camera.position[1] + camera.scale / 2.0;
    const bottom = camera.position[1] - camera.scale / 2.0;

    var data: [4][4]f32 = .{
        .{0} ** 4,
        .{0} ** 4,
        .{0} ** 4,
        .{0} ** 4,
    };

    data[0][0] = 2 / (right - left);
    data[1][1] = 2 / (top - bottom);
    data[2][2] = 2 / (camera.near - camera.far);
    data[3][3] = 1;

    data[3][0] = (left + right) / (left - right);
    data[3][1] = (bottom + top) / (bottom - top);
    data[3][2] = (camera.far + camera.near) / (camera.near - camera.far);

    return data;
}
