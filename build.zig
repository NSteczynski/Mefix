const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const mod = b.addModule("mefix", .{
        .root_source_file = b.path("src/mefix.zig"),
        .target = target,
        .imports = &.{
            .{ .name = "zgl", .module = b.dependency("zgl", .{
                .target = target,
                .optimize = optimize,
            }).module("zgl") },
            .{ .name = "glfw", .module = b.dependency("glfw", .{
                .target = target,
                .optimize = optimize,
            }).module("glfw") },
        },
    });

    const exe = b.addExecutable(.{
        .name = "mefix",
        .root_module = b.createModule(.{
            .root_source_file = b.path("example/main.zig"),
            .target = target,
            .optimize = optimize,
            .imports = &.{
                .{ .name = "mefix", .module = mod },
            },
        }),
    });

    b.installArtifact(exe);
    const run_step = b.step("run", "Run the app");
    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);
    run_cmd.step.dependOn(b.getInstallStep());
}
