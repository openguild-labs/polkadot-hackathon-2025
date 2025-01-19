import { Router } from "express";
import Polkadot from "../polkadot/target/ink/polkadot.json"

const router = Router();

router.get("/", (req, res) => {
    let functions = []

    for(let message of Polkadot.spec.messages){
        functions.push({
            name: message.label,
            selector: message.selector,
            args: message.args,
            returnType: message.returnType,
        })
    }

    res.json({
        functions,
    })
})

export default router;
