pragma circom 2.0.0;

include "../circom-ecdsa/circuits/ecdsa.circom";

template ECDSAVerifierSignature(n, k){

    // private inputs for Bank
    signal input bankKycSignatureR[k];
    signal input bankKycSignatureS[k];

    // public KYC public key
    signal input bankKycPubkey[2][k];

    // private SSN
    signal input ssnHash[k];

    // output of the circuit => 1 if at least one of the condition is valid, 0 otherwise
    signal output out;

    // compute proof of KYC
    component verifySignature = ECDSAVerifyNoPubkeyCheck(n, k);

    for (var i = 0; i < k; i++) {
        verifySignature.r[i] <== bankKycSignatureR[i];
        verifySignature.s[i] <== bankKycSignatureS[i];
        verifySignature.msghash[i] <== ssnHash[i];

        for (var j = 0; j < 2; j++) {
            verifySignature.pubkey[j][i] <== bankKycPubkey[j][i];
        }
    }

    out <== verifySignature.result;
}

component main  {public [bankKycPubkey]} = ECDSAVerifierSignature(64, 4);

// {
//     "bankKycSignatureR": [
//         "12477866811219255592",
//         "3641452454142713473",
//         "5630979540933110489",
//         "15394048600215191899"
//     ],
//     "bankKycSignatureS": [
//         "10728334430210397361",
//         "15193483341721690024",
//         "10174484065405913601",
//         "2483378907701409173"
//     ],
//     "ssnHash": [
//         "7374107597115428998",
//         "11092124231272996114",
//         "6296019104128614153",
//         "11939832897997219210"
//     ],
//     "bankKycPubkey": [
//         [
//             "9184773858684377495",
//             "5927304186272187413",
//             "12089562503757628376",
//             "6366437046742599612"
//         ],
//         [
//             "5955600346341698435",
//             "9884649706556557486",
//             "14629691176244201136",
//             "5929242828578721734"
//         ]
//     ]
// }