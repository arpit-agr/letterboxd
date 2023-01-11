const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { DateTime } = require("luxon");
const imageShortcode = require("./src/_11ty/shortcodes/image");

module.exports = function(eleventyConfig) {
  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(directoryOutputPlugin);

  //Passthrough copy
  // eleventyConfig.addPassthroughCopy("./src/fonts");
	eleventyConfig.addPassthroughCopy("./src/images");
	// eleventyConfig.addPassthroughCopy("./src/scripts");
  // eleventyConfig.addPassthroughCopy({"./src/favicons": "/"});
	// eleventyConfig.addPassthroughCopy("./src/manifest.webmanifest");

  //Watch target
	// eleventyConfig.addWatchTarget("./src/_includes/css/");
	// eleventyConfig.addWatchTarget('./src/scripts/');

  //Filter
  eleventyConfig.addFilter("cssmin", function(code) {
    if(process.env.NODE_ENV === "production") {
      return new CleanCSS({}).minify(code).styles;
    }
    else {
      return code
    }
  });
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  eleventyConfig.addFilter("addNbsp", (str) => {
    if (!str) {
      return;
    }
    let title = str.replace(/((.*)\s(.*))$/g, "$2&nbsp;$3");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  //Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  eleventyConfig.addNunjucksAsyncShortcode("still", async function (image, alt, sizes, loading, className, fetchpriority, caption) {
    const img = eleventyConfig.javascriptFunctions.image;
    const figCaption = (function (caption) {
      let result;
      if (caption != "") {
        result = `
          <figcaption class="font-special step--1">${caption}</figcaption>
        `.trim();
      } else {
        return `<!-- no caption -->`;
      }
      return result;
    })(caption);
    return `
    <figure class="flow">
      ${ await img(image, alt, sizes, loading, className, fetchpriority) }
      ${figCaption}
    </figure>
    `.trim();
  });
  eleventyConfig.addNunjucksAsyncShortcode("poster", async function (poster, alt, sizes, loading, className="", fetchpriority="", title, year, director) {
    const img = eleventyConfig.javascriptFunctions.image;
    return `
    <div class="aside flow">
      ${ await img(poster, alt, sizes, loading, className, fetchpriority) }
      <p class="lh--2">
        <span class="title font-special fw700">${title}</span>
        <span class="year step--2">${year}</span>
      </p>
      <p class="director step--2">Directed by <br>${director}</p>
    </div>
    `.trim();
  });

  //Transforms
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if(process.env.NODE_ENV === "production" && this.outputPath && this.outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: false,
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true
      });
      return minified;
    }

    return content;
  });

  return {
    // dataTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
		dir: {
			input: 'src',
			output: 'public'
		}
	};
};