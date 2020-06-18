const template = {
	HTML : function(title, list, body, control) {
		return `
			<!doctype html>
			<html>
				<head>
					<title>WEB - ${title}</title>
					<meta charset="utf-8">
				</head>
				<body>
					<h1><a href="/">WEB</a></h1>
					${list}
					${control}
					${body}
				</body>
			</html>`
	},
	List : function(filelist) {
		let list = '<ul>';
		for (let i = 0; i < filelist.length; i++) {
			if (filelist[i] !== "INDEX.txt") {
				const title = filelist[i].split('.')[0];
				list += `<li><a href="/?id=${title}">${title}</a></li>`
			}
		}
		list += '</ul>';
		return list;
	}
}

// Instead of the line below,
// you can change above from 'const template' to 'module.exports'.
module.exports = template;