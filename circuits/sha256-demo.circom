pragma circom 2.1.6;

include "../circomlib/circuits/sha256/sha256.circom";
include "../circomlib/circuits/bitify.circom";

// d: number of bits in data_in number
template Sha256Demo(d){
  component SHA = Sha256(d);
  signal input data_in;
  signal output out;
  
  
  component n2b = Num2Bits(d);
  n2b.in <== data_in;
  for(var i = 0; i < d; i++){
    SHA.in[i] <== n2b.out[d-1-i];
    log(SHA.in[i]);
  }

  // this is max we can get because of snark's modules wich is approx 2^254
  component b2n = Bits2Num(253);
  for(var i = 0; i < 253; i++){
    b2n.in[i] <== SHA.out[255-i];
  }
  out <== b2n.out;
  
}

component main  = Sha256Demo(8);

/* INPUT = {"data_in":48
} */
