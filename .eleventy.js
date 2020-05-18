const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
	eleventyConfig.addCollection('sections', function (collection) {
		return collection
			.getFilteredByTag('section')
			.sort(function (a, b) {
				if (a.data.order > b.data.order) {
					return 1;
				} else if (b.data.order > a.data.order) {
					return -1;
				}

				return 0;
			});
	});

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter('datetime', date => {
		return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter('readableDate', date => {
		return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLLL yyyy');
	});

	eleventyConfig.addFilter('sort', arr => {
		return arr.sort(function (a, b) {
			if (a.toLowerCase() > b.toLowerCase()) {
				return 1;
			} else if (b.toLowerCase() > a.toLowerCase()) {
				return -1;
			}

			return 0;
		});
	});

	return {
		templateFormats: [
			'md',
			'njk'
		],

		// If your site lives in a different subdirectory, change this.
		// Leading or trailing slashes are all normalized away, so don’t worry about those.

		// If you don’t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for link URLs (it does not affect your file structure)
		// Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

		// You can also pass this in on the command line using `--pathprefix`
		// pathPrefix: "/",

		markdownTemplateEngine: 'njk',
		dataTemplateEngine: 'njk',

		// These are all optional, defaults are shown:
		dir: {
			input: '.',
			includes: 'includes',
			data: 'data',
			output: 'web'
		}
	};
};
