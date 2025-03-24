const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const crypto = require('crypto');

describe("SHA256 Testing", function async() {

    describe("ZNP hashing testing", function async() {
        
        let circuit;
        it("should compile", async () => {
            circuit = await wasm_tester(path.join(__dirname, "../circuits", "sha256-demo.circom"),
            {verbose: true});
        });

        it("should hash", async () => {
            const testStr = "0";

            const b = Buffer.from(testStr, "utf8");
            console.log("bytes buffer", b[0])

            const hash = crypto.createHash("sha256")
                .update(b)
                .digest("hex");

            console.log(hash.toString('hex'))
            console.log(BigInt("14440298900612100903527489852716267994906270786764094647432410336159120185321").toString(16))

            let witness = await circuit.calculateWitness({data_in:"48"});
            await circuit.assertOut(witness, {out: "14440298900612100903527489852716267994906270786764094647432410336159120185321"})
            await circuit.checkConstraints(witness);
        })
    })

})