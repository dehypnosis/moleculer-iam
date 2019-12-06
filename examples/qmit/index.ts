import { broker, isDebug } from "./iam";

broker.start()
  .then(() => {
    if (isDebug) broker.repl();
  });
