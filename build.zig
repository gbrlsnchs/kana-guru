const std = @import("std");
const zig = std.zig;

pub fn build(b: *std.build.Builder) void {
    const mode = b.standardReleaseOptions();
    const target = zig.CrossTarget.parse(.{ .arch_os_abi = "wasm32-freestanding" }) catch unreachable;

    const lib = b.addSharedLibrary("kana", "src/kana.zig", .unversioned);
    lib.setBuildMode(mode);
    lib.setTarget(target);
    lib.addPackagePath("kana", "deps/kana/src/lib.zig");
    lib.install();
}
