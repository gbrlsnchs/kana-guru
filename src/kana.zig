const std = @import("std");
const kana = @import("kana");

const heap = std.heap;
const mem = std.mem;

var gpa = heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

pub fn log(
    comptime message_level: std.log.Level,
    comptime scope: @Type(.EnumLiteral),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = message_level;
    _ = scope;
    _ = format;
    _ = args;
}

extern fn handleResult(ptr: [*]const u8, len: usize) void;

export fn allocString(len: usize) [*]const u8 {
    const slice = allocator.alloc(u8, len) catch @panic("failed to allocate memory");
    return slice.ptr;
}

export fn freeString(ptr: [*:0]u8) void {
    allocator.free(mem.span(ptr));
}

export fn transliterate(
    input: [*:0]const u8,
    katakana: bool,
    extended: bool,
    punctuation: bool,
    force_prolongation: bool,
    kana_toggle: u8,
    raw_toggle: u8,
    prolongation_reset: u8,
    vowel_shortener: u8,
    virtual_stop: u8,
) void {
    const c_input = mem.span(input);
    const result = kana.transliterate(
        allocator,
        c_input,
        .{
            .start_with_katakana = katakana,
            .extended_katakana = extended,
            .parse_punctuation = punctuation,
            .force_prolongation = force_prolongation,
            .special_chars = .{
                .kana = kana_toggle,
                .raw_text = raw_toggle,
                .reset_prolongation = prolongation_reset,
                .small_vowel = vowel_shortener,
                .virt_stop = virtual_stop,
            },
        },
    ) catch |err| @panic(@errorName(err));

    handleResult(result.ptr, result.len);
}
