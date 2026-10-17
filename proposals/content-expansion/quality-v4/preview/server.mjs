// Local-only, read-only playtest server.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const repo=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg'};
http.createServer((req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return}
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(repo,'.'+name);if(!file.startsWith(repo+path.sep)){res.writeHead(403).end();return}fs.stat(file,(error,stat)=>{if(error||!stat.isFile()){res.writeHead(404).end();return}res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});if(req.method==='GET')fs.createReadStream(file).pipe(res);else res.end()});
}).listen(4175,'127.0.0.1',()=>console.log('Isolated Pantry preview: http://127.0.0.1:4175/proposals/content-expansion/quality-v4/preview/index.html'));
