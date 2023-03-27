import docs from '@docs';
import swaggerUi from 'swagger-ui-express';

export default ({ app }) => {
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(docs));
};
