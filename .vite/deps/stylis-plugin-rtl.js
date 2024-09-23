import {
  __commonJS,
  __toESM
} from "./chunk-V4OQ3NZ2.js";

// node_modules/cssjanus/src/cssjanus.js
var require_cssjanus = __commonJS({
  "node_modules/cssjanus/src/cssjanus.js"(exports, module) {
    var cssjanus2;
    function Tokenizer(regex, token2) {
      var matches = [], index = 0;
      function tokenizeCallback(match2) {
        matches.push(match2);
        return token2;
      }
      function detokenizeCallback() {
        return matches[index++];
      }
      return {
        /**
         * Replace matching strings with tokens.
         *
         * @param {string} str String to tokenize
         * @return {string} Tokenized string
         */
        tokenize: function(str) {
          return str.replace(regex, tokenizeCallback);
        },
        /**
         * Restores tokens to their original values.
         *
         * @param {string} str String previously run through tokenize()
         * @return {string} Original string
         */
        detokenize: function(str) {
          return str.replace(new RegExp("(" + token2 + ")", "g"), detokenizeCallback);
        }
      };
    }
    function CSSJanus() {
      var temporaryToken = "`TMP`", noFlipSingleToken = "`NOFLIP_SINGLE`", noFlipClassToken = "`NOFLIP_CLASS`", commentToken = "`COMMENT`", nonAsciiPattern = "[^\\u0020-\\u007e]", unicodePattern = "(?:(?:\\\\[0-9a-f]{1,6})(?:\\r\\n|\\s)?)", numPattern = "(?:[0-9]*\\.[0-9]+|[0-9]+)", unitPattern = "(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)", directionPattern = "direction\\s*:\\s*", urlSpecialCharsPattern = "[!#$%&*-~]", validAfterUriCharsPattern = `['"]?\\s*`, nonLetterPattern = "(^|[^a-zA-Z])", charsWithinSelectorPattern = "[^\\}]*?", noFlipPattern = "\\/\\*\\!?\\s*@noflip\\s*\\*\\/", commentPattern = "\\/\\*[^*]*\\*+([^\\/*][^*]*\\*+)*\\/", escapePattern = "(?:" + unicodePattern + "|\\\\[^\\r\\n\\f0-9a-f])", nmstartPattern = "(?:[_a-z]|" + nonAsciiPattern + "|" + escapePattern + ")", nmcharPattern = "(?:[_a-z0-9-]|" + nonAsciiPattern + "|" + escapePattern + ")", identPattern = "-?" + nmstartPattern + nmcharPattern + "*", quantPattern = numPattern + "(?:\\s*" + unitPattern + "|" + identPattern + ")?", signedQuantPattern = "((?:-?" + quantPattern + ")|(?:inherit|auto))", fourNotationQuantPropsPattern = "((?:margin|padding|border-width)\\s*:\\s*)", fourNotationColorPropsPattern = "((?:-color|border-style)\\s*:\\s*)", colorPattern = "(#?" + nmcharPattern + "+|(?:rgba?|hsla?)\\([ \\d.,%-]+\\))", urlCharsPattern = "(?:" + urlSpecialCharsPattern + "|" + nonAsciiPattern + "|" + escapePattern + ")*?", lookAheadNotLetterPattern = "(?![a-zA-Z])", lookAheadNotOpenBracePattern = "(?!(" + nmcharPattern + `|\\r?\\n|\\s|#|\\:|\\.|\\,|\\+|>|~|\\(|\\)|\\[|\\]|=|\\*=|~=|\\^=|'[^']*'|"[^"]*"|` + commentToken + ")*?{)", lookAheadNotClosingParenPattern = "(?!" + urlCharsPattern + validAfterUriCharsPattern + "\\))", lookAheadForClosingParenPattern = "(?=" + urlCharsPattern + validAfterUriCharsPattern + "\\))", suffixPattern = "(\\s*(?:!important\\s*)?[;}])", temporaryTokenRegExp = /`TMP`/g, commentRegExp = new RegExp(commentPattern, "gi"), noFlipSingleRegExp = new RegExp("(" + noFlipPattern + lookAheadNotOpenBracePattern + "[^;}]+;?)", "gi"), noFlipClassRegExp = new RegExp("(" + noFlipPattern + charsWithinSelectorPattern + "})", "gi"), directionLtrRegExp = new RegExp("(" + directionPattern + ")ltr", "gi"), directionRtlRegExp = new RegExp("(" + directionPattern + ")rtl", "gi"), leftRegExp = new RegExp(nonLetterPattern + "(left)" + lookAheadNotLetterPattern + lookAheadNotClosingParenPattern + lookAheadNotOpenBracePattern, "gi"), rightRegExp = new RegExp(nonLetterPattern + "(right)" + lookAheadNotLetterPattern + lookAheadNotClosingParenPattern + lookAheadNotOpenBracePattern, "gi"), leftInUrlRegExp = new RegExp(nonLetterPattern + "(left)" + lookAheadForClosingParenPattern, "gi"), rightInUrlRegExp = new RegExp(nonLetterPattern + "(right)" + lookAheadForClosingParenPattern, "gi"), ltrInUrlRegExp = new RegExp(nonLetterPattern + "(ltr)" + lookAheadForClosingParenPattern, "gi"), rtlInUrlRegExp = new RegExp(nonLetterPattern + "(rtl)" + lookAheadForClosingParenPattern, "gi"), cursorEastRegExp = new RegExp(nonLetterPattern + "([ns]?)e-resize", "gi"), cursorWestRegExp = new RegExp(nonLetterPattern + "([ns]?)w-resize", "gi"), fourNotationQuantRegExp = new RegExp(fourNotationQuantPropsPattern + signedQuantPattern + "(\\s+)" + signedQuantPattern + "(\\s+)" + signedQuantPattern + "(\\s+)" + signedQuantPattern + suffixPattern, "gi"), fourNotationColorRegExp = new RegExp(fourNotationColorPropsPattern + colorPattern + "(\\s+)" + colorPattern + "(\\s+)" + colorPattern + "(\\s+)" + colorPattern + suffixPattern, "gi"), bgHorizontalPercentageRegExp = new RegExp("(background(?:-position)?\\s*:\\s*(?:[^:;}\\s]+\\s+)*?)(" + quantPattern + ")", "gi"), bgHorizontalPercentageXRegExp = new RegExp("(background-position-x\\s*:\\s*)(-?" + numPattern + "%)", "gi"), borderRadiusRegExp = new RegExp("(border-radius\\s*:\\s*)" + signedQuantPattern + "(?:(?:\\s+" + signedQuantPattern + ")(?:\\s+" + signedQuantPattern + ")?(?:\\s+" + signedQuantPattern + ")?)?(?:(?:(?:\\s*\\/\\s*)" + signedQuantPattern + ")(?:\\s+" + signedQuantPattern + ")?(?:\\s+" + signedQuantPattern + ")?(?:\\s+" + signedQuantPattern + ")?)?" + suffixPattern, "gi"), boxShadowRegExp = new RegExp("(box-shadow\\s*:\\s*(?:inset\\s*)?)" + signedQuantPattern, "gi"), textShadow1RegExp = new RegExp("(text-shadow\\s*:\\s*)" + signedQuantPattern + "(\\s*)" + colorPattern, "gi"), textShadow2RegExp = new RegExp("(text-shadow\\s*:\\s*)" + colorPattern + "(\\s*)" + signedQuantPattern, "gi"), textShadow3RegExp = new RegExp("(text-shadow\\s*:\\s*)" + signedQuantPattern, "gi"), translateXRegExp = new RegExp("(transform\\s*:[^;}]*)(translateX\\s*\\(\\s*)" + signedQuantPattern + "(\\s*\\))", "gi"), translateRegExp = new RegExp("(transform\\s*:[^;}]*)(translate\\s*\\(\\s*)" + signedQuantPattern + "((?:\\s*,\\s*" + signedQuantPattern + "){0,2}\\s*\\))", "gi");
      function calculateNewBackgroundPosition(match2, pre, value) {
        var idx, len;
        if (value.slice(-1) === "%") {
          idx = value.indexOf(".");
          if (idx !== -1) {
            len = value.length - idx - 2;
            value = 100 - parseFloat(value);
            value = value.toFixed(len) + "%";
          } else {
            value = 100 - parseFloat(value) + "%";
          }
        }
        return pre + value;
      }
      function flipBorderRadiusValues(values) {
        switch (values.length) {
          case 4:
            values = [values[1], values[0], values[3], values[2]];
            break;
          case 3:
            values = [values[1], values[0], values[1], values[2]];
            break;
          case 2:
            values = [values[1], values[0]];
            break;
          case 1:
            values = [values[0]];
            break;
        }
        return values.join(" ");
      }
      function calculateNewBorderRadius(match2, pre) {
        var values, args = [].slice.call(arguments), firstGroup = args.slice(2, 6).filter(function(val) {
          return val;
        }), secondGroup = args.slice(6, 10).filter(function(val) {
          return val;
        }), post = args[10] || "";
        if (secondGroup.length) {
          values = flipBorderRadiusValues(firstGroup) + " / " + flipBorderRadiusValues(secondGroup);
        } else {
          values = flipBorderRadiusValues(firstGroup);
        }
        return pre + values + post;
      }
      function flipSign(value) {
        if (parseFloat(value) === 0) {
          return value;
        }
        if (value[0] === "-") {
          return value.slice(1);
        }
        return "-" + value;
      }
      function calculateNewShadow(match2, property, offset) {
        return property + flipSign(offset);
      }
      function calculateNewTranslate(match2, property, prefix2, offset, suffix) {
        return property + prefix2 + flipSign(offset) + suffix;
      }
      function calculateNewFourTextShadow(match2, property, color, space, offset) {
        return property + color + space + flipSign(offset);
      }
      return {
        /**
         * Transform a left-to-right stylesheet to right-to-left.
         *
         * @param {string} css Stylesheet to transform
         * @param {Object} options Options
         * @param {boolean} [options.transformDirInUrl=false] Transform directions in URLs
         * (e.g. 'ltr', 'rtl')
         * @param {boolean} [options.transformEdgeInUrl=false] Transform edges in URLs
         * (e.g. 'left', 'right')
         * @return {string} Transformed stylesheet
         */
        "transform": function(css, options) {
          var noFlipSingleTokenizer = new Tokenizer(noFlipSingleRegExp, noFlipSingleToken), noFlipClassTokenizer = new Tokenizer(noFlipClassRegExp, noFlipClassToken), commentTokenizer = new Tokenizer(commentRegExp, commentToken);
          css = commentTokenizer.tokenize(
            noFlipClassTokenizer.tokenize(
              noFlipSingleTokenizer.tokenize(
                // We wrap tokens in ` , not ~ like the original implementation does.
                // This was done because ` is not a legal character in CSS and can only
                // occur in URLs, where we escape it to %60 before inserting our tokens.
                css.replace("`", "%60")
              )
            )
          );
          if (options.transformDirInUrl) {
            css = css.replace(ltrInUrlRegExp, "$1" + temporaryToken).replace(rtlInUrlRegExp, "$1ltr").replace(temporaryTokenRegExp, "rtl");
          }
          if (options.transformEdgeInUrl) {
            css = css.replace(leftInUrlRegExp, "$1" + temporaryToken).replace(rightInUrlRegExp, "$1left").replace(temporaryTokenRegExp, "right");
          }
          css = css.replace(directionLtrRegExp, "$1" + temporaryToken).replace(directionRtlRegExp, "$1ltr").replace(temporaryTokenRegExp, "rtl").replace(leftRegExp, "$1" + temporaryToken).replace(rightRegExp, "$1left").replace(temporaryTokenRegExp, "right").replace(cursorEastRegExp, "$1$2" + temporaryToken).replace(cursorWestRegExp, "$1$2e-resize").replace(temporaryTokenRegExp, "w-resize").replace(borderRadiusRegExp, calculateNewBorderRadius).replace(boxShadowRegExp, calculateNewShadow).replace(textShadow1RegExp, calculateNewFourTextShadow).replace(textShadow2RegExp, calculateNewFourTextShadow).replace(textShadow3RegExp, calculateNewShadow).replace(translateXRegExp, calculateNewTranslate).replace(translateRegExp, calculateNewTranslate).replace(fourNotationQuantRegExp, "$1$2$3$8$5$6$7$4$9").replace(fourNotationColorRegExp, "$1$2$3$8$5$6$7$4$9").replace(bgHorizontalPercentageRegExp, calculateNewBackgroundPosition).replace(bgHorizontalPercentageXRegExp, calculateNewBackgroundPosition);
          css = noFlipSingleTokenizer.detokenize(
            noFlipClassTokenizer.detokenize(
              commentTokenizer.detokenize(css)
            )
          );
          return css;
        }
      };
    }
    cssjanus2 = new CSSJanus();
    if (typeof module !== "undefined" && module.exports) {
      exports.transform = function(css, options, transformEdgeInUrl) {
        var norm;
        if (typeof options === "object") {
          norm = options;
        } else {
          norm = {};
          if (typeof options === "boolean") {
            norm.transformDirInUrl = options;
          }
          if (typeof transformEdgeInUrl === "boolean") {
            norm.transformEdgeInUrl = transformEdgeInUrl;
          }
        }
        return cssjanus2.transform(css, norm);
      };
    } else if (typeof window !== "undefined") {
      window["cssjanus"] = cssjanus2;
    }
  }
});

// node_modules/stylis-plugin-rtl/dist/stylis-rtl.js
var import_cssjanus = __toESM(require_cssjanus());

// node_modules/stylis/src/Enum.js
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var MEDIA = "@media";
var IMPORT = "@import";
var SUPPORTS = "@supports";
var KEYFRAMES = "@keyframes";

// node_modules/stylis/src/Utility.js
var abs = Math.abs;
var from = String.fromCharCode;
function trim(value) {
  return value.trim();
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search, position2) {
  return value.indexOf(search, position2);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}

// node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root, parent, type, props, children, length2, siblings) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "", siblings };
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      case type:
        return position;
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}

// node_modules/stylis/src/Parser.js
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      case 40:
        if (previous != 108 && charat(characters2, length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f", abs(index ? points[index - 1] : 0)) != -1)
            ampersand = -1;
          break;
        }
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
            break;
          default:
            characters2 += "/";
        }
        break;
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          case 0:
          case 125:
            scanning = 0;
          case 59 + offset:
            if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
            if (property > 0 && strlen(characters2) - length2)
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
            break;
          case 59:
            characters2 += ";";
          default:
            append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
              else
                switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                    break;
                  default:
                    parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2, siblings) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j = 0, k = 0; i < index; ++i)
    for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
      if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
        props[k++] = z;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2, siblings);
}
function comment(value, root, parent, siblings) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
function declaration(value, root, parent, length2, siblings) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings);
}

// node_modules/stylis/src/Serializer.js
function serialize(children, callback) {
  var output = "";
  for (var i = 0; i < children.length; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}

// node_modules/stylis-plugin-rtl/dist/stylis-rtl.js
function stringifyPreserveComments(element, index, children) {
  switch (element.type) {
    case IMPORT:
    case DECLARATION:
    case COMMENT:
      return element.return = element.return || element.value;
    case RULESET: {
      element.value = Array.isArray(element.props) ? element.props.join(",") : element.props;
      if (Array.isArray(element.children)) {
        element.children.forEach(function(x) {
          if (x.type === COMMENT)
            x.children = x.value;
        });
      }
    }
  }
  var serializedChildren = serialize(Array.prototype.concat(element.children), stringifyPreserveComments);
  return strlen(serializedChildren) ? element.return = element.value + "{" + serializedChildren + "}" : "";
}
function stylisRTLPlugin(element, index, children, callback) {
  if (element.type === KEYFRAMES || element.type === SUPPORTS || element.type === RULESET && (!element.parent || element.parent.type === MEDIA || element.parent.type === RULESET)) {
    var stringified = import_cssjanus.default.transform(stringifyPreserveComments(element, index, children));
    element.children = stringified ? compile(stringified)[0].children : [];
    element.return = "";
  }
}
Object.defineProperty(stylisRTLPlugin, "name", { value: "stylisRTLPlugin" });
var stylis_rtl_default = stylisRTLPlugin;
export {
  stylis_rtl_default as default
};
/*! Bundled license information:

cssjanus/src/cssjanus.js:
  (*!
   * CSSJanus. https://github.com/cssjanus/cssjanus
   *
   * Copyright 2014 Trevor Parscal
   * Copyright 2010 Roan Kattouw
   * Copyright 2008 Google Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=stylis-plugin-rtl.js.map