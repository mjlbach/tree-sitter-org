module.exports = grammar({
  name: "org",

  // TODO: org_headline might need to be an external because of the BOL assertion
  // on stars that can't work in this grammar.js file
  externals: ($) => [$.org_headline],

  rules: {
    // TODO: add the metadata header
    org_file: ($) => repeat($._section),

    _section: ($) =>
      choice(
        $.headline
        // TODO: add other kinds
      ),

    headline: ($) =>
      seq(
        field("level", $.stars),
        field("todo", optional($.todo)),
        field("prio", optional($.priority)),
        field("comment", optional($.comment)),
        field("title", optional($.title)),
        field("tags", optional($.tags)),
        field("end_title", $.line_ending)
      ),

    // text: ($) => /[^\r\n]+/,
    line_ending: ($) => token(choice(/\r\n/, /\n/)),
    // whitespace: ($) => /\s+/,

    stars: ($) => /\*+/,

    priority: ($) => /\[#[A-Ca-c]\]/,
    todo: ($) => token(choice("TODO", "NEXT", "DONE", "WAITING", "CANCELLED")),
    comment: ($) => /COMMENT/,
    tag: ($) => token(prec(25, /[a-zA-Z0-9#%]+/)),
    tags: ($) => seq(token(prec(25, ":")), repeat1(seq($.tag, token(prec(25, ":"))))),
    title: ($) => token(prec(-50, /[^\r\n]+/)),
  },
});
