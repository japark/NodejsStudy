const members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]); // k8805
let i = 0;
while(i < members.length) {
  console.log('array loop', members[i]);
  i += 1;
}
 
const roles = {
  programmer:'egoing',
  designer : 'k8805',
  manager : 'hoya'
}
console.log(roles.designer); //k8805
console.log(roles['designer']); //k8805
 
for(let n in roles){
  console.log('object =>', n, 'value =>', roles[n]);
}