# Filters

This directory contains filters that are available in the templates. In order to create a new filter create
a new class that implements the `TemplateFilter`: 

```typescript
import { Environment } from 'nunjucks';
import { TemplateFilter } from '../app/template-filter';

export class MyFilter implements TemplateFilter {
  public registerFilter(env: Environment): void {
    env.addFilter('myFilter', str => {
      // do something useful
    });
  }
}
```

Finally, a new instance of `MyFilter` must be recorded in the `index.ts`file.
