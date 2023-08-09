import { error } from "console";
import { connectDb } from "./DBConnection";

connectDb()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));
