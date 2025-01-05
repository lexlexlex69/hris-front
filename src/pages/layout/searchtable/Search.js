
export const searchValueFunction = (data,item,value)=>{
    var temp;
    for(var i=0;i<item.length;i++){
        temp = data.filter((row) => {
            return row[item[i]].toLowerCase().includes(value.toLowerCase())
        });
        if(temp.length !==0 ){
            break;
        }
    }
    return temp;
   
}