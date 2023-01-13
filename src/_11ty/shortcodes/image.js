const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes, loading, className = '', fetchpriority, dataAction) {
  let metadata = await Image("./src/images/" + src, {
    widths: [400, 800, 1200, 1600, null],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "./public/img/"
  });

  let imageAttributes = {
    class: className,
    alt,
    sizes,
    loading,
    fetchpriority,
    decoding: "async",
    "data-action": dataAction
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline"
  });
}

module.exports = imageShortcode;