export default {
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          code: {
            type: 'string',
          },
        },
      },
    },
  },
};
