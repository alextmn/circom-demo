const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const ethers = require('ethers');
const assert = require("assert");

function bigint_to_array(n, k, x) {
    let mod = 1n;
    for (var idx = 0; idx < n; idx++) {
        mod = mod * 2n;
    }

    let ret = [];
    var x_temp = x;
    for (var idx = 0; idx < k; idx++) {
        ret.push((x_temp % mod).toString());
        x_temp = x_temp / mod;
    }
    return ret;
}

function array_to_bigint(n, k, arr) {
    // Compute 2^n as a BigInt
    let mod = 1n;
    for (let i = 0; i < n; i++) {
        mod *= 2n;
    }

    // Rebuild the original BigInt by starting from the highest chunk
    // (which is the last element in 'arr') and moving down to the lowest.
    let result = 0n;
    for (let i = k - 1; i >= 0; i--) {
        result = result * mod + BigInt(arr[i]);
    }
    return result;
}



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
        it("witness should match the private key", async () => {
            const privateKey = '0x2098b2a93061493dddfbc7de25585fafeddf04fded2e60b57fb18a049c6d6824';
            const wallet = new ethers.Wallet(privateKey);

            addr = BigInt(wallet.address)
            console.log('Wallet address:', wallet.address, addr);

            x = BigInt(privateKey)
            a = bigint_to_array(64,4, x);
            console.log('private key:', a);

            const publicKey = wallet.signingKey.publicKey; 
            console.log('Public Key (uncompressed):', publicKey);

            // 3) Extract x and y parts. The first byte is "0x04" (uncompressed key prefix)
            const uncompressedKeyHex = publicKey.slice(2); // remove leading "0x"
            const prefix = uncompressedKeyHex.slice(0, 2); // should be "04"
            const xHex = uncompressedKeyHex.slice(2, 66);  // 64 hex chars = 32 bytes
            const yHex = uncompressedKeyHex.slice(66);     // 64 hex chars = 32 bytes

            // 4) Convert x and y to BigInt
            const xBigInt = BigInt('0x' + xHex);
            const yBigInt = BigInt('0x' + yHex);

            a_x = bigint_to_array(64,4, xBigInt);
            a_y = bigint_to_array(64,4, yBigInt);
            // console.log({addr, pubkey: [a_x, a_y]})
            assert.equal(BigInt(addr), BigInt(witnessData.addr), "address does nto match");
            assert.deepStrictEqual([a_x, a_y], witnessData.pubkey, "pubkey does not match");

        });

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