import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as _path from 'path';
import { ServerService } from './server.service';
import { writeFileSync } from 'fs';

export function startServer(port: number, modelPath: string): void {
  const ngDir = _path.join(__dirname, '..', '..', 'ng');

  console.log(ngDir);

  const app = express();
  app.use(bodyParser.text());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  const service = new ServerService();

  // -- provide a list of all models that can be edited
  app.get('/api/models', (req, res) => {
    res.json(service.getModels(modelPath));
  });

  // -- provide the schema
  app.get('/api/schema.json', (req, res) => {
    res.sendFile(_path.join(modelPath, 'schema.json'));
  });

  // -- provide the requested model
  app.get('/api/models/*', (req, res) => {
    const path = req.path.slice(12); // remove '/api/models/'
    res.sendFile(_path.join(modelPath, path));
  });

  // -- write changed model to filesystem
  app.put('/api/models/*', (req, res) => {
    const path = req.path.slice(12); // remove '/api/models/'
    const body = req.body;

    writeFileSync(_path.join(modelPath, path), JSON.stringify(body, null, 2));

    res.send();
  });

  // -- serve angular frontend
  app.all('/*', (req, res) => {
    const httpMethod = req.method;
    const path = req.path;

    res.sendFile(_path.join(ngDir, path));

    console.log(httpMethod, path);
  });

  app.listen(port, () =>
    console.log(`cb-codegen server listening on port ${port}!`)
  );
}
