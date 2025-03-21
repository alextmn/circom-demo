pragma circom 2.1.6;

include "https://github.com/0xPARC/circom-ecdsa/blob/master/circuits/zk-identity/eth.circom";

template Example () {
    signal input pubkey[2][4];
    signal input addr;
    signal output o;
    
    component f = FlattenPubkey(64,4);
    for(var i = 0; i < 4; i++){
        f.chunkedPubkey[0][i] <== pubkey[0][i];
        f.chunkedPubkey[1][i] <== pubkey[1][i];
    }

    component  p= PubkeyToAddress();
    for (var i = 0; i < 512; i++) {
        p.pubkeyBits[i] <== f.pubkeyBits[i];
    }

    log("address", p.address);
    component eq1 = IsEqual();
    eq1.in[0] <== p.address;
    eq1.in[1] <== addr;

    o <== eq1.out;
}

component main { public [ pubkey, addr ] } = Example();

/* INPUT = {
    "addr":"1430925626296018333097869616345544763530582723441",
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
} */