import crypto from 'crypto';


function buffer2bitArray(b) {
    const res = [];
    for (let i=0; i<b.length; i++) {
        for (let j=0; j<8; j++) {
            res.push((b[i] >> (7-j) &1));
        }
    }
    return res;
}

function bitArray2buffer(a) {
    const len = Math.floor((a.length -1 )/8)+1;
    const b = new Buffer.alloc(len);

    for (let i=0; i<a.length; i++) {
        const p = Math.floor(i/8);
        b[p] = b[p] | (Number(a[i]) << ( 7 - (i%8)  ));
    }
    return b;
}

const testStr = "a";

const b = Buffer.from(testStr, "utf8");

const hash = crypto.createHash("sha256")
    .update(b)
    .digest("hex");

console.log(hash.toString('hex'))

const arrIn = buffer2bitArray(b);
console.log(arrIn)


const hashBigInt = BigInt('0x' + hash.toString('hex'));
let hashBinary = hashBigInt.toString(2);
console.log('SHA-256 hash in binary:', hashBinary);
// // Take the first element of arr
// const dataToHash = Buffer([0]);

// // Convert dataToHash to a string or Buffer if it isn’t already
// // For example, if it’s already a string, just use it as-is
// const hash = crypto.createHash('sha256')
//   .update(dataToHash)         // feed the data
//   .digest('hex');             // produce the hash in hex format

// console.log('SHA-256 hash of the first element:', hash);

// // 2. Convert the hash to a BigInt in base 16 (hex)
// const hashBigInt = BigInt('0x' + hash.toString('hex'));

// // 3. Convert that BigInt to a binary string
// let hashBinary = hashBigInt.toString(2);

// // (Optional) Pad to 256 bits with leading zeros, since SHA-256 is always 256 bits
// hashBinary = hashBinary.padStart(256, '0');

// console.log('SHA-256 hash in binary:', hashBinary);