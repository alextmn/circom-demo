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

const ethers = require('ethers');
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
console.log({addr, pubkey: [a_x, a_y]})
