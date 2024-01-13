const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript
const uid = function() {
  return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random()*9*Math.pow(10, 12)).toString(36);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && ((req.url === '/upload-disc-data') || (req.url === '/upload-naming-data'))) {
    let data = '';
    
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      var folder_name;
      if (req.url === '/upload-disc-data')
        folder_name = 'color-discrimination-test/';
      else
        folder_name = 'color-naming-test/';

      try {
        const jsonData = JSON.parse(data);

        if (!fs.existsSync(folder_name+'dashboard/'))
          fs.mkdirSync(folder_name+'dashboard/');

        var filename = uid();
        fs.writeFile(folder_name+'dashboard/'+filename+'.json', JSON.stringify(jsonData), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            console.error(err);
          } else {
            fs.copyFile(folder_name+'dashboard.html', folder_name+'dashboard/'+filename+'.html', (err) => {
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end(filename);
            });
          }
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON format');
        console.error(error);
      }
    });
  } else if (req.method === 'POST' && ((req.url === '/upload-feedback') || (req.url === '/upload-naming-feedback'))) {
    let data = '';
    
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      var folder_name;
      if (req.url === '/upload-feedback')
        folder_name = 'color-discrimination-test/dashboard/';
      else
        folder_name = 'color-naming-test/dashboard/';

      try {
        const jsonData = JSON.parse(data);
        var uid = jsonData.uid;
        var fb = jsonData.fb;

        if (!fs.existsSync(folder_name))
          fs.mkdirSync(folder_name);

        fs.readFile(folder_name+uid+'.json', 'utf8', (err, results) => {
          if (err) {
            console.error(err);
            return;
          }
          const resData = JSON.parse(results);
          // update the result obj
          if ("fb" in resData)
            resData.fb = resData.fb+" "+fb;
          else
            resData.fb = fb;

          // update the json file
          fs.writeFile(folder_name+uid+'.json', JSON.stringify(resData), err => {
            if (err) {
              console.error(err);
            } else {
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end();
            }
          });
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON format');
        console.error(error);
      }
    });
  } else if (req.method === 'GET') {
    // https://stackoverflow.com/questions/68177628/how-can-i-use-the-new-url-api-to-get-request-details
    // https://nodejs.org/api/url.html#urlpathname
    const link = new URL(`http://${req.headers.host}${req.url}`)
    var filePath = path.join(__dirname, link.pathname);

    if (filePath.indexOf('.') === -1) filePath += "/index.html";

    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        console.error(err);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 9812;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

