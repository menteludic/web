module.exports = {
	tags: [
		'blog',
		'menteludic'
	],
	layout: "layouts/blog/blog_entry.pug",
	permalink: "blog/{{ title | slugify }}/index.html"
};