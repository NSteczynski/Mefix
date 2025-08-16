const mefix = @import("mefix");
const Transform = mefix.Transform;
const graphics = mefix.graphics;
const Sprite = graphics.Sprite;

const Object = @This();

transform: Transform = .zero,
sprite: ?Sprite = null,

pub fn update(object: *const Object) void {
    object.transform.update();
}

pub fn render(object: *const Object) void {
    if (object.sprite) |sprite|
        sprite.draw();
}
