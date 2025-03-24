const path = require("path");
const wasm_tester = require("circom_tester").wasm;

describe("Simple Verifier Testing", function async() {
    this.timeout(1000 * 1000);

    const witnessData = {
        "addr": "1430925626296018333097869616345544763530582723441",
        "pubkey":
            [
                [
                    "4297090384558010636",
                    "15570961018970546401",
                    "14098239113030652618",
                    "6992847581593685429"
                ],
                [
                    "8827192915131495652",
                    "12787953630500161547",
                    "18155383519323223223",
                    "2853706514784047367"
                ]
            ]
    };

    describe("Keccak 256 Testing", function async() {
        let circuit;
        it("should compile", async () => {
            circuit = await wasm_tester(path.join(__dirname, "../circuits", "keccak256-demo.circom"),
                { verbose: true });
        });

        it("should calc address", async () => {
            let witness = await circuit.calculateWitness(witnessData);

            await circuit.assertOut(witness, { out: "1" })
            await circuit.checkConstraints(witness);
        })
    })

})