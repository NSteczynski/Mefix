pub const Vector = @Vector(3, f32);

pub const zero: Vector = .{ 0, 0, 0 };
pub const one: Vector = .{ 1, 1, 1 };

pub const forward: Vector = .{ 0, 0, 1 };
pub const back: Vector = -forward;

pub const up: Vector = .{ 0, 1, 0 };
pub const down: Vector = -up;

pub const right: Vector = .{ 1, 0, 0 };
pub const left: Vector = -right;
