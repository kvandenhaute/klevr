// auto generated icon mixins / functions

$icon-font-name: '<%= fontName %>' !default;
$font-path: '../fonts/' !default;

@font-face {
	font-family: '<%= fontName %>';
	font-style: normal;
	font-weight: 400;
	src: url($font-path + 'icons.woff2') format('woff2'), url($font-path + 'icons.woff') format('woff');
}

@function <%= prefix%>-char($filename, $fallback) {
	$char: $fallback;
<% _.each(glyphs, function(glyph, i) { if (i === 0) { %>
	@if $filename == <%= glyph.name %> {
		$char: '\<%= glyph.codepoint %>';
	}<% } else {
%> @else if $filename == <%= glyph.name %> {
		$char: '\<%= glyph.codepoint %>';
	}<% }
 }); %>

	@return $char;
}

@mixin <%= prefix%>-styles() {
	font-family: $icon-font-name, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-style: normal;
	font-variant: normal;
	font-weight: normal;
	line-height: 1;
	text-decoration: none;
	text-transform: none;
	speak: none; // only necessary if not using the private unicode range (firstGlyph option)
}

@mixin <%= prefix%>($filename, $fallback: '', $insert: before) {
	&:#{$insert} {
		@include <%= prefix%>-styles();

		content: <%= prefix%>-char($filename, $fallback);
		@content;
	}
}
