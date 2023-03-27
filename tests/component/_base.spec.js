import "module-alias/register";
import { request, reporter } from "pactum";
import DBHelper from "@tests/db";

function setRequestDefaults() {
  request.setBaseUrl("http://localhost:3000/api");
}

before(async () => {
  setRequestDefaults();
  setContractTesting();
  await DBHelper.connect();
});

after(async () => {
  await DBHelper.close();
  await reporter.end();
});
