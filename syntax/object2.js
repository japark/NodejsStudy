// 자바스크립트에서는 함수도 값이다.
// 즉, 대입이 가능하다.
const f = function() {
  console.log(1+1);
  console.log(1+2);
}
const a = [f];
a[0]();
 
const o = {
  func : f
}
o.func();