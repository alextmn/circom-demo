const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const crypto = require('crypto');
const buildEddsa = require("circomlibjs").buildEddsa;
const buildBabyjub = require("circomlibjs").buildBabyjub;
const assert = require("assert");


describe("ECDSA Poseidon Testing", function async() {
    let circuit;
    let eddsa;
    let babyJub;
    let F;
    
    before( async () => {
        eddsa = await buildEddsa();
        babyJub = await buildBabyjub();
        F = babyJub.F;
        circuit = await wasm_tester(path.join(__dirname, "../circuits", "ecdsa-poseidon-demo.circom"),
            {verbose: true}
        );
    });

    describe("ECDSA Poseidon Signature", function async() {
        it("ECDSA Poseidon should sign", async () => {
        const msg = F.e(12345678);
        console.log(msg);

        const prvKey = Buffer.from("0001020304050607080900010203040506070809000102030405060708090001", "hex");

        const pubKey = eddsa.prv2pub(prvKey);

        const signature = eddsa.signPoseidon(prvKey, msg);

        assert.equal(eddsa.verifyPoseidon(msg, signature, pubKey), true);

        const input = {
            enabled: 1,
            Ax: F.toObject(pubKey[0]),
            Ay: F.toObject(pubKey[1]),
            R8x: F.toObject(signature.R8[0]),
            R8y: F.toObject(signature.R8[1]),
            S: signature.S,
            M: F.toObject(msg)
        };

        // console.log(JSON.stringify(utils.stringifyBigInts(input)));

        const w = await circuit.calculateWitness(input, true);

        await circuit.checkConstraints(w);
        })
    })

})