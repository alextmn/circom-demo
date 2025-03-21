pragma circom 2.1.6;

include "https://github.com/iden3/circomlib/blob/master/circuits/sha256/sha256.circom";
include "https://github.com/iden3/circomlib/blob/master/circuits/bitify.circom";

template Birthday(){
  component SHA = Sha256(8);
  signal input date[8];
  SHA.in <== date;
 
  signal output out;
  
  component b2n = Bits2Num(64);
  for(var i = 0; i < 64; i++){
    b2n.in[i] <== SHA.out[255-i];
  }
  out <== b2n.out;
  
}

component main  = Birthday();

/* INPUT = {"date":[
  0, 1, 1, 0,
  0, 0, 0, 1
]
} */