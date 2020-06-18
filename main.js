const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const app = http.createServer((request,response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;
	const pathname = url.parse(_url, true).pathname;
	let html;
	let title, filename, list, description, controlBtns;

	if (pathname === '/') {
		if (queryData.id === undefined) {
			title = "Welcome";
			filename = "INDEX.txt";
			controlBtns = `<a href="/create">Create</a>`;
		} else {
			title = path.parse(queryData.id).base;
			filename = title + '.txt';
			controlBtns = `<a href="/create">Create</a>
				<a href="/update?id=${title}">Update</a>
				<form action="delete_process" method="post">
					<input type="hidden" name="id" value="${title}">
					<input type="submit" value="delete">
			  </form>`;
		}

		fs.readdir('./data', (error, filelist) => {
			list = template.List(filelist);
			fs.readFile(`data/${filename}`, 'utf8', (err, description) => {
				sanitized = sanitizeHtml(description, {allowedTags: ['h1']});
				html = template.HTML(title, list,
					`<h2>${title}</h2><p>${sanitized}</p>`,
					controlBtns);
				response.writeHead(200);
				// response.end(fs.readFileSync(__dirname + _url));
				response.end(html);
			});
		});
	} else if(pathname === '/create') {
		title = 'Create';
		fs.readdir('./data', (error, filelist) => {
			list = template.List(filelist);
			html = template.HTML(title, list, `
				<form action="/create_process" method="post">
					<p><input type="text" name="title" placeholder="title"></p>
					<p><textarea name="description" placeholder="description"></textarea></p>
					<p><input type="submit"></p>
				</form>`, ``);
			response.writeHead(200);
			response.end(html);
		});
	} else if(pathname === '/create_process') {
		let body = '';
		request.on('data', data => {
			body += data;
		});
		request.on('end', () => {
			const post = qs.parse(body);
			title = sanitizeHtml(post.title);
			filename = title + '.txt';
			description = post.description;
			fs.writeFile(`data/${filename}`, description, 'utf8', err => {
				response.writeHead(302, {Location: `/?id=${title}`});
				response.end();
			});
		});
	} else if(pathname === '/update') {
		fs.readdir('./data', (error, filelist) => {
			title = path.parse(queryData.id).base;
			filename = title + '.txt';
			fs.readFile(`data/${filename}`, 'utf8', (err, description) => {
				list = template.List(filelist);
				controlBtns = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;
				html = template.HTML(title, list,`
					<form action="/update_process" method="post">
						<input type="hidden" name="id" value="${title}">
						<p><input type="text" name="title" placeholder="title" value="${title}"></p>
						<p><textarea name="description" placeholder="description">${description}</textarea></p>
						<p><input type="submit"></p>
					</form>`, controlBtns);
				response.writeHead(200);
				response.end(html);
			});
		});
	} else if(pathname === '/update_process') {
		let body = '';
		request.on('data', data => {
				body += data;
		});
		request.on('end', () => {
			const post = qs.parse(body);
			const id = post.id;
			title = sanitizeHtml(post.title);
			filename = title + '.txt';
			description = post.description;
			fs.rename(`data/${id}.txt`, `data/${filename}`, error => {
				fs.writeFile(`data/${filename}`, description, 'utf8', err => {
					response.writeHead(302, {Location: `/?id=${title}`});
					response.end();
				})
			});
		});
	} else if(pathname === '/delete_process') {
		let body = '';
		request.on('data', data => {
				body += data;
		});
		request.on('end', () => {
			const post = qs.parse(body);
			const id = path.parse(post.id).base;
			filename = id + '.txt';
			fs.unlink(`data/${filename}`, error => {
				response.writeHead(302, {Location: `/`});
				response.end();
			})
		});
	} else {
		response.writeHead(404);
		response.end("Not Found");
	}
});
app.listen(3000);