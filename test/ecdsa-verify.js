const path = require("path");
const wasm_tester = require("circom_tester").wasm;

describe("ECDSA Verifier Testing", function async() {
    this.timeout(1000 * 1000);

    const witnessData = {
        "bankKycSignatureR": [
            "12477866811219255592",
            "3641452454142713473",
            "5630979540933110489",
            "15394048600215191899"
        ],
        "bankKycSignatureS": [
            "10728334430210397361",
            "15193483341721690024",
            "10174484065405913601",
            "2483378907701409173"
        ],
        "ssnHash": [
            "7374107597115428998",
            "11092124231272996114",
            "6296019104128614153",
            "11939832897997219210"
        ],
        "bankKycPubkey": [
            [
                "9184773858684377495",
                "5927304186272187413",
                "12089562503757628376",
                "6366437046742599612"
            ],
            [
                "5955600346341698435",
                "9884649706556557486",
                "14629691176244201136",
                "5929242828578721734"
            ]
        ]
    };

    describe("ECDSA Circuit Compiling", function async() {
        let circuit;
        it("should compile", async () => {
            circuit = await wasm_tester(path.join(__dirname, "../circuits", "ecdsa-verify.circom"),
                { verbose: true });
        });

        it("should verify ecdsa signature", async () => {
            let witness = await circuit.calculateWitness(witnessData);

            await circuit.assertOut(witness, { out: "1" })
            await circuit.checkConstraints(witness);
        })
    })

})