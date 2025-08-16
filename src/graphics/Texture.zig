const std = @import("std");
const zgl = @import("zgl");

const Texture = @This();

texture: zgl.Texture,

pub fn init(data: []const u8) Texture {
    const image_data = blk: {
        if (std.mem.eql(u8, data[0..2], "BM")) break :blk data;

        std.log.warn("Texture only supports BMP files!", .{});
        break :blk @embedFile("default.bmp");
    };

    const data_offset = std.mem.readInt(u32, image_data[10..14], .little);
    const image_width = std.mem.readInt(u32, image_data[18..22], .little);
    const image_height = std.mem.readInt(u32, image_data[22..26], .little);

    const texture = zgl.genTexture();
    texture.bind(.@"2d");

    texture.parameter(.wrap_s, .repeat);
    texture.parameter(.wrap_t, .repeat);
    texture.parameter(.mag_filter, .nearest);
    texture.parameter(.min_filter, .linear);

    zgl.textureImage2D(
        .@"2d",
        0,
        .rgb,
        image_width,
        image_height,
        .rgb,
        .unsigned_byte,
        image_data[data_offset..].ptr,
    );
    texture.generateMipmap();

    return .{ .texture = texture };
}

pub fn bind(texture: *const Texture) void {
    texture.texture.bind(.@"2d");
}

pub fn deinit(texture: *const Texture) void {
    texture.texture.delete();
}
