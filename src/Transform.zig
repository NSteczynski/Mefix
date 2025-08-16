const core = @import("core.zig");
const vector = core.vector;
const renderer = @import("graphics/renderer.zig");

const Transform = @This();

position: vector.Vector,

pub const zero: Transform = .{ .position = vector.zero };

pub fn update(transform: *const Transform) void {
    renderer.set(.@"3fv", "u_Position", transform.position);
}
