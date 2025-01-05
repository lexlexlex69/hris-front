import aes from 'crypto-js/aes'
import encHex from 'crypto-js/enc-hex'
import padZeroPadding from 'crypto-js/pad-zeropadding'

export const encryptFile = (id) => {
    // console.log(id)
    let data = id.toString();

    // the key and iv should be 32 hex digits each, any hex digits you want, but it needs to be 32 on length each
    let key = encHex.parse("0123456789abcdef0123456789abcdef");
    let iv =  encHex.parse("abcdef9876543210abcdef9876543210");

    // encrypt the message
    let encrypted = aes.encrypt(data, key, {iv:iv, padding:padZeroPadding}).toString();
    return encrypted;
}