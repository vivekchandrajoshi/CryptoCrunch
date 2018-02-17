function response(data,err, callback) {
    var resObj = new Object();
    if(err){
        resObj['status'] = 500;
        resObj['success'] = false;
        resObj['error'] = err.message;
    } else{
        resObj['status'] = 200;
        resObj['success'] = true;
        resObj['data'] = data;
    }
    callback(resObj);
}

//JavaScript-C24.2.0 (SpiderMonkey)

// var user = {
//     name: { type: "string", required: true, min:3,max:5 },
//     age: { type: "string", required: true, match : '/2/g' },
//     gender: { type: "string", enum: ['Critical', 'High', 'Medium', 'Low'] },
//     intrest: {type: "schema", name: 'intrest', required: true },
//     intrestTest: {type: "array", required: true },
//     array: []
// }


// var intrest = {
//     name: { type: "string", required: true },
//     age: { type: "number", required: true }
// }

// var data = {
//     name: "jdqqwaadada",
//     age: '25',
//     gender: "Male",
//     intrest:[{name :"abc", age:25}],
//     array: [0],
//     intrestTest: []
// }

// var dateTime = {
//     updatedBy :"",
//     updatedOn : "",
//     createdBy :"",
//     createdOn :"",
//     deletedOn : "",
//     deletedBy :"",
// }


function setDate(obj, src,mode, userName) {
    for (var key in src) {
        if (src.hasOwnProperty(key) && key.indexOf(mode)===0){
            if(key === mode + "By" ){
                obj[key] =userName;
            }else{
                obj[key] = new Date();
            }
        }
    }
    return obj;
}


// set date object in any object

//print(JSON.stringify(setDate(data, dateTime ,'created', 'vivek')));


// check validation on schema

// validateModel(user, data);
var newArray = [];

function validateModel(schemaName, schemaData) {
    console.log("schemaname", schemaName, "schemadata",  schemaData);
    for (value in schemaName) {
        const returnData  =  checkRequired(schemaName[value], value, schemaData[value]);
        if(returnData){
            // console.log(returnData);
             newArray.push(returnData);
        }
    }
    return newArray;
}

// check type is matched or not

function checkType(schemaData, key, value ,type) {
    if (schemaData['type'] === type) {
        return ValidateData(schemaData, key, value)       ;
    } else if(type === 'object'){
        for (schema in value) {
            validateModel( this[schemaData['name']],value[schema]);
        }
    } else {
        return key + ' is not a ' + schemaData['type'] ;
    }
}

// checked model data is required or not

function checkRequired(schemaData, key ,value){
    const type =  typeof value;
    if (schemaData['required']) {
        if(value  && schemaData['type'] !== 'array'){
            return checkType(schemaData, key, value, type);
        } else if ( schemaData['type'] === 'array' && value.length>0 ){
            return checkType(schemaData, key, value, type);
        } else{
            return  key + " is required";
        }
    } else {
        return checkType(schemaData, key, value, type);
    }

}



function ValidateData(schemaData, key , value){
    if(schemaData['min']){
        if(value.length < schemaData['min']){
            return  key + " less then " + schemaData['min'];
        }
    }

    if(schemaData['max']){
        if(value.length > schemaData['max']){
            return  key + " greater then " + schemaData['max'];
        }
    }

    if(schemaData['match'] && schemaData['type'] === 'string'){
        if(!value.match(schemaData['match'])){
            print("match",value.match(schemaData['match']));
            return  key + " not match " ;
        }
    }
}

module.exports = {response, validateModel};
