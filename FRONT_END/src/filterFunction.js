const isValide = (params,list=[])=>{
    return list.every(fn=>fn(...params))
}

//params : list, liste function
//listItems : list to filter
//listFunctionTest: list of all function to test

const filterFunction=(listItems,listFunctionTest=[])=>{
    if(Array.isArray(listItems)) return listItems.filter((...args)=>isValide(Array.from(args),listFunctionTest))
    if(typeof listItems=="object"){
        return Object.entries(listItems).filter(([name,value])=>isValide([value,name,listItems],listFunctionTest))
    }
    return [listItems].filter((...args)=>isValide(Array.from(args),listFunctionTest))
}

// const newListe=filterFunction(equipement,listFunction)
// console.log(newListe);

export default filterFunction;
