import 'module-alias/register';

export default {
  up: async (queryInterface) => {
    await queryInterface.createSchema('oauth');
    await queryInterface.createSchema('gdrive');
  },

  down: async (queryInterface) => {
    await queryInterface.dropSchema('oauth');
    await queryInterface.createSchema('gdrive');
  },
};
