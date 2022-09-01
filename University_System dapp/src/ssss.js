
let sss;
var str = "VM Exception while processing transaction: revert Professor already registered";
var words = str.split(" ");
for (let i = 0; i<words.length;i++){
    if (words[i] == "revert"){
        sss=i;
    }
    
}
let array=[];
for (let i = sss+1 ; i<words.length ; i++ ){
    array.push(words[i]);
}
console.log(array);
let qq = array.toString()

var newStr = qq.replace(/,/g, ' ');
console.log(newStr);