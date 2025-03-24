const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const {bigint_to_array, bigintToTuple} = require ("./utils/convertors.js");
const ethers = require('ethers');


function pubkeyToXYArrays(pk) {

    const XArr = bigint_to_array(64, 4, BigInt("0x" + pk.slice(4, 4 + 64))).map(
        (el) => el.toString()
    );
    const YArr = bigint_to_array(64, 4, BigInt("0x" + pk.slice(68, 68 + 64))).map(
        (el) => el.toString()
    );

    return [XArr, YArr];
}

function Uint8Array_to_bigint(x) {
    var ret = 0n;
    for (var idx = 0; idx < x.length; idx++) {
        ret = ret * 256n;
        ret = ret + BigInt(x[idx]);
    }
    return ret;
}

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
        it("validate keys and signatures", async () => {
            
            const k = '0cd02d3fe86b87359ce3373ad984d24c2a19672f67c0cdebbfcba7a50db3cb29aec0b934643b5e59d9aae1bc3d5daa8b8ff6025b7ae88b5d655dbd514cce798e'
            const o = pubkeyToXYArrays(k)
            console.log(o)

            const address = ethers.computeAddress('0x04' + k);

            console.log(address, BigInt(address))
        });
        // let circuit;
        // it("should compile", async () => {
        //     circuit = await wasm_tester(path.join(__dirname, "../circuits", "ecdsa-verify.circom"),
        //         { verbose: true });
        // });

        // it("should verify ecdsa signature", async () => {
        //     let witness = await circuit.calculateWitness(witnessData);

        //     await circuit.assertOut(witness, { out: "1" })
        //     await circuit.checkConstraints(witness);
        // })
    })

})