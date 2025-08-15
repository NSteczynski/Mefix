const std = @import("std");
const mefix = @import("mefix");

pub fn main() void {
    mefix.init(800, 600, "example");
    defer mefix.deinit();
    defer while (mefix.loop()) {
        mefix.core.clearBackground(.sky_blue);
    };
}
