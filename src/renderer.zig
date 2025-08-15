const std = @import("std");
const zgl = @import("zgl");

const Vertex = struct {
    position: a_Position,
    texcoord: a_Texcoord,

    pub const a_Position = [2]f32;
    pub const a_Texcoord = [2]f32;
};

const vertices: []const Vertex = &.{
    .{ .position = .{ -1, -1 }, .texcoord = .{ 0, 0 } },
    .{ .position = .{ -1, 1 }, .texcoord = .{ 0, 1 } },
    .{ .position = .{ 1, 1 }, .texcoord = .{ 1, 1 } },
    .{ .position = .{ 1, -1 }, .texcoord = .{ 1, 0 } },
};

const indices: []const u16 = &.{
    2, 1, 0,
    3, 2, 0,
};

var program: zgl.Program = undefined;
var vao: zgl.VertexArray = undefined;
var vbo: zgl.Buffer = undefined;
var ebo: zgl.Buffer = undefined;

pub fn init() void {
    program = zgl.createProgram();

    const vertex_shader = compileShader(@embedFile("shaders/vertex.glsl"), .vertex);
    const fragment_shader = compileShader(@embedFile("shaders/fragment.glsl"), .fragment);

    program.attach(vertex_shader);
    zgl.deleteShader(vertex_shader);
    program.attach(fragment_shader);
    zgl.deleteShader(fragment_shader);
    program.link();
    program.use();

    vao = zgl.genVertexArray();
    vao.bind();

    vbo = zgl.genBuffer();
    vbo.bind(.array_buffer);
    vbo.data(Vertex, vertices, .static_draw);

    ebo = zgl.genBuffer();
    ebo.bind(.element_array_buffer);
    ebo.data(u16, indices, .static_draw);

    enableAttrib("position", "a_Position");
    enableAttrib("texcoord", "a_Texcoord");
}

pub fn draw() void {
    zgl.drawElements(
        .triangles,
        indices.len,
        .unsigned_short,
        0,
    );
}

pub fn deinit() void {
    program.delete();
    vao.delete();
    vbo.delete();
    ebo.delete();
}

fn compileShader(data: []const u8, shader_type: zgl.ShaderType) zgl.Shader {
    const shader = zgl.createShader(shader_type);
    shader.source(1, &[1][]const u8{data});
    shader.compile();

    if (shader.get(.compile_status) == 0) {
        shader.delete();

        const info_log = shader.getCompileLog(std.heap.page_allocator) catch unreachable;
        defer std.heap.page_allocator.free(info_log);

        std.log.err("Failed to compile {s} shader: {s}", .{ @tagName(shader_type), info_log });
        return zgl.Shader.invalid;
    }

    return shader;
}

fn enableAttrib(comptime name: []const u8, comptime shader_type_name: [:0]const u8) void {
    const index = program.attribLocation(shader_type_name) orelse
        return std.log.err("Shader is missing type: {s}!", .{shader_type_name});

    zgl.vertexAttribPointer(
        index,
        @typeInfo(@field(Vertex, shader_type_name)).array.len,
        .float,
        false,
        @sizeOf(Vertex),
        @offsetOf(Vertex, name),
    );
    zgl.enableVertexAttribArray(index);
}
