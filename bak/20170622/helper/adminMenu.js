'use strict'
//子孙树，从顶级往下找到是有的子子孙孙
// const sonsTree = (arr,id) =>{
//     var temp = [],lev=0;
//     var forFn = function(arr, id,lev){
//         for (var i = 0; i < arr.length; i++) {
//             var item = arr[i];
//             if (item.pId==id) {
//                 item.lev=lev;
//                 temp.push(item);
//                 forFn(arr,item.id,lev+1);
//             }
//         }
//     };
//     forFn(arr, id,lev);
//     return temp;
// }
//console.log(sonsTree(doc,"0"));
const getAdminMenu = (Model,callback) => {
    // Model.find().exec(function (err, doc) {
    //     callback(err, doc);
    // });
    Model.find().exec(function (err, doc) {
        callback(err, doc);
    });
}

module.exports = getAdminMenu;