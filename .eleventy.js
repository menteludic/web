const R = require('ramda');
const Moment = require('moment');
const sass = require("sass");
const pluginNavigation = require("@11ty/eleventy-navigation");
require('dotenv').config();

module.exports = eleventyConfig => {
  Moment.locale('es');
  eleventyConfig.setDataFileSuffixes([".11tydata", ""]);
  eleventyConfig.addTemplateFormats("scss");

// Creates the extension for use
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css', // optional, default: "html"

		// `compile` is called once per .scss file in the input directory
		compile: async function (inputContent) {
			let result = sass.compileString(inputContent);

			// This is the render function, `data` is the full data cascade
			return async (data) => {
				return result.css;
			};
		},
	});

  eleventyConfig.addPassthroughCopy({ "src/public/": "/public/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/app.js": "/assets/app.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/video-js/": "/assets/video-js/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/unite-gallery/": "/assets/unite-gallery/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/carrousel/": "/assets/carrousel/" });
  eleventyConfig.setFrontMatterParsingOptions({ excerpt: true });

  const _sortBy = (field) => R.sortBy(R.view(R.lensPath(['data', field])))

  eleventyConfig.addCollection('rolLudotecaSorted', function(collectionApi) {
    return R.sortBy(R.compose(R.toLower, R.view(R.lensPath(['data', 'title']))), collectionApi.getFilteredByTag('rolLudoteca'));
  });
  eleventyConfig.addCollection('eventsSorted', function(collectionApi) {
    return R.sortBy(R.view(R.lensPath(['data', 'order'])))(collectionApi.getFilteredByTag('event'));
  });

  const _blogPostsByTags = (tags) => (collectionApi) => {
    const newTags = R.concat(['blog'], tags);
    return R.compose(R.reverse, _sortBy('date'))(collectionApi.getFilteredByTags(...newTags));
  };

  eleventyConfig.addCollection('blogFrontpage', (collectionApi) => R.take(9, _blogPostsByTags(['frontpage'])(collectionApi)));
  eleventyConfig.addCollection('blogBoardgames', _blogPostsByTags(['boardgames']));
  eleventyConfig.addCollection('blogEvents', _blogPostsByTags(['events']));
  eleventyConfig.addCollection('blogTTRpg', _blogPostsByTags(['ttrpg']));
  eleventyConfig.addCollection('blogWargames', _blogPostsByTags(['wargames']));
  eleventyConfig.addCollection('blogAbout', _blogPostsByTags(['about']));

  eleventyConfig.addPlugin(pluginNavigation);

  global.filters = eleventyConfig.javascriptFunctions; // magic happens here
  eleventyConfig.setPugOptions({ // and here
      globals: ['filters']
  });

  eleventyConfig.addFilter("urlFor", (path) => `${process.env.ROOT_FOLDER}${path}`);
  eleventyConfig.addFilter("dateSort", (date) => Moment(date).format('D [de] MMMM [de] YYYY'));

  // eleventyConfig.addCollection('col', (collection) => {
  //   console.log(collection);
  //   return collection.getFilteredByGlob("src/data/ludotecaRol/*.md").reverse();
  // });

  return {
    templateEngineOverride: 'pug,md,js,json',
    dir: {
      input: 'src',
      includes: 'includes',
      data: 'data',
      output: '_build'
    },
    eleventyImport: {
      collections: ['event'],
    }
  };
};
