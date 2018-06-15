# Getting started

## Repos

Benötigte Repos:

* http://git.businessie.de/businessie/model.git
* http://git.businessie.de/businessie/codegen2.git


## codegen2.git

beinhaltet:

* das Schema in Typescript beschrieben in `src/schema/v1/model.ts`
* die Model-Prozessore in `src/model-processor/`
* die Generatoren in `src/templates/`

Wenn man das Schema erweitert, kann per `yarn run schema:generate` eine neue JSON-Schema-Beschreibung des Models generieren, welche man per Hand nach `model.git/schema.json` kopieren müsste. (`yarn` erwartet immer im Root-Verzeichnis des Projektes gestartet zu werden.)

### Build und Starten

* `yarn` lädt alle Depenedencies
* `yarn run build` baut alles


Anschließend kann der Kram in zwei Varianten gestartet werden (unter der Annahme, dass das `model.git` in `../model` zu finden ist.

Zum Starten des Web-Servers mit dem JSON-Editor (http://localhost:3100/):
```
codegen.sh serve \
  -m ../model
```
(Der JSON-Editor erwartet per Convention in dem `model` Verzeichnis die Datei `schema.json` zu finden.)

Zum Generieren von Code anhand der `path/to/codegen.json` Konfigurationsdatei:
```
codegen.sh generate \
  -m ../model \
  -c path/to/codegen.json
```

### Build während Entwicklung

* `yarn run build.w` überwacht das `src/`-Verzeichnis und kompiliert bei jeder Änderung


## model.git

beinhaltet:

* `schema.json` das Schema das aus den Typescript-Interfaces generiert wurde
* eine flache Odnerstruktur: jeder Micro-Service hat einen Ordner gleichen Namens, in welchem sich die Modelle befinden. (Die alten XML-Dateien habe ich dort nur als Referenz abgelegt, die werden ignoriert.)

Das `schema.json` wird momentan zwar in erster Linie für den JSON-Editor verwendet, aber es gibt eine Reihe anderer Programmer, die das Schema verarbeiten können. IntelliJ sollte mithilfe des Schema das Bearbeiten von json-Dateien vereinfachen. Habe ich aber noch nicht ausprobiert.

### codegen.json
Sowohl im Frontend als auch im Backend-Repo habe ich schon eine `codegen.json`-Konfigurationsdatei angelegt, die folgenden Aufbau hat:

```json
{
  "wipeDirectories": [
    "src/test/adapters"
  ],
  "modelConfigs":[
    {
      "enabled": true,
      "model": "account/SecurityManagement.json",
      "destination": "src/test/adapters",
      "targets": [
        "ng-*"
      ],
      "config": {}
    }
  ]
}
```

* `wipeDirectories`: relative Pfade, von der Config-Datei ausgehend, zu Ordnern, die bei jeder Generation gelöscht werden; ungeachtet dessen überschreiben die Generatore aber bestehende Dateien
* `enabled` die jweilige "modelConfig"
* `model`: Pfad zum Model innerhalb des Verzeichnes welches beim Starten des Generator angegen wurde `-m ../model`
* `destination`: Pfad relativ von der Config-Datei wo der Code geschrieben wird. Etwaige Unterordnern werden durch die Implementierung des Model-Prozessors und des Generators festgelegt. Es ist es vorgesehen, dass ein Model-Prozessor mehrere Artifakte erzeugt, die dann den gleichen `destination`-Pfad haben. 
* `targets`: Typen von Model-Prozessoren, die gestartet werden. Jeder Model-Prozessor legt dazu seinen eigenen Typen fest:
```
export class NgCrudAdapterModelProcessor implements ModelProcessor {
  public type = 'ng-crud-adapter';
```
* `config`: optionale Einstellungen, die man an den Model-Prozessor übergeben kann (wird bislang nicht genutzt)


## Beispiel

Die `ng-dto`-Generation ist beispielsweise ziemlich simpel.

In `codegen2.git/src/templates/ng-dto` sind drei Dateien:
* `ng-dto.ts.tpl` das eigentlich Template
* `ng-dto.model.ts` das Model (`DtoEditorModel`), passend zum Template
* `ng-dto.generator.ts` führt Template und Model zusammen und führt anschließend noch einen Code-Prettifier aus 

In `codegen2.git/src/model-processor/ng-dto-editor/ng-dto-editor.model-processor.ts` befindet sich die Logik, um aus dem Ausgangsmodel (`Model`) das Zielmodel (`DtoEditorModel`) zu machen. Anschließend wird der `NgDtoEditorGenerator` mit dem Zielmodel und dem `targetBasePath` aufgerufen.

Ein einfaches, passendes Mode wäre `model.git/account/AccountConfiguration.json`. Ein "Standard-Crud-Endpoint" mit einem einfachen DTO. (Das Mapping und die Definition des Datenbank-Models fehlen halt auch hier noch.)

Im frontend repo lässt sich folgender Befehl ausführen `../codegen2/codegen.sh generate -m ../model -c codegen.json` der dann all das generiert, was sich in `src/infra/adapters-gen/account/` befindet. 

Das Ergebnis ist leider noch nicht überall fehlerfrei, weswegen ich die `*.components.ts` bislang nicht eingecheckt habe. Die `*.adapter.ts` sind jedoch OK.


## Links
* https://mozilla.github.io/nunjucks/templating.html
