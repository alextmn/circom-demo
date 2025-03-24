const path = require("path");
const wasm_tester = require("circom_tester").wasm;

describe("Simple Verifier Testing", function async() {

    describe("Multipler Testing", function () {
        it("should multiply", async () => {
            let circuit = await wasm_tester(path.join(__dirname, "../circuits", "multipler.circom"),
        {verbose: true});
            let witness = await circuit.calculateWitness({a:"2",b:"3"});

            await circuit.assertOut(witness, {out: "6"})
            await circuit.checkConstraints(witness);
        })
    })

})