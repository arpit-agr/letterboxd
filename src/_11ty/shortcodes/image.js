const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes, loading, className = '', fetchpriority) {
  let metadata = await Image(src, {
    widths: [320, 640, 960, 1280],
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
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline"
  });
}

module.exports = imageShortcode;